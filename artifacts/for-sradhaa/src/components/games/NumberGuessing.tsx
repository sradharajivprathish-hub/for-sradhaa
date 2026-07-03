import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function newSecret() { return Math.floor(Math.random() * 100) + 1; }

export function NumberGuessing() {
  const [secret, setSecret] = useState(newSecret);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<{ guess: number; hint: string }[]>([]);
  const [won, setWon] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function guess() {
    const n = parseInt(input.trim(), 10);
    if (isNaN(n) || n < 1 || n > 100) return;
    const hint = n === secret ? "🎉 Correct!" : n < secret ? "📈 Too low!" : "📉 Too high!";
    setHistory(h => [{ guess: n, hint }, ...h].slice(0, 8));
    setAttempts(a => a + 1);
    if (n === secret) setWon(true);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function reset() {
    setSecret(newSecret());
    setInput("");
    setAttempts(0);
    setHistory([]);
    setWon(false);
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 w-full max-w-sm mx-auto">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Guess the number between <span className="text-primary">1 – 100</span></p>
        <p className="text-xs text-muted-foreground/60 mt-1">Attempts: {attempts}</p>
      </div>

      <AnimatePresence mode="wait">
        {won ? (
          <motion.div
            key="won"
            className="text-center"
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-serif text-xl text-primary">The number was {secret}!</p>
            <p className="text-muted-foreground text-sm mt-1">Found in {attempts} attempt{attempts !== 1 ? "s" : ""}</p>
            <motion.button
              onClick={reset}
              className="mt-4 px-6 py-2.5 rounded-full border border-primary/30 text-sm text-primary hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              Play Again
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="play" className="w-full flex flex-col items-center gap-4">
            <div className="flex gap-2 w-full">
              <input
                ref={inputRef}
                type="number"
                min={1} max={100}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && guess()}
                placeholder="Enter 1–100"
                className="flex-1 bg-background border border-primary/20 rounded-xl px-4 py-3 text-center text-lg font-serif text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60"
              />
              <motion.button
                onClick={guess}
                className="px-5 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              >
                Guess
              </motion.button>
            </div>

            {/* History */}
            <div className="w-full space-y-2 max-h-52 overflow-y-auto">
              <AnimatePresence initial={false}>
                {history.map((h, i) => (
                  <motion.div
                    key={`${h.guess}-${i}`}
                    className="flex justify-between items-center px-4 py-2.5 rounded-xl border border-white/10"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-serif text-lg text-foreground">{h.guess}</span>
                    <span className="text-sm">{h.hint}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
