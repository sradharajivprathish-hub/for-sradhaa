import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameRoom } from "@/hooks/useGameSocket";

interface Guess {
  phone: string;
  guess: number;
  hint: string;
}

interface Props {
  room: GameRoom;
  myPhone: string;
  getName: (p: string) => string;
  onMove: (move: Record<string, unknown>) => void;
  onRestart: () => void;
  onLeave: () => void;
}

export function NumberGuess({ room, myPhone, getName, onMove, onRestart, onLeave }: Props) {
  const [input, setInput] = useState("");

  const state = room.state as {
    guesses: Guess[];
    turn: string;
    winner: string | null;
    status: string;
    scores: Record<string, number>;
    maxGuesses: number;
  };

  const isMyTurn = state.turn === myPhone;
  const winner = state.winner;
  const isDraw = winner === "draw";
  const iWon = winner === myPhone;

  function handleGuess() {
    const n = parseInt(input);
    if (isNaN(n) || n < 1 || n > 100) return;
    onMove({ guess: n });
    setInput("");
  }

  function hintIcon(hint: string) {
    if (hint === "higher") return "⬆️";
    if (hint === "lower") return "⬇️";
    if (hint === "correct") return "✅";
    return "";
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      <p className="text-xs text-primary/60 tracking-widest uppercase">Guess the Secret Number (1–100)</p>

      {/* Scores */}
      <div className="flex justify-between w-full gap-4">
        {room.players.map((p) => (
          <div key={p} className="flex-1 rounded-2xl p-3 text-center" style={{ background: state.turn === p && !winner ? "hsl(var(--primary)/0.1)" : "hsl(var(--card))", border: "1px solid hsl(var(--primary)/0.15)" }}>
            <p className="text-xs text-muted-foreground">{getName(p)}{p === myPhone ? " (you)" : ""}</p>
            <p className="font-serif text-xl text-primary">{state.scores?.[p] ?? 0}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {winner ? (
          <motion.p key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-serif text-xl text-center">
            {isDraw ? "No one got it! 😅" : iWon ? "You guessed it! 🎉" : `${getName(winner)} got it first! 💪`}
          </motion.p>
        ) : (
          <motion.p key="turn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
            {isMyTurn ? <span className="text-primary font-medium">Your turn — make a guess!</span> : `${getName(state.turn)}'s turn…`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Input */}
      {!winner && isMyTurn && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 w-full">
          <input
            type="number"
            min={1}
            max={100}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGuess()}
            placeholder="1 – 100"
            className="flex-1 px-4 py-3 rounded-2xl text-center text-lg border outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: "hsl(var(--card))", border: "1.5px solid hsl(var(--primary)/0.2)" }}
          />
          <button
            onClick={handleGuess}
            className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm"
          >
            Guess
          </button>
        </motion.div>
      )}

      {/* Guesses history */}
      <div className="w-full space-y-2 max-h-48 overflow-y-auto">
        {[...(state.guesses ?? [])].reverse().map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: g.phone === myPhone ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary)/0.1)" }}
          >
            <span className="text-lg">{hintIcon(g.hint)}</span>
            <span className="text-sm text-muted-foreground flex-1">{getName(g.phone)}</span>
            <span className="font-serif text-lg text-foreground">{g.guess}</span>
            <span className="text-xs text-muted-foreground capitalize">{g.hint}</span>
          </motion.div>
        ))}
      </div>

      {winner && (
        <div className="flex gap-3 w-full">
          <button onClick={onRestart} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium">Play Again</button>
          <button onClick={onLeave} className="flex-1 py-3 rounded-2xl border border-primary/20 text-sm text-muted-foreground">Leave</button>
        </div>
      )}
      {!winner && <button onClick={onLeave} className="text-xs text-muted-foreground/50 hover:text-muted-foreground">← Leave game</button>}
    </div>
  );
}
