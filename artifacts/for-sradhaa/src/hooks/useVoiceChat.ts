import { useState, useEffect, useRef, useCallback } from "react";

export type VoiceStatus = "idle" | "calling" | "connected" | "error";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function useVoiceChat(phone: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [muted, setMuted] = useState(false);
  const [otherSpeaking, setOtherSpeaking] = useState(false);
  const [wsReady, setWsReady] = useState(false);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track remote audio level for "speaking" indicator
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!phone) return;
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${proto}//${window.location.host}/api/ws?phone=${phone}`);
    wsRef.current = ws;

    ws.onopen = () => setWsReady(true);
    ws.onclose = () => { setWsReady(false); setStatus("idle"); };

    ws.onmessage = async (ev) => {
      try {
        const msg = JSON.parse(ev.data) as Record<string, unknown>;

        if (msg.type === "voice_request") {
          // Incoming call — auto-accept
          const pc = await createPC();
          if (!pc) return;
          await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: msg.sdp as string }));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          send({ type: "voice_answer", sdp: answer.sdp });
          setStatus("connected");
        }

        if (msg.type === "voice_offer") {
          const pc = await createPC();
          if (!pc) return;
          await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: msg.sdp as string }));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          send({ type: "voice_answer", sdp: answer.sdp });
          setStatus("connected");
        }

        if (msg.type === "voice_answer") {
          const pc = pcRef.current;
          if (!pc) return;
          if (pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: msg.sdp as string }));
            setStatus("connected");
          }
        }

        if (msg.type === "voice_ice") {
          const pc = pcRef.current;
          if (pc && msg.candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(msg.candidate as RTCIceCandidateInit));
            } catch {}
          }
        }

        if (msg.type === "voice_end") {
          hangup(false);
        }
      } catch {}
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [phone]);

  function send(data: object) {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  async function createPC(): Promise<RTCPeerConnection | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;

      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }

      pc.onicecandidate = (e) => {
        if (e.candidate) send({ type: "voice_ice", candidate: e.candidate.toJSON() });
      };

      pc.ontrack = (e) => {
        const remoteStream = e.streams[0];
        if (!remoteAudioRef.current) {
          const audio = new Audio();
          audio.autoplay = true;
          remoteAudioRef.current = audio;
        }
        remoteAudioRef.current.srcObject = remoteStream;

        // Speaking detection
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(remoteStream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        detectSpeaking(analyser);
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          hangup(false);
        }
      };

      return pc;
    } catch (e) {
      setStatus("error");
      return null;
    }
  }

  function detectSpeaking(analyser: AnalyserNode) {
    const data = new Uint8Array(analyser.frequencyBinCount);
    function check() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((s, v) => s + v, 0) / data.length;
      if (avg > 10) {
        setOtherSpeaking(true);
        if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
        speakingTimerRef.current = setTimeout(() => setOtherSpeaking(false), 800);
      }
      animFrameRef.current = requestAnimationFrame(check);
    }
    animFrameRef.current = requestAnimationFrame(check);
  }

  const startCall = useCallback(async () => {
    if (status !== "idle" || !wsReady) return;
    setStatus("calling");

    const pc = await createPC();
    if (!pc) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    send({ type: "voice_offer", sdp: offer.sdp });
  }, [status, wsReady]);

  const hangup = useCallback((sendSignal = true) => {
    if (sendSignal) send({ type: "voice_end" });

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);

    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }

    setStatus("idle");
    setOtherSpeaking(false);
    setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const enabled = !muted;
    stream.getAudioTracks().forEach(t => { t.enabled = enabled; });
    setMuted(!enabled);
  }, [muted]);

  return { status, muted, otherSpeaking, wsReady, startCall, hangup, toggleMute };
}
