import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  const days = Math.floor(totalHours / 24);

  return { days, hours, minutes, seconds };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="bg-card border border-primary/10 rounded-2xl w-20 h-20 md:w-28 md:h-28 flex items-center justify-center shadow-md mb-2">
        <motion.span
          key={value}
          initial={{ opacity: 0.4, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-serif text-3xl md:text-4xl text-primary"
          data-testid={`counter-${label.toLowerCase()}`}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-xs text-muted-foreground tracking-widest uppercase">{label}</span>
    </motion.div>
  );
}

export function LoveCounter() {
  const [time, setTime] = useState(getTimeElapsed());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeElapsed());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-24 px-6 z-10 bg-primary/5">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          className="text-primary/60 tracking-widest uppercase text-xs mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Since September 15, 2025
        </motion.p>
        <motion.h2
          className="font-serif text-4xl md:text-5xl mb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          We Have Been Together
        </motion.h2>
        <motion.p
          className="text-muted-foreground mb-14 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Every second with you is one I never want to stop counting.
        </motion.p>

        <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
          <Unit value={time.days} label="Days" />
          <span className="font-serif text-3xl text-primary/30 mb-6">:</span>
          <Unit value={time.hours} label="Hours" />
          <span className="font-serif text-3xl text-primary/30 mb-6">:</span>
          <Unit value={time.minutes} label="Minutes" />
          <span className="font-serif text-3xl text-primary/30 mb-6">:</span>
          <Unit value={time.seconds} label="Seconds" />
        </div>

        <motion.p
          className="text-muted-foreground italic font-serif mt-14 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          And counting&hellip;
        </motion.p>
      </div>
    </section>
  );
}
