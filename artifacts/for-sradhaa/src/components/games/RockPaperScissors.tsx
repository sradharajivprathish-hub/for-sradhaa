import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHOICES = ["✊", "✋", "✌️"] as const;
const LABELS = ["Rock", "Paper", "Scissors"];
type Choice = typeof CHOICES[number];

function getResult(p: Choice, c: Choice): "win" | "lose" | "draw" {
  if (p === c) return "draw";
  if ((p === "✊" && c === "✌️") || (p === "✋" && c === "✊") || (p === "✌️" && c === "✋")) return "win";
  return "lose";
}

export function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scores, setScores] = useState({ you: 0, cpu: 0, draw: 0 });
  const [animating, setAnimating] = useState(false);

  function pick(choice: Choice) {
    if (animating) return;
    setAnimating(true);
    setPlayerChoice(choice);
    setCpuChoice(null);
    setResult(null);

    setTimeout(() => {
      const cpu = CHOICES[Math.floor(Math.random() * 3)];
      setCpuChoice(cpu);
      const r = getResult(choice, cpu);
      setResult(r === "win" ? "🎉 You Win!" : r === "lose" ? "💔 CPU Wins!" : "🤝 Draw!");
      setScores(s => ({ ...s, [r === "win" ? "you" : r === "lose" ? "cpu" : "draw"]: s[r === "win" ? "you" : r === "lose" ? "cpu" : "draw"] + 1 }));
      setAnimating(false);
    }, 700);
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Scores */}
      <div className="flex gap-6 text-center">
        {[["You", scores.you, "text-rose-400"], ["Draw", scores.draw, "text-white/50"], ["CPU", scores.cpu, "text-yellow-300"]].map(([label, val, cls]) => (
          <div key={String(label)}>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`font-serif text-3xl ${cls}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Arena */}
      <div className="flex items-center justify-center gap-8">
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={animating ? { rotate: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border border-rose-500/30"
            style={{ background: "rgba(244,63,94,0.08)", backdropFilter: "blur(8px)" }}>
            {playerChoice ?? "❓"}
          </div>
          <p className="text-xs text-muted-foreground">You</p>
        </motion.div>

        <p className="text-2xl font-serif text-primary/40">VS</p>

        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border border-yellow-500/30"
            style={{ background: "rgba(234,179,8,0.08)", backdropFilter: "blur(8px)" }}
            animate={animating ? { rotate: [5, -5, 5, -5, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {cpuChoice ?? (animating ? "🤔" : "❓")}
          </motion.div>
          <p className="text-xs text-muted-foreground">CPU</p>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.p
            key={result}
            className="text-lg font-serif"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {result}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Choices */}
      <div className="flex gap-3">
        {CHOICES.map((c, i) => (
          <motion.button
            key={c}
            onClick={() => pick(c)}
            disabled={animating}
            className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border border-white/10 disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
          >
            <span className="text-3xl">{c}</span>
            <span className="text-xs text-muted-foreground">{LABELS[i]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
