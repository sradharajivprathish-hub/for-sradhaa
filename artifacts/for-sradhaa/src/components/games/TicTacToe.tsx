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

export function TicTacToe({ room, myPhone, getName, onMove, onRestart, onLeave }: Props) {
  const state = room.state as {
    board: (string | null)[];
    symbols: Record<string, string>;
    turn: string;
    winner: string | null;
    status: string;
    scores: Record<string, number>;
  };

  const mySymbol = state.symbols?.[myPhone];
  const isMyTurn = state.turn === myPhone;
  const winner = state.winner;
  const isDraw = winner === "draw";
  const iWon = winner === myPhone;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      {/* Scores */}
      <div className="flex justify-between w-full gap-4">
        {room.players.map((p) => (
          <div key={p} className="flex-1 rounded-2xl p-3 text-center" style={{ background: state.turn === p && !winner ? "hsl(var(--primary) / 0.12)" : "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 0.15)" }}>
            <p className="text-xs text-muted-foreground mb-0.5">{getName(p)}{p === myPhone ? " (you)" : ""}</p>
            <p className="text-2xl">{state.symbols?.[p] ?? "?"}</p>
            <p className="font-serif text-xl text-primary">{state.scores?.[p] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Turn / Result */}
      <AnimatePresence mode="wait">
        {winner ? (
          <motion.div
            key="result"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            {isDraw ? (
              <p className="font-serif text-2xl">It's a draw! 🤝</p>
            ) : iWon ? (
              <div>
                <p className="font-serif text-2xl text-primary">You won! 🎉</p>
                <div className="flex justify-center gap-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <motion.span key={i} animate={{ y: [0, -10, 0] }} transition={{ delay: i * 0.1, repeat: 3, duration: 0.4 }} className="text-lg">⭐</motion.span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="font-serif text-2xl text-muted-foreground">{getName(winner)} wins! 💪</p>
            )}
          </motion.div>
        ) : (
          <motion.p key="turn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
            {isMyTurn ? <span className="text-primary font-medium">Your turn ({mySymbol})</span> : `${getName(state.turn)}'s turn…`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {state.board?.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => !cell && !winner && isMyTurn && onMove({ index: i })}
            className="aspect-square rounded-2xl text-3xl flex items-center justify-center select-none"
            style={{
              background: "hsl(var(--card))",
              border: "1.5px solid hsl(var(--primary) / 0.2)",
              cursor: !cell && !winner && isMyTurn ? "pointer" : "default",
            }}
            whileHover={!cell && !winner && isMyTurn ? { scale: 1.04, background: "hsl(var(--primary) / 0.08)" } : {}}
            whileTap={!cell && !winner && isMyTurn ? { scale: 0.96 } : {}}
          >
            <AnimatePresence>
              {cell && (
                <motion.span
                  key={cell + i}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Actions */}
      {winner && (
        <div className="flex gap-3 w-full">
          <button onClick={onRestart} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium">Play Again</button>
          <button onClick={onLeave} className="flex-1 py-3 rounded-2xl border border-primary/20 text-sm text-muted-foreground">Leave</button>
        </div>
      )}
      {!winner && (
        <button onClick={onLeave} className="text-xs text-muted-foreground/50 hover:text-muted-foreground mt-2">← Leave game</button>
      )}
    </div>
  );
}
