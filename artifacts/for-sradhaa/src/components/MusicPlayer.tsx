import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TRACKS = [
  { src: `${BASE}/audio1.mpeg` },
  { src: `${BASE}/audio2.mpeg` },
];

export function MusicPlayer({ autoStart = false }: { autoStart?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(TRACKS[0].src);
    audio.loop = false;
    audioRef.current = audio;
    let index = 0;

    const onEnded = () => {
      index = (index + 1) % TRACKS.length;
      audio.src = TRACKS[index].src;
      audio.play();
    };

    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const startPlaying = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  useEffect(() => {
    if (autoStart) startPlaying();
  }, [autoStart, startPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => {});
    else audio.pause();
  }, [playing]);

  return (
    <motion.button
      onClick={() => setPlaying((p) => !p)}
      className="fixed bottom-5 right-5 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
      style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.12 }}
      aria-label="Toggle music"
    >
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "hsl(var(--primary) / 0.35)" }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.svg key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </motion.svg>
        ) : (
          <motion.svg key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
