import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const START_DATE = new Date("2025-09-15T00:00:00");

function getTimeElapsed() {
  const diff = Date.now() - START_DATE.getTime();
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
    <div className="flex flex-col items-center min-w-0">
      <div
        className="rounded-xl flex items-center justify-center border border-white/10"
        style={{
          width: "clamp(52px,12vw,80px)",
          height: "clamp(52px,12vw,80px)",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 20px rgba(244,63,94,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <motion.span
          key={value}
          initial={{ opacity: 0.3, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-serif text-primary"
          style={{ fontSize: "clamp(1.1rem,3.5vw,1.9rem)" }}
          data-testid={`counter-${label.toLowerCase()}`}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-muted-foreground tracking-widest uppercase mt-2" style={{ fontSize: "clamp(0.55rem,1.5vw,0.7rem)" }}>
        {label}
      </span>
    </div>
  );
}

export function LoveCounter() {
  const [time, setTime] = useState(getTimeElapsed());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeElapsed()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-20 px-4 z-10">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="rounded-3xl p-6 md:p-10 border border-primary/20 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 60px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary/60 tracking-widest uppercase text-xs mb-2">Since September 15, 2025</p>
          <h2 className="font-serif text-2xl md:text-3xl mb-8 text-foreground">
            How Long We Have Been Together ❤️
          </h2>

          {/* Always horizontal, never wrap */}
          <div className="flex items-center justify-center gap-2 md:gap-4 overflow-hidden">
            <Unit value={time.days} label="Days" />
            <span className="font-serif text-primary/30 mb-4 text-xl shrink-0">|</span>
            <Unit value={time.hours} label="Hours" />
            <span className="font-serif text-primary/30 mb-4 text-xl shrink-0">|</span>
            <Unit value={time.minutes} label="Minutes" />
            <span className="font-serif text-primary/30 mb-4 text-xl shrink-0">|</span>
            <Unit value={time.seconds} label="Seconds" />
          </div>

          <p className="text-muted-foreground italic font-serif mt-8 text-base">
            And counting…
          </p>
        </motion.div>
      </div>
    </section>
  );
}
