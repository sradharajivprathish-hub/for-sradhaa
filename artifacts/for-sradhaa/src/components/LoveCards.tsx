import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reasons = [
  { front: "01", back: "You are my first love — the one my heart chose before my mind even knew." },
  { front: "02", back: "You care for me like no one else ever has. You make me feel safe everywhere." },
  { front: "03", back: "Our joined eyebrows — a beautifully unique thing only we share." },
  { front: "04", back: "You are my safest place in a loud, chaotic world." },
  { front: "05", back: "Every 'good morning' text from you is my favorite part of waking up." },
  { front: "06", back: "Even across distance, you never let me feel alone." },
  { front: "07", back: "After every fight, you remind me that love is choosing each other again." },
  { front: "08", back: "You make ordinary days feel like they're worth remembering." },
  { front: "09", back: "Your smile. I'd do anything to keep seeing it." },
  { front: "10", back: "You are my peace, my blessing, and my favorite person. Forever." },
];

const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

const ORBITING = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  angle: (i / 6) * 360,
  radius: 180 + i * 30,
  size: 3 + i % 3,
  dur: 8 + i * 2,
}));

function LoveCard({ front, back, index }: { front: string; back: string; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
      data-testid={`card-love-${front}`}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front */}
        <div
          className="w-full aspect-square rounded-3xl flex flex-col items-center justify-center border border-primary/15 shadow-md overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(244,63,94,0.04))",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 24px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          <motion.span
            className="font-serif text-5xl text-primary/20 mb-2"
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 3 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
          >
            {front}
          </motion.span>
          <span className="text-xs text-primary/40 tracking-widest uppercase">tap to open</span>
          <motion.div
            className="mt-4 w-8 h-[1px] bg-primary/20 mx-auto"
            animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Sparkle */}
          <motion.div
            className="absolute top-3 right-3 text-xs"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2 + index * 0.4, repeat: Infinity, delay: index * 0.2 }}
          >
            ✨
          </motion.div>
        </div>

        {/* Back */}
        <motion.div
          className="absolute inset-0 w-full aspect-square rounded-3xl flex items-center justify-center p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, hsl(345 80% 55%), hsl(345 70% 45%))",
            boxShadow: "0 8px 40px rgba(244,63,94,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
          animate={flipped ? { boxShadow: ["0 8px 40px rgba(244,63,94,0.3)", "0 12px 60px rgba(244,63,94,0.5)", "0 8px 40px rgba(244,63,94,0.3)"] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-primary-foreground text-center font-serif text-base leading-relaxed">
            {back}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function LoveCards() {
  return (
    <section className="relative py-28 px-6 z-10 overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.size, height: s.size,
              background: `rgba(244,63,94,${0.1 + Math.random() * 0.2})`,
            }}
            animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.7, 1.3, 0.7] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Radial glow center */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(244,63,94,0.07), transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbiting dots */}
      <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
        {ORBITING.map(o => (
          <motion.div
            key={o.id}
            className="absolute rounded-full bg-primary/10"
            style={{ width: o.size, height: o.size }}
            animate={{ rotate: 360 }}
            transition={{ duration: o.dur, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="absolute rounded-full bg-primary/20"
              style={{
                width: o.size, height: o.size,
                left: o.radius, top: -o.size / 2,
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.p
          className="text-center text-primary/60 tracking-widest uppercase text-xs mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Things only I know
        </motion.p>

        <motion.h2
          className="font-serif text-4xl md:text-5xl text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          The Universe I Found In You
        </motion.h2>

        {/* Decorative line with heart */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
          <motion.span
            className="text-primary text-sm"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ❤️
          </motion.span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
        </motion.div>

        <motion.p
          className="text-center text-muted-foreground mb-4 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Little pieces of you that live in my heart. Tap each one open.
        </motion.p>

        <motion.p
          className="text-center text-primary/50 text-xs mb-14 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Tap a card to reveal
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={r.front}
              initial={{ opacity: 0, y: 30, rotate: (i % 2 === 0 ? -1 : 1) * (i % 3) }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
            >
              <LoveCard front={r.front} back={r.back} index={i} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-muted-foreground text-sm mt-14 italic font-serif"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          These are just the words. The feeling is infinite. ✨
        </motion.p>
      </div>
    </section>
  );
}
