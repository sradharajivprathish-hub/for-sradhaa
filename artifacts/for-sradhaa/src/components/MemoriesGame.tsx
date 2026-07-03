import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import photo1 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.58_PM_1783069935328.jpeg";
import photo2 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_(1)_1783069935328.jpeg";
import photo3 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_(2)_1783069935329.jpeg";
import photo4 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_1783069935330.jpeg";
import photo5 from "@assets/WhatsApp_Image_2026-07-02_at_8.46.00_PM_(1)_1783069935331.jpeg";
import photo6 from "@assets/WhatsApp_Image_2026-07-02_at_8.46.00_PM_1783069935333.jpeg";

interface Memory {
  id: number;
  label: string;
  photo: string;
  question: string;
  optionA: string;
  optionB: string;
  correct: "A" | "B";
  revealMsg: string;
  gradient: string;
}

const memories: Memory[] = [
  {
    id: 1, label: "Memory #1", photo: photo1,
    question: "What is my favorite color?",
    optionA: "💙 Blue",
    optionB: "🌸 Pink",
    correct: "B",
    revealMsg: "Pink — just like the blush on your cheeks when I look at you 🌸",
    gradient: "from-rose-900/80 to-pink-950/80",
  },
  {
    id: 2, label: "Memory #2", photo: photo2,
    question: "On which date did Prathish propose?",
    optionA: "📅 September 15",
    optionB: "📅 October 20",
    correct: "A",
    revealMsg: "September 15 — the day my whole life changed forever 💍",
    gradient: "from-purple-950/80 to-rose-950/80",
  },
  {
    id: 3, label: "Memory #3", photo: photo3,
    question: "On which date did we break up?",
    optionA: "💔 November 3",
    optionB: "💔 December 9",
    correct: "B",
    revealMsg: "December 9 — we survived it and came back stronger than ever 💫",
    gradient: "from-indigo-950/80 to-rose-950/80",
  },
  {
    id: 4, label: "Memory #4", photo: photo4,
    question: "Who is the best couple forever?",
    optionA: "❓ No one",
    optionB: "❤️ Us",
    correct: "B",
    revealMsg: "Us ❤️ — always and forever, no contest 🏆",
    gradient: "from-emerald-950/80 to-rose-950/80",
  },
  {
    id: 5, label: "Memory #5", photo: photo5,
    question: "Who are our closest friends?",
    optionA: "🤝 Udaya & Nishant",
    optionB: "🤝 Rahul & Priya",
    correct: "A",
    revealMsg: "Udaya & Nishant — our ride-or-dies, our biggest cheerleaders 🥂",
    gradient: "from-amber-950/80 to-rose-950/80",
  },
  {
    id: 6, label: "Memory #6", photo: photo6,
    question: "Who does Prathish love the most in the whole world? 🌍",
    optionA: "🍛 Biryani",
    optionB: "❤️ Sradha",
    correct: "B",
    revealMsg: "SRADHA ❤️ — obviously. Always. Without question. You are my whole world 🌍",
    gradient: "from-rose-950/80 to-red-950/80",
  },
];

export function MemoriesGame() {
  const [unlocked, setUnlocked] = useState<Record<number, boolean>>({});
  const [active, setActive] = useState<number | null>(null);
  const [wrong, setWrong] = useState<"A" | "B" | null>(null);
  const [shake, setShake] = useState(false);

  const memory = memories.find((m) => m.id === active);

  function pick(choice: "A" | "B") {
    if (!memory) return;
    if (choice === memory.correct) {
      setUnlocked((u) => ({ ...u, [memory.id]: true }));
      setActive(null);
      setWrong(null);
    } else {
      setWrong(choice);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary/60 tracking-widest uppercase text-xs mb-3">Locked in time</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Six Memories</h2>
          <p className="text-muted-foreground">Answer each question to unlock the memory hidden inside 🔐</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {memories.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer relative"
              onClick={() => !unlocked[m.id] && setActive(m.id)}
              whileHover={{ scale: unlocked[m.id] ? 1.02 : 1.04 }}
            >
              {unlocked[m.id] ? (
                <motion.div
                  className="w-full h-full relative"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <img src={m.photo} alt={m.label} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${m.gradient} flex items-end p-4`}>
                    <p className="text-white text-xs leading-snug font-medium">{m.revealMsg}</p>
                  </div>
                  <div className="absolute top-3 right-3 text-xl">✨</div>
                </motion.div>
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${m.gradient} flex flex-col items-center justify-center gap-3 p-4 border border-white/10`}>
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </motion.div>
                  <p className="text-white/60 text-xs tracking-widest uppercase">{m.label}</p>
                  <p className="text-white/80 text-xs text-center font-medium">Tap to unlock</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quiz Modal */}
        <AnimatePresence>
          {active !== null && memory && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setActive(null); setWrong(null); }}
            >
              <motion.div
                className="bg-card border border-primary/20 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl"
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0, x: shake ? [0, -8, 8, -8, 8, 0] : 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-primary/60 text-xs tracking-widest uppercase mb-2">{memory.label}</p>
                <h3 className="font-serif text-xl md:text-2xl mb-6 text-foreground">{memory.question}</h3>

                <div className="flex flex-col gap-3">
                  {(["A", "B"] as const).map((opt) => {
                    const label = opt === "A" ? memory.optionA : memory.optionB;
                    const isWrong = wrong === opt;
                    return (
                      <motion.button
                        key={opt}
                        onClick={() => pick(opt)}
                        className={`w-full text-left px-5 py-4 rounded-2xl border text-base font-medium transition-all ${
                          isWrong
                            ? "border-rose-500 bg-rose-500/10 text-rose-400"
                            : "border-primary/20 bg-background hover:bg-primary/10 hover:border-primary/60 text-foreground"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="text-primary/50 mr-3 font-mono text-sm">{opt}.</span>
                        {label}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {wrong && (
                    <motion.p
                      className="text-rose-400 text-sm mt-4 text-center"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ❌ Incorrect Answer — Try again, my love ❤️
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => { setActive(null); setWrong(null); }}
                  className="mt-5 w-full text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
