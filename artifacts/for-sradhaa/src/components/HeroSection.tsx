import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "Sradha".split("");
const SUBTITLE = "A love that began in silence, growing louder every day.";

function useTypewriter(text: string, speed = 45, startDelay = 2800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let i = 0;
    t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  dur: 2 + Math.random() * 4, delay: Math.random() * 5,
}));

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: 2 + Math.random() * 4, dur: 3 + Math.random() * 3, delay: Math.random() * 4,
}));

export function HeroSection() {
  const { displayed, done } = useTypewriter(SUBTITLE, 38, 2200);
  const [showDate, setShowDate] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowHeart(true), 1800);
    const t2 = setTimeout(() => setShowDate(true), 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">

      {/* Animated gradient bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 45%, hsl(345 70% 88% / 0.4), transparent 70%)" }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Aurora effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 100% 30% at 50% 80%, rgba(244,63,94,0.08), transparent 70%)" }}
        animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 20% at 30% 20%, rgba(167,139,250,0.06), transparent 70%)" }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {STARS.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/25"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -22, 0], opacity: [0, 0.7, 0], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Large heartbeat ring behind content */}
      <motion.div
        className="absolute rounded-full border border-primary/8 pointer-events-none"
        style={{ width: 500, height: 500, left: "calc(50% - 250px)", top: "calc(50% - 250px)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full border border-primary/5 pointer-events-none"
        style={{ width: 700, height: 700, left: "calc(50% - 350px)", top: "calc(50% - 350px)" }}
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        <motion.span
          className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-10 block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          data-testid="text-hero-subtitle"
        >
          For My First Love
        </motion.span>

        {/* SRADHA letter by letter */}
        <div className="flex items-end justify-center mb-8" aria-label="Sradha">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="font-serif leading-none text-foreground inline-block"
              style={{ fontSize: "clamp(3.5rem,14vw,8.5rem)" }}
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`text-hero-letter-${i}`}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Typewriter subtitle */}
        <div className="h-8 mb-10">
          <p className="text-lg md:text-xl text-muted-foreground italic font-serif">
            {displayed}
            {!done && (
              <motion.span
                className="inline-block w-0.5 h-5 bg-primary/50 ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </p>
        </div>

        {/* Heartbeat SVG */}
        <AnimatePresence>
          {showHeart && (
            <motion.svg
              key="heartbeat"
              viewBox="0 0 200 40"
              className="w-48 md:w-64 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.polyline
                points="0,20 30,20 45,5 55,35 65,10 75,28 85,20 200,20"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Date reveal */}
        <AnimatePresence>
          {showDate && (
            <motion.span
              className="text-primary font-medium tracking-[0.25em] text-sm mt-6 block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              data-testid="text-hero-date"
            >
              July 3 &mdash; One Beautiful Year
            </motion.span>
          )}
        </AnimatePresence>

        {/* Scroll hint */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5, duration: 1 }}
        >
          <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">scroll</span>
          <motion.div
            className="w-[1px] h-8 bg-primary/20 mx-auto"
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
