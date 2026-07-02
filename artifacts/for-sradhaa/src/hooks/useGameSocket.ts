import { useState, useEffect, useRef, useCallback } from "react";

export type GameType = "tictactoe" | "connectfour" | "rps" | "memory" | "numberguess";

export interface GameRoom {
  id: string;
  gameType: GameType;
  players: string[];
  state: Record<string, unknown>;
}

interface GameMessage {
  type: string;
  [key: string]: unknown;
}

const NAMES: Record<string, string> = {
  "919944293646": "Prathish",
  "919940739865": "Sradhaa",
  "91994039865": "Sradhaa",
};

export function useGameSocket(phone: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [otherOnline, setOtherOnline] = useState(false);
  const listenersRef = useRef<((msg: GameMessage) => void)[]>([]);

  useEffect(() => {
    if (!phone) return;

    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${proto}//${window.location.host}/api/ws?phone=${phone}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => { setConnected(false); setOtherOnline(false); };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as GameMessage;
        // Presence
        if (msg.type === "presence") {
          const p = msg.phone as string;
          if (p !== phone) setOtherOnline(msg.online as boolean);
        }
        // Game messages
        if (msg.type === "game_room") {
          if ((msg.action as string) === "error") {
            setError(msg.error as string);
          } else {
            setRoom({ id: msg.roomId as string, gameType: msg.gameType as GameType, players: msg.players as string[], state: msg.state as Record<string, unknown> });
            setError(null);
          }
        }
        if (msg.type === "game_state") {
          setRoom(prev => prev ? { ...prev, state: msg.state as Record<string, unknown>, players: (msg.players as string[]) ?? prev.players } : null);
        }
        // Notify all listeners
        for (const fn of listenersRef.current) fn(msg);
      } catch {}
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [phone]);

  const send = useCallback((data: object) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }, []);

  const createRoom = useCallback((gameType: GameType) => {
    setError(null);
    send({ type: "game_create", gameType });
  }, [send]);

  const joinRoom = useCallback((roomId: string) => {
    setError(null);
    send({ type: "game_join", roomId: roomId.trim().toUpperCase() });
  }, [send]);

  const makeMove = useCallback((move: Record<string, unknown>) => {
    if (!room) return;
    send({ type: "game_move", roomId: room.id, move });
  }, [send, room]);

  const restart = useCallback(() => {
    if (!room) return;
    send({ type: "game_restart", roomId: room.id });
  }, [send, room]);

  const leaveRoom = useCallback(() => {
    if (room) send({ type: "game_leave", roomId: room.id });
    setRoom(null);
    setError(null);
  }, [send, room]);

  const getName = useCallback((p: string) => NAMES[p] ?? "Player", []);

  return { connected, room, error, otherOnline, createRoom, joinRoom, makeMove, restart, leaveRoom, getName };
}
