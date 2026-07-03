import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHAPTERS = [
  {
    num: "I",
    title: "Love at First Sight",
    date: "July 3, 2025",
    color: "hsl(345 80% 95% / 0.7)",
    accent: "hsl(345 70% 60%)",
    emoji: "✨",
    story: [
      "It was just an ordinary day at GRD Arts and Science College.",
      "Then you walked in — and ordinary became extraordinary.",
      "I didn't know your name. I didn't know your story. But something in my heart already knew you were different.",
      "It was, without a single doubt, love at first sight.",
      "I was too nervous to say even one word. So I kept your memory in my heart and hoped the universe would bring us closer.",
    ],
  },
  {
    num: "II",
    title: "Breaking the Silence",
    date: "The First Hello",
    color: "hsl(280 60% 95% / 0.65)",
    accent: "hsl(280 60% 55%)",
    emoji: "💌",
    story: [
      "Days passed. Then weeks. The courage I needed felt impossible to find.",
      "But love has a way of pushing you forward when fear tries to hold you back.",
      "The day I finally said hello to you — I felt the whole world exhale.",
      "One word. One moment. The beginning of forever.",
      "And just like that, my heart stopped searching. It had found its home.",
    ],
  },
  {
    num: "III",
    title: "Different Colleges, One Heart",
    date: "Long Distance",
    color: "hsl(20 80% 95% / 0.65)",
    accent: "hsl(20 70% 55%)",
    emoji: "🌙",
    story: [
      "Life separated our classrooms. Different colleges. Different cities.",
      "They said distance would fade everything.",
      "They were wrong.",
      "Every good morning text became our lifeline. Every late-night call became our home.",
      "We learned that love doesn't need proximity — it just needs intention.",
      "And we chose each other, every single day, across every kilometer between us.",
    ],
  },
  {
    num: "IV",
    title: "September 15, 2025",
    date: "The Day We Became Official",
    color: "hsl(345 80% 96% / 0.7)",
    accent: "hsl(345 80% 55%)",
    emoji: "💍",
    story: [
      "The day I asked you to be mine — and you said yes.",
      "My heart has never beaten so loud.",
      "Every moment before had been leading to this one.",
      "Two hearts. One promise. One beautiful beginning.",
      "I will remember September 15th for the rest of my life.",
    ],
  },
  {
    num: "V",
    title: "Fights & Forgiveness",
    date: "Through the Storms",
    color: "hsl(200 60% 95% / 0.65)",
    accent: "hsl(200 60% 50%)",
    emoji: "🌧️",
    story: [
      "Our journey wasn't perfect. We argued. We misunderstood each other. We cried.",
      "December 9 — the day that broke us apart. The hardest day of my life.",
      "But love always finds its way back to where it belongs.",
      "Every storm we survived made us stronger. Every goodbye reminded us how precious every hello truly is.",
      "Real love isn't about never fighting. It's about choosing each other after every fight.",
    ],
  },
  {
    num: "VI",
    title: "One Beautiful Year",
    date: "July 3, 2026",
    color: "hsl(345 80% 94% / 0.8)",
    accent: "hsl(345 80% 50%)",
    emoji: "🎉",
    story: [
      "One year. Three hundred and sixty-five days.",
      "Filled with laughter, tears, late-night calls, long silences, and a love that refused to give up.",
      "I don't remember the distance anymore. I don't remember the arguments.",
      "I only remember that through everything — through every storm, every silence, every second — it has always been you.",
      "Happy one beautiful year, my love. This website is the story of us, written with every heartbeat.",
    ],
  },
];

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  dur: 2 + Math.random() * 3,
  delay: Math.random() * 4,
}));

function FloatingHeartsOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-sm select-none"
          style={{ left: `${10 + i * 12}%`, top: `${60 + (i % 3) * 12}%` }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 3 + i * 0.4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

export function StorybookSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [flipping, setFlipping] = useState(false);

  const go = (next: number) => {
    if (flipping) return;
    setFlipping(true);
    setDirection(next > current ? 1 : -1);
    setTimeout(() => {
      setCurrent(next);
      setFlipping(false);
    }, 350);
  };

  const ch = CHAPTERS[current];

  return (
    <section className="relative py-24 px-6 z-10 overflow-hidden">
      {/* Animated star backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-white/40"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(244,63,94,0.06), transparent 70%)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.p
          className="text-center text-primary/60 tracking-widest uppercase text-xs mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Written in the Stars
        </motion.p>
        <motion.h2
          className="font-serif text-4xl md:text-5xl text-center mb-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Our Love Story
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-12 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Turn the pages of our journey — six chapters of a love that chose us ❤️
        </motion.p>

        {/* Chapter dots */}
        <div className="flex justify-center gap-2 mb-8">
          {CHAPTERS.map((c, i) => (
            <motion.button
              key={i}
              onClick={() => go(i)}
              className="transition-all duration-300"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? ch.accent : "hsl(var(--primary) / 0.2)",
                boxShadow: i === current ? `0 0 12px ${ch.accent}80` : "none",
              }}
            />
          ))}
        </div>

        {/* Book page */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 60, rotateY: direction * 8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: direction * -60, rotateY: direction * -8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${ch.color}, hsl(0 0% 100% / 0.3))`,
              backdropFilter: "blur(24px)",
              border: `1px solid ${ch.accent}30`,
              boxShadow: `0 12px 60px ${ch.accent}25, 0 0 0 1px ${ch.accent}10, inset 0 1px 0 hsl(0 0% 100% / 0.5)`,
            }}
          >
            <FloatingHeartsOverlay />

            {/* Corner decoration */}
            <div className="absolute top-4 right-6 text-2xl opacity-20 pointer-events-none select-none">{ch.emoji}</div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-lg text-white shrink-0"
                  style={{ background: ch.accent, boxShadow: `0 0 20px ${ch.accent}60` }}
                  animate={{ boxShadow: [`0 0 15px ${ch.accent}50`, `0 0 30px ${ch.accent}80`, `0 0 15px ${ch.accent}50`] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {ch.num}
                </motion.div>
                <div>
                  <p className="font-serif text-xl md:text-2xl text-foreground">{ch.title}</p>
                  <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: ch.accent }}>{ch.date}</p>
                </div>
              </div>

              <div className="space-y-4">
                {ch.story.map((line, i) => (
                  <motion.p
                    key={i}
                    className="text-foreground/80 leading-relaxed text-base md:text-lg font-serif"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <motion.button
                  onClick={() => go(Math.max(0, current - 1))}
                  disabled={current === 0}
                  className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all disabled:opacity-30"
                  style={{ color: ch.accent, border: `1px solid ${ch.accent}40` }}
                  whileHover={{ scale: 1.05, background: `${ch.accent}10` }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Previous
                </motion.button>
                <p className="text-xs text-muted-foreground font-medium">{current + 1} / {CHAPTERS.length}</p>
                <motion.button
                  onClick={() => go(Math.min(CHAPTERS.length - 1, current + 1))}
                  disabled={current === CHAPTERS.length - 1}
                  className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all disabled:opacity-30"
                  style={{ color: ch.accent, border: `1px solid ${ch.accent}40` }}
                  whileHover={{ scale: 1.05, background: `${ch.accent}10` }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
