import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { FloatingPetals } from "@/components/FloatingPetals";
import { LoveCards } from "@/components/LoveCards";
import { LoveCounter } from "@/components/LoveCounter";
import { HeroSection } from "@/components/HeroSection";
import { MemoriesGame } from "@/components/MemoriesGame";
import { GamesHub } from "@/components/GamesHub";
import { StorybookSection } from "@/components/StorybookSection";
import proposalVideo from "@assets/pro.video_1783005492797.mp4";

// ─── Change this to your desired password ────────────────────────────────────
const MOMENT_PASSWORD = "143";
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED = ["919944293646", "919940739865"];

// ── Floating icon buttons (Chat left, Games right) ──────────────────────────
function FloatingIcons({
  onChatClick,
  onGameClick,
}: {
  onChatClick: () => void;
  onGameClick: () => void;
}) {
  return (
    <>
      {/* Chat — left */}
      <motion.button
        onClick={onChatClick}
        className="fixed left-4 bottom-8 z-40 flex flex-col items-center gap-1.5 group"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Chat with me"
      >
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/30"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 0 28px rgba(244,63,94,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.15, boxShadow: "0 0 50px rgba(244,63,94,0.4)" }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-2xl">💬</span>
        </motion.div>
        <motion.span
          className="text-[10px] text-primary/50 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          Chat
        </motion.span>
      </motion.button>

      {/* Games — right */}
      <motion.button
        onClick={onGameClick}
        className="fixed right-4 bottom-8 z-40 flex flex-col items-center gap-1.5 group"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Play games"
      >
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/30"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 0 28px rgba(244,63,94,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          whileHover={{ scale: 1.15, boxShadow: "0 0 50px rgba(244,63,94,0.4)" }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-2xl">🎮</span>
        </motion.div>
        <motion.span
          className="text-[10px] text-primary/50 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          Games
        </motion.span>
      </motion.button>
    </>
  );
}

