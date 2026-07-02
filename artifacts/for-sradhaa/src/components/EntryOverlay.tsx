import { motion } from "framer-motion";

interface Props {
  onEnter: () => void;
}

export function EntryOverlay({ onEnter }: Props) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <motion.div
          className="text-5xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          💕
        </motion.div>

        <p className="font-serif text-2xl text-foreground tracking-wide">For Sradhaa</p>
        <p className="text-sm text-muted-foreground">with love</p>

        <motion.button
          onClick={onEnter}
          className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg tracking-widest uppercase"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
