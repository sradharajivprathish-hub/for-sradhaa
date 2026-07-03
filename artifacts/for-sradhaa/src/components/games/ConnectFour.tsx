import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROWS = 6, COLS = 7;
type Cell = 0 | 1 | 2;

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
}

function checkWin(board: Cell[][], row: number, col: number, p: Cell): boolean {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (const sign of [1, -1]) {
      let r = row + dr * sign, c = col + dc * sign;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === p) {
        count++; r += dr * sign; c += dc * sign;
      }
    }
    if (count >= 4) return true;
  }
  return false;
}

export function ConnectFour() {
  const [board, setBoard] = useState<Cell[][]>(emptyBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<Cell | null>(null);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });

  function drop(col: number) {
    if (winner) return;
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) { if (board[r][col] === 0) { row = r; break; } }
    if (row === -1) return;
    const nb = board.map(r => [...r]) as Cell[][];
    nb[row][col] = turn;
    const won = checkWin(nb, row, col, turn);
    if (won) { setScores(s => ({ ...s, [turn]: s[turn] + 1 })); setWinner(turn); }
    setBoard(nb);
    if (!won) setTurn(t => t === 1 ? 2 : 1);
  }

  function reset() { setBoard(emptyBoard()); setTurn(1); setWinner(null); }

  const cellColor = (v: Cell) =>
    v === 1 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" :
    v === 2 ? "bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.7)]" : "bg-white/5";

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Scores */}
      <div className="flex gap-8 text-center">
        <div>
          <div className="w-3 h-3 rounded-full bg-rose-500 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Prathish</p>
          <p className="font-serif text-2xl text-rose-400">{scores[1]}</p>
        </div>
        <div>
          <div className="w-3 h-3 rounded-full bg-yellow-400 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Sradhaan</p>
          <p className="font-serif text-2xl text-yellow-300">{scores[2]}</p>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence mode="wait">
        <motion.p
          key={String(winner) + turn}
          className="text-sm"
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        >
          {winner ? `🎉 ${winner === 1 ? "Prathish" : "Sradhaan"} wins!` : `${turn === 1 ? "🔴 Prathish" : "🟡 Sradhaan"}'s turn`}
        </motion.p>
      </AnimatePresence>

      {/* Column buttons */}
      <div className="flex gap-1">
        {Array.from({ length: COLS }).map((_, col) => (
          <motion.button
            key={col}
            onClick={() => drop(col)}
            className="w-9 h-6 text-xs text-primary/40 hover:text-primary transition-colors"
            whileHover={{ y: -2 }}
            disabled={!!winner}
          >
            ▼
          </motion.button>
        ))}
      </div>

      {/* Board */}
      <div
        className="rounded-2xl p-2 border border-white/10"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
      >
        {board.map((row, ri) => (
          <div key={ri} className="flex gap-1 mb-1">
            {row.map((cell, ci) => (
              <motion.div
                key={ci}
                className={`w-9 h-9 rounded-full ${cellColor(cell)} transition-all duration-200`}
                animate={cell !== 0 ? { scale: [0, 1.15, 1] } : {}}
                transition={{ duration: 0.25, type: "spring" }}
              />
            ))}
          </div>
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
