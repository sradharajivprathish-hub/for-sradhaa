import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const START_DATE = new Date("2025-09-15T00:00:00");

function getTimeElapsed() {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  return { years, months, days, hours, minutes, seconds };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div
        className="rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          width: 72, height: 72,
          background: "linear-gradient(135deg, hsl(345 80% 96% / 0.8), hsl(20 80% 97% / 0.6))",
          backdropFilter: "blur(12px)",
          border: "1px solid hsl(345 70% 80% / 0.35)",
          boxShadow: "0 4px 24px hsl(345 70% 70% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
        }}
      >
        <motion.span
          key={value}
          initial={{ opacity: 0.3, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-serif text-2xl text-primary"
          data-testid={`counter-${label.toLowerCase()}`}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-[10px] text-primary/60 tracking-widest uppercase">{label}</span>
    </motion.div>
  );
}

export function LoveCounter() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(getTimeElapsed());

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => setTime(getTimeElapsed()), 1000);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <section className="relative py-20 px-6 z-10">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            onClick={() => setOpen((o) => !o)}
            className="cursor-pointer rounded-3xl p-8 text-center select-none relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(345 80% 95% / 0.65), hsl(280 60% 95% / 0.45), hsl(20 80% 96% / 0.55))",
              backdropFilter: "blur(20px)",
              border: "1px solid hsl(345 70% 80% / 0.3)",
              boxShadow: "0 8px 40px hsl(345 70% 70% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Shimmer layer */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.15) 50%, transparent 60%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />

            <motion.div
              className="text-3xl mb-3"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              💕
            </motion.div>
            <p className="font-serif text-2xl md:text-3xl text-foreground mb-2">How Long Have We Been Together?</p>
            <p className="text-sm text-muted-foreground mb-4">Since September 15, 2025 — tap to reveal</p>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              className="text-primary/50 text-xl"
            >
              ↓
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-6">
                  <div className="flex items-end justify-center gap-3 md:gap-5 flex-wrap">
                    <Unit value={time.years} label="Years" />
                    <span className="font-serif text-2xl text-primary/20 mb-7">·</span>
                    <Unit value={time.months} label="Months" />
                    <span className="font-serif text-2xl text-primary/20 mb-7">·</span>
                    <Unit value={time.days} label="Days" />
                    <span className="font-serif text-2xl text-primary/20 mb-7">·</span>
                    <Unit value={time.hours} label="Hours" />
                    <span className="font-serif text-2xl text-primary/20 mb-7">·</span>
                    <Unit value={time.minutes} label="Minutes" />
                    <span className="font-serif text-2xl text-primary/20 mb-7">·</span>
                    <Unit value={time.seconds} label="Seconds" />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center font-serif text-muted-foreground italic mt-6 text-base"
                  >
                    Every single second counted, every single one treasured.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
