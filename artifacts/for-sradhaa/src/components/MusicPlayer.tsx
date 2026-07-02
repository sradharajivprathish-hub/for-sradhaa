import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const videoId = "3NlU3Tjrf_o";

  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      setPlaying(true);
    } else {
      setOpen(false);
      setPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="bg-card border border-primary/20 rounded-2xl shadow-2xl overflow-hidden w-64"
          >
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs text-primary/60 tracking-widest uppercase mb-0.5">Now Playing</p>
              <p className="font-serif text-base text-foreground">Senjitaley</p>
              <p className="text-xs text-muted-foreground">Remo &bull; Anirudh Ravichander</p>
            </div>
            <div className="px-4 pb-4">
              <iframe
                key={playing ? "playing" : "stopped"}
                src={playing ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0` : ""}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full rounded-xl"
                style={{ height: "140px", border: "none" }}
                title="Senjitaley - Remo"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        data-testid="button-music-player"
        aria-label="Toggle music player"
      >
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="pause"
              initial={{ opacity: 0, rotate: -20 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 20 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </motion.svg>
          ) : (
            <motion.svg
              key="note"
              initial={{ opacity: 0, rotate: 20 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -20 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
