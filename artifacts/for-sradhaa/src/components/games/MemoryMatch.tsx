import { motion, AnimatePresence } from "framer-motion";
import type { GameRoom } from "@/hooks/useGameSocket";

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matchedBy: string | null;
}

interface Props {
  room: GameRoom;
  myPhone: string;
  getName: (p: string) => string;
  onMove: (move: Record<string, unknown>) => void;
  onRestart: () => void;
  onLeave: () => void;
}

export function MemoryMatch({ room, myPhone, getName, onMove, onRestart, onLeave }: Props) {
  const state = room.state as {
    cards: Card[];
    turn: string;
    currentFlipped: number[];
    scores: Record<string, number>;
    status: string;
    winner: string | null;
    lastMatch: boolean;
  };

  const isMyTurn = state.turn === myPhone;
  const winner = state.winner;
  const isDraw = winner === "draw";
  const iWon = winner === myPhone;

  function handleCardClick(card: Card) {
    if (!isMyTurn || card.flipped || card.matchedBy || winner) return;
    if ((state.currentFlipped ?? []).length >= 2) return;
    onMove({ cardId: card.id });
  }

  const cols = 6;

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
      {/* Scores */}
      <div className="flex justify-between w-full gap-4">
        {room.players.map((p) => (
          <div key={p} className="flex-1 rounded-2xl p-3 text-center" style={{ background: state.turn === p && !winner ? "hsl(var(--primary)/0.1)" : "hsl(var(--card))", border: "1px solid hsl(var(--primary)/0.15)" }}>
            <p className="text-xs text-muted-foreground">{getName(p)}{p === myPhone ? " (you)" : ""}</p>
            <p className="font-serif text-xl text-primary">{state.scores?.[p] ?? 0} pairs</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {winner ? (
          <motion.p key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-serif text-xl text-center">
            {isDraw ? "It's a tie! 🤝" : iWon ? "You win! 🎉 Great memory!" : `${getName(winner)} wins! 💪`}
          </motion.p>
        ) : (
          <motion.p key="turn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
            {isMyTurn ? <span className="text-primary font-medium">Your turn — flip two cards!</span> : `${getName(state.turn)}'s turn…`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Cards grid */}
      <div className="grid gap-2 w-full" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {(state.cards ?? []).map((card) => {
          const isFlipped = card.flipped || !!card.matchedBy;
          const isMatched = !!card.matchedBy;
          return (
            <div
              key={card.id}
              className="aspect-square cursor-pointer select-none"
              style={{ perspective: "400px" }}
              onClick={() => handleCardClick(card)}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front (hidden) */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    background: isMyTurn && !winner && !card.matchedBy && !card.flipped
                      ? "linear-gradient(135deg, hsl(345 80% 90%), hsl(280 60% 90%))"
                      : "hsl(var(--muted))",
                    border: "1px solid hsl(var(--primary)/0.15)",
                  }}
                >
                  <span className="text-primary/30 text-xs">?</span>
                </div>
                {/* Back (emoji) */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center text-xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    background: isMatched ? "hsl(120 60% 94%)" : "hsl(345 80% 97%)",
                    border: `1px solid ${isMatched ? "hsl(120 50% 70%/0.4)" : "hsl(345 70% 80%/0.3)"}`,
                  }}
                >
                  {card.emoji}
                </div>
              </motion.div>
            </div>
          );
        })}
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
