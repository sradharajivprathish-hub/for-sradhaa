import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onEnter: () => void;
}

const PARTICLE_COUNT = 32;

function makeParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const dist = 80 + Math.random() * 140;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 3 + (i % 4),
      color: i % 3 === 0 ? "#fda4af" : i % 3 === 1 ? "#f43f5e" : "#fff",
    };
  });
}

const PARTICLES = makeParticles();

export function LandingScreen({ onEnter }: Props) {
  const [phase, setPhase] = useState<"names" | "heart" | "burst" | "leaving">("names");

  useEffect(() => {
    const seen = localStorage.getItem("sp-v3");
    if (seen) { onEnter(); return; }

    const t1 = setTimeout(() => setPhase("heart"), 1600);
    const t2 = setTimeout(() => setPhase("burst"), 2600);
    const t3 = setTimeout(() => {
      setPhase("leaving");
      localStorage.setItem("sp-v3", "1");
      setTimeout(onEnter, 900);
    }, 4200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onEnter]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #1a0408 0%, #070002 100%)" }}
      animate={phase === "leaving" ? { opacity: 0, scale: 1.03 } : { opacity: 1 }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      {/* Aurora background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 60%, rgba(220,38,127,0.08), transparent 70%)" }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ambient floating dots */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 3), height: 2 + (i % 3),
            left: `${5 + (i * 5.3) % 92}%`,
            top: `${8 + (i * 7.1) % 84}%`,
            background: "rgba(244,63,94,0.3)",
          }}
          animate={{ y: [0, -16, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
        />
      ))}

      {/* Main horizontal layout */}
      <div className="relative flex items-center justify-center w-full px-4" style={{ gap: "clamp(12px, 4vw, 48px)" }}>

        {/* PRATHISH — slides from left */}
        <motion.div
          initial={{ x: "-55vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <motion.p
            className="font-serif text-white/90 tracking-[0.18em]"
            style={{ fontSize: "clamp(1.1rem, 4.8vw, 3.6rem)" }}
            animate={phase === "leaving" ? { x: "-40vw", opacity: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            PRATHISH
          </motion.p>
        </motion.div>

        {/* Heart — center */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: "clamp(48px, 8vw, 96px)", height: "clamp(48px, 8vw, 96px)" }}>
          <AnimatePresence>
            {(phase === "heart" || phase === "burst") && (
              <motion.div
                key="heart"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === "burst" ? [1, 1.3, 0.9, 1.15, 1] : [0.8, 1, 0.85, 1, 0.9],
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: phase === "burst" ? 0.7 : 1.2, ease: "easeOut" }}
              >
                <motion.div
                  animate={{
                    filter: phase === "burst"
                      ? ["drop-shadow(0 0 8px #f43f5e)", "drop-shadow(0 0 40px #f43f5e)", "drop-shadow(0 0 80px #ff1a4b)"]
                      : ["drop-shadow(0 0 6px #f43f5e66)", "drop-shadow(0 0 18px #f43f5e)", "drop-shadow(0 0 6px #f43f5e66)"],
                  }}
                  transition={{ duration: phase === "burst" ? 0.7 : 1.5, repeat: phase === "burst" ? 0 : Infinity, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 100 90" fill="none" style={{ width: "clamp(40px, 7vw, 80px)", height: "clamp(36px, 6.3vw, 72px)" }}>
                    <path d="M50 85 C50 85 4 54 4 27 C4 13 15 4 27 4 C35 4 43 9 50 18 C57 9 65 4 73 4 C85 4 96 13 96 27 C96 54 50 85 50 85Z" fill="url(#hg2)" />
                    <ellipse cx="34" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.22)" transform="rotate(-20 34 28)" />
                    <defs>
                      <radialGradient id="hg2" cx="40%" cy="25%" r="70%">
                        <stop offset="0%" stopColor="#ff7090" />
                        <stop offset="55%" stopColor="#e91e4b" />
                        <stop offset="100%" stopColor="#8b0020" />
                      </radialGradient>
                    </defs>
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse rings on burst */}
          <AnimatePresence>
            {phase === "burst" && [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-rose-400/50"
                style={{ inset: 0 }}
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 3 + i * 1.5, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.25, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Burst particles */}
          <AnimatePresence>
            {phase === "burst" && PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{ width: p.size, height: p.size, background: p.color, left: "50%", top: "50%" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.9 + (p.id % 4) * 0.1, delay: (p.id % 6) * 0.03, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* SRADHAAN — slides from right */}
        <motion.div
          initial={{ x: "55vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <motion.p
            className="font-serif text-white/90 tracking-[0.18em]"
            style={{ fontSize: "clamp(1.1rem, 4.8vw, 3.6rem)" }}
            animate={phase === "leaving" ? { x: "40vw", opacity: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            SRADHAAN
          </motion.p>
        </motion.div>
      </div>

      {/* Subtitle */}
      <AnimatePresence>
        {(phase === "heart" || phase === "burst") && (
          <motion.p
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/35 text-xs tracking-[0.3em] uppercase whitespace-nowrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            one beautiful year ❤️
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
