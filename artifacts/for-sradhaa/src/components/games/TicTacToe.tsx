import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(b: (string|null)[]) {
  for (const [a,c,d] of WINS) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return b.every(Boolean) ? "draw" : null;
}

export function TicTacToe() {
  const [board, setBoard] = useState<(string|null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X"|"O">("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const winner = checkWinner(board);

  function click(i: number) {
    if (board[i] || winner) return;
    const nb = [...board];
    nb[i] = turn;
    const w = checkWinner(nb);
    if (w && w !== "draw") setScores(s => ({ ...s, [w]: s[w as "X"|"O"] + 1 }));
    setBoard(nb);
    setTurn(t => t === "X" ? "O" : "X");
  }

  function reset() { setBoard(Array(9).fill(null)); setTurn("X"); }

  const cellClass = (v: string|null) =>
    v === "X" ? "text-rose-400" : v === "O" ? "text-yellow-300" : "text-transparent hover:text-white/10";

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      {/* Score */}
      <div className="flex gap-8 text-center">
        {[["Prathish (X)", "X"], ["Sradha (O)", "O"]].map(([name, sym]) => (
          <div key={sym}>
            <p className="text-xs text-muted-foreground mb-1">{name}</p>
            <p className="font-serif text-3xl text-primary">{scores[sym as "X"|"O"]}</p>
          </div>
        ))}
      </div>

      {/* Status */}
      <AnimatePresence mode="wait">
        <motion.p
          key={winner ?? turn}
          className="text-sm tracking-wide"
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        >
          {winner === "draw" ? "🤝 It's a draw!" : winner ? `🎉 ${winner === "X" ? "Prathish" : "Sradha"} wins!` : `${turn === "X" ? "Prathish (X)" : "Sradha (O)"}'s turn`}
        </motion.p>
      </AnimatePresence>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((v, i) => (
          <motion.button
            key={i}
            onClick={() => click(i)}
            className={`w-20 h-20 rounded-xl border border-white/10 text-4xl font-serif flex items-center justify-center transition-all ${cellClass(v)}`}
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
            whileHover={!v && !winner ? { scale: 1.06, background: "rgba(255,255,255,0.08)" } : {}}
            whileTap={!v && !winner ? { scale: 0.95 } : {}}
          >
            {v && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                {v}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={reset}
        className="px-6 py-2.5 rounded-full border border-primary/30 text-sm text-primary hover:bg-primary/10 transition-colors"
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      >
        New Game
      </motion.button>
    </div>
  );
}
