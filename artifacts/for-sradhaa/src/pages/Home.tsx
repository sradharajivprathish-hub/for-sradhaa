import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingPetals } from "@/components/FloatingPetals";
import { LoveCards } from "@/components/LoveCards";
import { LoveCounter } from "@/components/LoveCounter";
import { HeroSection } from "@/components/HeroSection";
import { StorybookSection } from "@/components/StorybookSection";
import { MemoryGame } from "@/components/MemoryGame";
import proposalVideo from "@assets/pro.video_1783005492797.mp4";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(135deg, hsl(345 80% 96% / 0.65), hsl(280 50% 97% / 0.45))",
        backdropFilter: "blur(20px)",
        border: "1px solid hsl(345 70% 80% / 0.3)",
        boxShadow: "0 8px 40px hsl(345 70% 70% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
      }}
    >
      {children}
    </div>
  );
}

function ProposalVideoSection() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          className="text-primary/60 tracking-widest uppercase text-xs mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          The Day Everything Changed
        </motion.p>
        <motion.h2
          className="font-serif text-4xl md:text-5xl mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The Moment
        </motion.h2>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="reveal-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6 }}
              className="cursor-pointer"
              onClick={() => setRevealed(true)}
            >
              <GlassCard className="rounded-3xl p-12 md:p-16 flex flex-col items-center gap-6">
                <motion.div
                  className="text-5xl"
                  animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎁
                </motion.div>
                <div>
                  <p className="font-serif text-2xl md:text-3xl text-foreground mb-2">Tap to Reveal</p>
                  <p className="text-muted-foreground">The most beautiful moment of our story…</p>
                </div>
                <motion.div
                  className="mt-2 px-8 py-3 rounded-full text-sm font-medium text-primary-foreground"
                  style={{ background: "hsl(var(--primary))" }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  Open Our Memory ❤️
                </motion.div>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ border: "1px solid hsl(var(--primary) / 0.2)" }}
              >
                <video
                  src={proposalVideo}
                  controls
                  autoPlay
                  playsInline
                  className="w-full"
                  data-testid="video-proposal"
                />
              </div>
              <motion.p
                className="font-serif text-muted-foreground italic mt-6 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                The day everything became official. 💍
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PrivateChatSection() {
  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Animated glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              animate={{ boxShadow: ["0 0 40px hsl(345 80% 70% / 0.15)", "0 0 80px hsl(345 80% 70% / 0.3)", "0 0 40px hsl(345 80% 70% / 0.15)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Floating hearts */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {Array.from({ length: 6 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-sm select-none"
                  style={{ left: `${10 + i * 16}%`, bottom: "5%" }}
                  animate={{ y: [0, -80], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 3.5, delay: i * 0.6, repeat: Infinity, ease: "easeOut" }}
                >
                  💕
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl mx-auto mb-6 shadow-lg"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                💬
              </motion.div>
              <p className="text-xs text-primary/60 tracking-widest uppercase mb-2">Just for us</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">Our Private Space</h2>
              <p className="text-muted-foreground mb-2 leading-relaxed">
                A room where only you and I can talk. No one else. No noise. Just us.
              </p>
              <p className="font-serif text-muted-foreground/60 italic text-sm mb-8">
                Our own little corner of the universe.
              </p>

              <a
                href={`${BASE}/chat`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium text-sm tracking-wide hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:shadow-xl"
                data-testid="link-chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Enter Our Chat
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

function PromiseSection() {
  return (
    <section className="relative py-24 px-6 z-10 flex flex-col items-center justify-center text-center">
      {/* Aurora background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(345 80% 90% / 0.25), transparent 70%)" }} className="absolute inset-0" />
      </div>

      <motion.div
        className="max-w-2xl relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="mb-10 flex justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center text-primary">
            <span className="text-2xl font-serif">S</span>
          </div>
        </motion.div>

        <h2 className="font-serif text-3xl md:text-5xl mb-8">A Promise</h2>

        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-12">
          <p>I can't promise that we'll never argue again.</p>
          <p>I can't promise that life will always be easy.</p>
          <p className="text-foreground font-medium">But I can promise this:</p>
          <motion.p
            className="font-serif text-3xl text-primary"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            I'll choose you.
          </motion.p>
          <p>Again. Tomorrow. Every single day after that.</p>
          <p>No matter how difficult the road becomes, I'll always fight for us. Because you are worth every effort.</p>
        </div>

        <div className="w-full h-px bg-primary/10 mb-12" />

        <p className="text-muted-foreground mb-4">Thank you for staying. Thank you for forgiving me. Thank you for believing in us.</p>
        <p className="text-muted-foreground mb-12">You changed my life in ways you'll never fully understand.</p>

        <motion.p
          className="font-serif text-3xl md:text-4xl text-primary mb-4"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Happy One Year, My Love 💕
        </motion.p>
        <p className="text-muted-foreground italic text-sm leading-relaxed">
          This website isn't just made with code. It's built with every memory we've created,
          every smile we've shared, every tear we've wiped away, and every heartbeat that whispers your name.
        </p>
        <p className="font-serif text-2xl text-primary mt-10">
          I love you. Yesterday. Today. Tomorrow. Forever.
        </p>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <FloatingPetals />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Interactive Love Counter */}
      <LoveCounter />

      {/* 3. Storybook — merged Our Story + Story of Us */}
      <StorybookSection />

      {/* 4. The Universe I Found In You */}
      <LoveCards />

      {/* 5. Six Memories Challenge */}
      <MemoryGame />

      {/* 6. Proposal Video — tap to reveal */}
      <ProposalVideoSection />

      {/* 7. Games Room */}
      <section className="relative py-12 px-6 z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="rounded-3xl p-8 text-center relative overflow-hidden cursor-pointer"
              style={{
                background: "linear-gradient(135deg, hsl(280 60% 95% / 0.65), hsl(345 80% 96% / 0.55))",
                backdropFilter: "blur(20px)",
                border: "1px solid hsl(280 60% 80% / 0.3)",
                boxShadow: "0 8px 40px hsl(280 60% 70% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
              }}
            >
              <motion.div className="text-4xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>🎮</motion.div>
              <p className="text-xs text-primary/60 tracking-widest uppercase mb-2">Play together</p>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">Our Game Room</h2>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">Tic-Tac-Toe, Connect Four, Rock Paper Scissors & more — live multiplayer, just the two of us.</p>
              <a
                href={`${BASE}/games`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium text-sm tracking-wide hover:opacity-90 transition-all shadow-lg shadow-primary/25"
              >
                🎮 Play Games
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Private Chat Room — prominent on home */}
      <PrivateChatSection />

      {/* 8. A Promise */}
      <PromiseSection />
    </div>
  );
}
