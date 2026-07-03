import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TicTacToe } from "@/components/games/TicTacToe";
import { RockPaperScissors } from "@/components/games/RockPaperScissors";
import { NumberGuessing } from "@/components/games/NumberGuessing";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { ConnectFour } from "@/components/games/ConnectFour";

interface Game {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  gradient: string;
  component: React.ComponentType;
}

const GAMES: Game[] = [
  { id: "ttt", name: "Tic Tac Toe", emoji: "✕○", desc: "Classic X vs O battle", gradient: "from-rose-900/60 to-pink-900/60", component: TicTacToe },
  { id: "rps", name: "Rock Paper Scissors", emoji: "✊✌️", desc: "Best of infinite rounds", gradient: "from-violet-900/60 to-rose-900/60", component: RockPaperScissors },
  { id: "num", name: "Number Guessing", emoji: "🔢", desc: "Guess the hidden number", gradient: "from-indigo-900/60 to-blue-900/60", component: NumberGuessing },
  { id: "mem", name: "Memory Match", emoji: "🃏", desc: "Find all matching pairs", gradient: "from-emerald-900/60 to-teal-900/60", component: MemoryMatch },
  { id: "c4", name: "Connect Four", emoji: "🔴🟡", desc: "Drop pieces, get 4 in a row", gradient: "from-amber-900/60 to-orange-900/60", component: ConnectFour },
];

export function GamesHub() {
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  return (
    <section className="relative py-24 px-6 z-10 bg-primary/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary/60 tracking-widest uppercase text-xs mb-3">Just the two of us</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Play Together 🎮</h2>
          <p className="text-muted-foreground">Five games to enjoy together, anytime, anywhere</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {GAMES.map((game, i) => (
            <motion.button
              key={game.id}
              onClick={() => setActiveGame(game)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-white/10 text-center group"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.06, background: "rgba(255,255,255,0.07)" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-2xl border border-white/10`}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              >
                {game.emoji[0]}
              </motion.div>
              <p className="text-sm font-medium text-foreground/90 leading-tight">{game.name}</p>
              <p className="text-xs text-muted-foreground leading-snug">{game.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Game Modal */}
        <AnimatePresence>
          {activeGame && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveGame(null)}
            >
              <motion.div
                className="w-full max-w-lg bg-card border border-primary/20 rounded-3xl shadow-2xl overflow-hidden"
                style={{ maxHeight: "90dvh", overflowY: "auto" }}
                initial={{ scale: 0.85, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.85, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 280 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div
                  className={`bg-gradient-to-r ${activeGame.gradient} px-6 py-5 flex items-center justify-between border-b border-white/10`}
                >
                  <div>
                    <p className="text-white/60 text-xs tracking-widest uppercase mb-0.5">Play Together</p>
                    <h3 className="font-serif text-xl text-white">{activeGame.emoji[0]} {activeGame.name}</h3>
                  </div>
                  <motion.button
                    onClick={() => setActiveGame(null)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                {/* Game content */}
                <div className="px-4 py-4">
                  <activeGame.component />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
