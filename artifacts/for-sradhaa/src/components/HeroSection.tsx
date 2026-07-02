import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "Sradhaa".split("");
const SUBTITLE = "A love that began in silence, growing louder every day.";

function useTypewriter(text: string, speed = 45, startDelay = 2800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let i = 0;
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function Particle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/30 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{
        y: [0, -18, 0],
        opacity: [0, 0.7, 0],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 4,
  duration: 3 + Math.random() * 3,
  id: i,
}));

function HeartbeatLine({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
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
  );
}

export function HeroSection() {
  const { displayed, done: subtitleDone } = useTypewriter(SUBTITLE, 38, 2200);
  const [showDate, setShowDate] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowHeart(true), 1800);
    const t2 = setTimeout(() => setShowDate(true), 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">

      {/* Radial glow background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 50% 45%, hsl(345 70% 88% / 0.45), transparent 70%)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary soft glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 40% 35% at 50% 50%, hsl(350 60% 80% / 0.2), transparent 70%)",
        }}
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center">

        {/* Eyebrow label */}
        <motion.span
          className="text-primary font-medium tracking-[0.3em] uppercase text-xs mb-10 block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          data-testid="text-hero-subtitle"
        >
          For My First Love
        </motion.span>

        {/* Name — letter by letter */}
        <div className="flex items-end justify-center mb-8" aria-label="Sradhaa">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="font-serif text-[clamp(4rem,16vw,9rem)] leading-none text-foreground inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.9,
                delay: 0.6 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              data-testid={`text-hero-letter-${i}`}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>

        {/* Typewriter subtitle */}
        <div className="h-8 mb-10">
          <p className="text-lg md:text-xl text-muted-foreground italic font-serif">
            {displayed}
            {!subtitleDone && (
              <motion.span
                className="inline-block w-0.5 h-5 bg-primary/50 ml-0.5 align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </p>
        </div>

        {/* Heartbeat line */}
        <HeartbeatLine visible={showHeart} />

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
