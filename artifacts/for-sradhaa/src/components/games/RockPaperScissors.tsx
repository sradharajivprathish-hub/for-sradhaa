import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GameRoom } from "@/hooks/useGameSocket";

interface Props {
  room: GameRoom;
  myPhone: string;
  getName: (p: string) => string;
  onMove: (move: Record<string, unknown>) => void;
  onRestart: () => void;
  onLeave: () => void;
}

const CHOICES = [
  { id: "rock", emoji: "🪨", label: "Rock" },
  { id: "paper", emoji: "📄", label: "Paper" },
  { id: "scissors", emoji: "✂️", label: "Scissors" },
];

export function RockPaperScissors({ room, myPhone, getName, onMove, onRestart, onLeave }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const state = room.state as {
    choices: Record<string, string | null>;
    round: number;
    totalRounds: number;
    lastResult: { winner: string; reason: string } | null;
    scores: Record<string, number>;
    status: string;
    winner: string | null;
  };

  const myChoice = state.choices?.[myPhone];
  const allChosen = Object.values(state.choices ?? {}).every(c => c !== null);
  const winner = state.winner;
  const iWon = winner === myPhone;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      {/* Round */}
      <p className="text-xs text-primary/60 tracking-widest uppercase">Round {state.round} of {state.totalRounds}</p>

      {/* Scores */}
      <div className="flex justify-between w-full gap-4">
        {room.players.map((p) => (
          <div key={p} className="flex-1 rounded-2xl p-3 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary)/0.15)" }}>
            <p className="text-xs text-muted-foreground mb-1">{getName(p)}{p === myPhone ? " (you)" : ""}</p>
            <p className="font-serif text-2xl text-primary">{state.scores?.[p] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Last result */}
      <AnimatePresence>
        {state.lastResult && (
          <motion.div
            key={state.round}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center px-4 py-2 rounded-2xl"
            style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary)/0.15)" }}
          >
            <p className="text-sm font-medium text-foreground">{state.lastResult.reason}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {state.lastResult.winner === "draw" ? "Tie!" : state.lastResult.winner === myPhone ? "You got a point! 🎉" : `${getName(state.lastResult.winner)} got a point`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choices */}
      {!winner && (
        <div>
          {myChoice ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <p className="text-5xl mb-2">{CHOICES.find(c => c.id === myChoice)?.emoji}</p>
              <p className="text-sm text-muted-foreground">{allChosen ? "Revealing…" : "Waiting for other player…"}</p>
            </motion.div>
          ) : (
            <div className="flex gap-4">
              {CHOICES.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => onMove({ choice: c.id })}
                  onHoverStart={() => setHovered(c.id)}
                  onHoverEnd={() => setHovered(null)}
                  className="flex flex-col items-center gap-2 p-4 rounded-3xl cursor-pointer"
                  style={{
                    background: hovered === c.id ? "hsl(var(--primary)/0.12)" : "hsl(var(--card))",
                    border: "1.5px solid hsl(var(--primary)/0.2)",
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <span className="text-4xl">{c.emoji}</span>
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Final result */}
      <AnimatePresence>
        {winner && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 w-full">
            {winner === "draw" ? (
              <p className="font-serif text-2xl">It's a tie! 🤝</p>
            ) : iWon ? (
              <div>
                <p className="font-serif text-3xl text-primary">You win! 🎉</p>
                <p className="text-sm text-muted-foreground mt-1">Champion!</p>
              </div>
            ) : (
              <p className="font-serif text-2xl text-muted-foreground">{getName(winner)} wins this round!</p>
            )}
            <div className="flex gap-3 w-full">
              <button onClick={onRestart} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium">Play Again</button>
              <button onClick={onLeave} className="flex-1 py-3 rounded-2xl border border-primary/20 text-sm text-muted-foreground">Leave</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!winner && <button onClick={onLeave} className="text-xs text-muted-foreground/50 hover:text-muted-foreground mt-2">← Leave game</button>}
    </div>
  );
}