// ── Chat With Me (inline modal content) ─────────────────────────────────────
function ChatWithMe() {
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "denied">("idle");

  function submit() {
    const cleaned = phone.replace(/\D/g, "");
    if (ALLOWED.includes(cleaned)) {
      setStatus("success");
      setTimeout(() => navigate("/chat"), 1400);
    } else {
      setStatus("denied");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <motion.div
      className="rounded-3xl p-8 md:p-10 border border-primary/20 text-center max-w-sm mx-auto"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 50px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-4xl mb-4"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        💬
      </motion.div>
      <p className="text-primary/60 text-xs tracking-widest uppercase mb-2">Just for us</p>
      <h3 className="font-serif text-2xl mb-2 text-foreground">Chat With Me ❤️</h3>
      <p className="text-muted-foreground text-sm mb-6">A private space only the two of us can enter</p>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            className="py-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-3xl mb-2">✅</p>
            <p className="text-primary font-medium">Welcome in, my love ❤️</p>
            <p className="text-muted-foreground text-xs mt-1">Opening your private chat…</p>
          </motion.div>
        ) : status === "denied" ? (
          <motion.div
            key="denied"
            className="py-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
            transition={{ type: "spring", stiffness: 300, x: { duration: 0.5 } }}
          >
            <p className="text-3xl mb-2">🚫</p>
            <p className="text-rose-400 font-medium">Access Denied</p>
            <p className="text-muted-foreground text-xs mt-1">This space is for Prathish & Sradha only</p>
          </motion.div>
        ) : (
          <motion.div key="form" className="flex flex-col gap-3" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Enter your mobile number"
              className="w-full bg-background border border-primary/20 rounded-xl px-4 py-3 text-center text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 tracking-wider"
            />
            <motion.button
              onClick={submit}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Enter Private Chat
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── "The Moment" — password-gated video reveal ───────────────────────────────
function MomentSection() {
  const [stage, setStage] = useState<"locked" | "password" | "revealed">("locked");
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function tryPassword() {
    if (pw.trim() === MOMENT_PASSWORD) {
      setStage("revealed");
    } else {
      setError(true);
      setShake(true);
      setPw("");
      setTimeout(() => { setError(false); setShake(false); }, 1800);
    }
  }

  return (
    <section className="relative py-24 px-6 z-10 overflow-hidden">
      {/* Cinematic backdrop */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(244,63,94,0.06), transparent 70%)" }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          className="text-primary/60 tracking-widest uppercase text-xs mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          A secret memory
        </motion.p>
        <motion.h2
          className="font-serif text-4xl md:text-5xl mb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The Moment
        </motion.h2>
        <motion.p
          className="text-muted-foreground mb-12 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          The day everything became official.
        </motion.p>

        <AnimatePresence mode="wait">
          {stage === "locked" && (
            <motion.button
              key="locked"
              className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-5 p-12 rounded-3xl border border-primary/20 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                minHeight: 240,
                boxShadow: "0 0 60px rgba(244,63,94,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              onClick={() => setStage("password")}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88, y: -20 }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 80px rgba(244,63,94,0.18)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="text-5xl"
                animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🔐
              </motion.div>
              <div>
                <p className="font-serif text-2xl text-foreground mb-1">Unlock the Secret</p>
                <p className="text-muted-foreground text-sm">Only those who know the password may enter</p>
              </div>
              <motion.div
                className="flex gap-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary/30" />
                ))}
              </motion.div>
            </motion.button>
          )}

          {stage === "password" && (
            <motion.div
              key="password"
              className="w-full max-w-md mx-auto rounded-3xl border border-primary/25 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 0 80px rgba(244,63,94,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-primary/10">
                <motion.div
                  className="text-4xl mb-3"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  🗝️
                </motion.div>
                <p className="font-serif text-xl text-foreground">Enter the Secret Password</p>
                <p className="text-muted-foreground text-sm mt-1">Only Prathish & Sradha know this</p>
              </div>

              {/* Form */}
              <div className="px-8 py-6 flex flex-col gap-4">
                <motion.div
                  animate={shake ? { x: [0, -10, 10, -8, 8, -4, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && tryPassword()}
                    placeholder="••••••••"
                    autoFocus
                    className="w-full bg-background/50 border rounded-2xl px-5 py-4 text-center text-foreground placeholder:text-muted-foreground/40 focus:outline-none tracking-[0.3em] text-lg transition-all duration-200"
                    style={{
                      borderColor: error ? "rgba(244,63,94,0.6)" : "rgba(244,63,94,0.2)",
                      boxShadow: error ? "0 0 20px rgba(244,63,94,0.15)" : "none",
                    }}
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-rose-400 text-sm text-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ❌ Incorrect password — try again
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={tryPassword}
                  className="w-full py-4 rounded-2xl font-medium text-primary-foreground relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, hsl(345 80% 55%), hsl(345 70% 45%))",
                    boxShadow: "0 4px 24px rgba(244,63,94,0.3)",
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 6px 36px rgba(244,63,94,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.4 }}
                  />
                  Unlock ❤️
                </motion.button>

                <button
                  onClick={() => setStage("locked")}
                  className="text-muted-foreground/50 text-xs hover:text-muted-foreground transition-colors"
                >
                  ← Go back
                </button>
              </div>
            </motion.div>
          )}

          {stage === "revealed" && (
            <motion.div
              key="video"
              className="w-full"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, type: "spring", damping: 20 }}
            >
              {/* Cinematic reveal flourish */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                <motion.span
                  className="text-primary text-sm tracking-widest uppercase"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨ Unlocked ✨
                </motion.span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
              </motion.div>

              <motion.div
                className="rounded-3xl overflow-hidden border border-primary/20"
                style={{ boxShadow: "0 0 80px rgba(244,63,94,0.2), 0 20px 60px rgba(0,0,0,0.3)" }}
              >
                <video
                  src={proposalVideo}
                  controls
                  playsInline
                  autoPlay
                  className="w-full"
                  data-testid="video-proposal"
                />
              </motion.div>

              <motion.p
                className="font-serif text-muted-foreground italic text-sm mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                The day my heart found its forever home ❤️
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── The Promise — premium redesign ────────────────────────────────────────────
const PROMISE_STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

const PROMISES = [
  "I can't promise that we'll never argue again.",
  "I can't promise that life will always be easy.",
];

function PromiseSection() {
  return (
    <section className="relative py-28 px-6 z-10 overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {PROMISE_STARS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-primary/20"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
            animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.7, 1.4, 0.7] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Glowing core */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(ellipse, rgba(244,63,94,0.08), transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 pointer-events-none"
          style={{ width: 200 + i * 120, height: 200 + i * 120 }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        />
      ))}

      <motion.div
        className="max-w-2xl mx-auto relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Monogram */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center relative"
            style={{
              border: "1px solid rgba(244,63,94,0.3)",
              background: "rgba(244,63,94,0.05)",
              boxShadow: "0 0 40px rgba(244,63,94,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
            animate={{ boxShadow: ["0 0 30px rgba(244,63,94,0.12)", "0 0 60px rgba(244,63,94,0.28)", "0 0 30px rgba(244,63,94,0.12)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-3xl font-serif text-primary">S</span>
            {/* Orbiting heart */}
            <motion.div
              className="absolute text-xs"
              style={{ top: -4, right: -4 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <span style={{ display: "block", transform: "rotate(0deg)" }}>❤️</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h2
          className="font-serif text-3xl md:text-5xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          A Promise
        </motion.h2>

        {/* Promise lines */}
        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-8">
          {PROMISES.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
            >
              {p}
            </motion.p>
          ))}

          <motion.p
            className="text-foreground font-medium text-xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            But I can promise this:
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.55, type: "spring", bounce: 0.4 }}
          >
            <motion.p
              className="font-serif text-3xl md:text-4xl text-primary my-4"
              animate={{ textShadow: ["0 0 20px rgba(244,63,94,0.3)", "0 0 40px rgba(244,63,94,0.6)", "0 0 20px rgba(244,63,94,0.3)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              I'll choose you.
            </motion.p>
          </motion.div>

          {[
            "Again. Tomorrow. Every single day after that.",
            "No matter how difficult the road becomes, I'll always fight for us. Because you are worth every effort.",
          ].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.15 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Divider with floating hearts */}
        <motion.div
          className="relative h-12 flex items-center justify-center my-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>
          <div className="flex gap-2 bg-background px-4 relative">
            {["❤️", "💕", "❤️"].map((h, i) => (
              <motion.span
                key={i}
                className="text-sm"
                animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
              >
                {h}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {[
          "Thank you for staying. Thank you for forgiving me. Thank you for believing in us.",
          "You changed my life in ways you'll never fully understand.",
        ].map((line, i) => (
          <motion.p
            key={i}
            className="text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 1 + i * 0.15 }}
          >
            {line}
          </motion.p>
        ))}

        {/* Anniversary headline */}
        <motion.div
          className="my-10 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, type: "spring", bounce: 0.3 }}
        >
          <motion.p
            className="font-serif text-3xl md:text-4xl text-primary"
            animate={{ filter: ["drop-shadow(0 0 8px rgba(244,63,94,0.3))", "drop-shadow(0 0 24px rgba(244,63,94,0.6))", "drop-shadow(0 0 8px rgba(244,63,94,0.3))"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Happy One Year, My Love 🎉
          </motion.p>
        </motion.div>

        <motion.p
          className="text-muted-foreground italic font-serif"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          This website isn't just made with code. It's built with every memory we've created, every smile we've shared, every tear we've wiped away, and every heartbeat that whispers your name.
        </motion.p>

        <motion.p
          className="font-serif text-2xl text-primary mt-10 mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
        >
          I love you. Yesterday. Today. Tomorrow. Forever.
        </motion.p>
      </motion.div>
    </section>
  );
}

// ── Main Home Page ────────────────────────────────────────────────────────────
export default function Home() {
  const chatRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <FloatingPetals />

      {/* Floating nav icons */}
      <FloatingIcons
        onChatClick={() => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
        onGameClick={() => gamesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
      />

      {/* Hero */}
      <HeroSection />

      {/* Love Counter */}
      <LoveCounter />

      {/* Our Love Story — combined chapter storybook */}
      <StorybookSection />

      {/* The Universe I Found In You */}
      <LoveCards />

      {/* Six Memories */}
      <MemoriesGame />

      {/* The Moment — password-gated video */}
      <MomentSection />

      {/* Play Together */}
      <div ref={gamesRef}>
        <GamesHub />
      </div>

      {/* A Promise */}
      <PromiseSection />

      {/* Chat With Me — floating icon scrolls here */}
      <div ref={chatRef} className="relative py-12 px-6 z-10 flex justify-center">
        <ChatWithMe />
      </div>
    </div>
  );
}
