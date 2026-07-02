import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "Sradhaa".split("");
const SUBTITLE = "Every heartbeat of mine has been writing your name since the day we met.";

function useTypewriter(text: string, speed = 40, startDelay = 2400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let i = 0;
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function FloatingHeart({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: size }}
      animate={{ y: [0, -30, 0], opacity: [0, 0.5, 0], scale: [0.8, 1.1, 0.8] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      ❤️
    </motion.div>
  );
}

const HEARTS = Array.from({ length: 16 }, (_, i) => ({
  x: 5 + Math.random() * 90, y: 10 + Math.random() * 80,
  size: 10 + Math.random() * 14, delay: Math.random() * 5, duration: 4 + Math.random() * 4, id: i,
}));

function StarParticle({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/40 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -20, 0], opacity: [0, 0.8, 0], scale: [0.5, 1.3, 0.5] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const STARS = Array.from({ length: 32 }, (_, i) => ({
  x: Math.random() * 100, y: Math.random() * 100,
  size: 1.5 + Math.random() * 3, delay: Math.random() * 5, duration: 3 + Math.random() * 3, id: i,
}));

export function HeroSection() {
  const { displayed, done: subtitleDone } = useTypewriter(SUBTITLE, 36, 2200);
  const [showBadge, setShowBadge] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowPulse(true), 1800);
    const t2 = setTimeout(() => setShowBadge(true), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, hsl(345 80% 88% / 0.55), transparent 68%)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 50% 40% at 30% 70%, hsl(280 60% 85% / 0.2), transparent 60%)" }}
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 40% 35% at 70% 30%, hsl(20 80% 88% / 0.2), transparent 60%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {STARS.map((s) => <StarParticle key={s.id} {...s} />)}
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {HEARTS.map((h) => <FloatingHeart key={h.id} {...h} />)}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        <motion.span
          className="text-primary font-medium tracking-[0.35em] uppercase text-xs mb-10 block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          For My First Love
        </motion.span>

        <div className="flex items-end justify-center mb-8" aria-label="Sradhaa">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="font-serif text-[clamp(4rem,16vw,9rem)] leading-none text-foreground inline-block"
              initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.5 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`text-hero-letter-${i}`}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>

        <div className="h-12 mb-8 max-w-lg">
          <p className="text-base md:text-lg text-muted-foreground italic font-serif leading-relaxed">
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

        {/* Heartbeat pulse */}
        <AnimatePresence>
          {showPulse && (
            <motion.svg
              key="heartbeat"
              viewBox="0 0 220 44"
              className="w-52 md:w-72 mx-auto mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.polyline
                points="0,22 32,22 48,4 58,38 70,8 82,30 92,22 220,22"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Anniversary glass badge */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-2"
            >
              <motion.div
                className="relative rounded-2xl px-8 py-4 text-center"
                style={{
                  background: "linear-gradient(135deg, hsl(345 80% 95% / 0.7), hsl(20 80% 96% / 0.5))",
                  backdropFilter: "blur(16px)",
                  border: "1px solid hsl(345 70% 80% / 0.4)",
                  boxShadow: "0 0 40px hsl(345 80% 70% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.4)",
                }}
                animate={{ boxShadow: ["0 0 30px hsl(345 80% 70% / 0.2)", "0 0 55px hsl(345 80% 70% / 0.4)", "0 0 30px hsl(345 80% 70% / 0.2)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-primary text-xl mb-0.5">❤️</p>
                <p className="font-serif text-lg text-foreground tracking-wide">July 3, 2026</p>
                <p className="text-xs text-primary/70 tracking-widest uppercase mt-0.5 mb-1">365 Days of Love</p>
                <p className="font-serif text-sm text-muted-foreground italic">"Every day with you has been my favorite chapter."</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll hint */}
        <motion.div
          className="mt-14 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.5, duration: 1 }}
        >
          <span className="text-xs text-muted-foreground/40 tracking-widest uppercase">scroll</span>
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
