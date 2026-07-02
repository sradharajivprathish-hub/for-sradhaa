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

const COLORS = ["hsl(345 80% 60%)", "hsl(200 80% 55%)"];

export function ConnectFour({ room, myPhone, getName, onMove, onRestart, onLeave }: Props) {
  const state = room.state as {
    board: (string | null)[][];
    turn: string;
    winner: string | null;
    status: string;
    scores: Record<string, number>;
  };

  const isMyTurn = state.turn === myPhone;
  const winner = state.winner;
  const myColor = COLORS[room.players.indexOf(myPhone)];
  const isDraw = winner === "draw";
  const iWon = winner === myPhone;

  function getColor(phone: string | null) {
    if (!phone) return "hsl(var(--muted))";
    return COLORS[room.players.indexOf(phone)] ?? "hsl(var(--muted))";
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto">
      {/* Scores */}
      <div className="flex justify-between w-full gap-4">
        {room.players.map((p, i) => (
          <div key={p} className="flex-1 rounded-2xl p-3 text-center" style={{ background: state.turn === p && !winner ? `${COLORS[i]}20` : "hsl(var(--card))", border: `1.5px solid ${COLORS[i]}40` }}>
            <div className="w-5 h-5 rounded-full mx-auto mb-1" style={{ background: COLORS[i] }} />
            <p className="text-xs text-muted-foreground">{getName(p)}{p === myPhone ? " (you)" : ""}</p>
            <p className="font-serif text-xl text-primary">{state.scores?.[p] ?? 0}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {winner ? (
          <motion.p key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-serif text-xl text-center">
            {isDraw ? "It's a draw! 🤝" : iWon ? "You win! 🎉" : `${getName(winner)} wins! 💪`}
          </motion.p>
        ) : (
          <motion.p key="turn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
            {isMyTurn ? <span className="font-medium" style={{ color: myColor }}>Your turn — click a column</span> : `${getName(state.turn)}'s turn…`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="rounded-3xl p-3 w-full" style={{ background: "hsl(220 60% 18%)" }}>
        <div className="grid grid-cols-7 gap-1.5">
          {/* Column headers */}
          {Array.from({ length: 7 }, (_, col) => (
            <motion.button
              key={`h${col}`}
              onClick={() => !winner && isMyTurn && onMove({ col })}
              className="h-5 rounded-full flex items-center justify-center"
              style={{ background: isMyTurn && !winner ? `${myColor}40` : "transparent", cursor: isMyTurn && !winner ? "pointer" : "default" }}
              whileHover={isMyTurn && !winner ? { background: `${myColor}70` } : {}}
            >
              {isMyTurn && !winner && <span className="text-[8px]" style={{ color: myColor }}>▼</span>}
            </motion.button>
          ))}
          {/* Cells */}
          {state.board?.map((row, r) =>
            row.map((cell, c) => (
              <motion.div
                key={`${r}-${c}`}
                className="aspect-square rounded-full"
                style={{ background: cell ? getColor(cell) : "hsl(220 50% 25%)", boxShadow: cell ? `0 2px 8px ${getColor(cell)}60` : "none" }}
                initial={false}
                animate={{ scale: cell ? [1.2, 1] : 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              />
            ))
          )}
        </div>
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
