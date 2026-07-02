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

function LoveCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
      data-testid={`card-love-${front}`}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front */}
        <div
          className="w-full aspect-square rounded-3xl flex flex-col items-center justify-center bg-card border border-primary/10 shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="font-serif text-5xl text-primary/20 mb-2">{front}</span>
          <span className="text-xs text-primary/50 tracking-widest uppercase">tap to open</span>
          <div className="mt-4 w-8 h-[1px] bg-primary/20 mx-auto" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full aspect-square rounded-3xl flex items-center justify-center bg-primary p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-primary-foreground text-center font-serif text-base leading-relaxed">
            {back}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function LoveCards() {
  const [allRevealed, setAllRevealed] = useState(false);

  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-center text-primary/60 tracking-widest uppercase text-xs mb-3"
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
          className="text-center text-primary/60 text-sm mb-12 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Tap a card to reveal
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.front}
              initial={{ opacity: 0, y: 30, rotate: (i % 2 === 0 ? -1 : 1) * (i % 3) }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <LoveCard front={r.front} back={r.back} />
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-muted-foreground text-sm mt-12 italic font-serif"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          These are just the words. The feeling is infinite.
        </motion.p>
      </div>
    </section>
  );
}
