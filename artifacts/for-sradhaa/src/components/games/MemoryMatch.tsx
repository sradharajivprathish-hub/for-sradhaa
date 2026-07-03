import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["🌹", "💖", "🌙", "⭐", "🎵", "🦋", "🌊", "🍀", "🌺", "💎", "🎀", "🐝"];

function makeCards(pairs: number) {
  const pool = EMOJIS.slice(0, pairs);
  const deck = [...pool, ...pool].sort(() => Math.random() - 0.5);
  return deck.map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
}

export function MemoryMatch() {
  const PAIRS = 8;
  const [cards, setCards] = useState(() => makeCards(PAIRS));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const matched = cards.filter(c => c.matched).length / 2;
  const won = matched === PAIRS;

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    setLocked(true);
    setMoves(m => m + 1);
    if (cards[a].emoji === cards[b].emoji) {
      setCards(cs => cs.map(c => c.id === a || c.id === b ? { ...c, matched: true } : c));
      setFlipped([]);
      setLocked(false);
    } else {
      setTimeout(() => {
        setCards(cs => cs.map(c => c.id === a || c.id === b ? { ...c, flipped: false } : c));
        setFlipped([]);
        setLocked(false);
      }, 900);
    }
  }, [flipped]);

  function flip(id: number) {
    if (locked || cards[id].flipped || cards[id].matched || flipped.length >= 2) return;
    setCards(cs => cs.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(f => [...f, id]);
  }

  function reset() {
    setCards(makeCards(PAIRS));
    setFlipped([]);
    setLocked(false);
    setMoves(0);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-6 text-center">
        <div><p className="text-xs text-muted-foreground">Pairs Found</p><p className="font-serif text-2xl text-primary">{matched}/{PAIRS}</p></div>
        <div><p className="text-xs text-muted-foreground">Moves</p><p className="font-serif text-2xl text-primary">{moves}</p></div>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            className="text-center"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-3xl mb-1">🎉</p>
            <p className="font-serif text-lg text-primary">All pairs matched in {moves} moves!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <motion.button
            key={card.id}
            onClick={() => flip(card.id)}
            className="w-16 h-16 rounded-xl text-2xl border border-white/10 flex items-center justify-center"
            style={{ background: card.flipped || card.matched ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
            whileHover={!card.flipped && !card.matched ? { scale: 1.08 } : {}}
            whileTap={!card.flipped && !card.matched ? { scale: 0.92 } : {}}
            animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
            transition={{ duration: 0.35 }}
          >
            <motion.span animate={{ opacity: card.flipped || card.matched ? 1 : 0 }}>
              {card.emoji}
            </motion.span>
            {!card.flipped && !card.matched && <span className="absolute text-primary/30 text-xl">?</span>}
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={reset}
        className="px-6 py-2.5 rounded-full border border-primary/30 text-sm text-primary hover:bg-primary/10 transition-colors mt-2"
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      >
        New Game
      </motion.button>
    </div>
  );
}
