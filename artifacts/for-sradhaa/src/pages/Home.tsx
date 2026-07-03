import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { FloatingPetals } from "@/components/FloatingPetals";
import { LoveCards } from "@/components/LoveCards";
import { LoveCounter } from "@/components/LoveCounter";
import { HeroSection } from "@/components/HeroSection";
import { MemoriesGame } from "@/components/MemoriesGame";
import { GamesHub } from "@/components/GamesHub";
import proposalVideo from "@assets/pro.video_1783069935327.mp4";

const ALLOWED = ["919944293646", "919940739865"];

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
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", boxShadow: "0 0 50px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.07)" }}
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
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
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
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
            transition={{ type: "spring", stiffness: 300, x: { duration: 0.5 } }}
          >
            <p className="text-3xl mb-2">🚫</p>
            <p className="text-rose-400 font-medium">Access Denied</p>
            <p className="text-muted-foreground text-xs mt-1">This space is for Prathish & Sradhaan only</p>
          </motion.div>
        ) : (
          <motion.div key="form" className="flex flex-col gap-3" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Enter your mobile number"
              className="w-full bg-background border border-primary/20 rounded-xl px-4 py-3 text-center text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 tracking-wider"
            />
            <motion.button
              onClick={submit}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            >
              Enter Private Chat
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Home() {
  const [videoRevealed, setVideoRevealed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <FloatingPetals />

      {/* Hero */}
      <HeroSection />

      {/* Love Counter */}
      <LoveCounter />

      {/* Our Story */}
      <section className="relative py-24 px-6 z-10 flex items-center justify-center">
        <motion.div
          className="max-w-2xl mx-auto bg-card p-8 md:p-16 rounded-3xl shadow-xl border border-primary/10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-serif text-4xl mb-2 text-primary">Our Story</h2>
          <p className="text-primary/60 tracking-widest uppercase text-xs mb-10">The Beginning</p>

          <div className="space-y-6 text-lg leading-relaxed text-foreground/80">
            <p>Some people spend years searching for love. I found mine in just one month.</p>
            <p>The first time I saw you, something felt different. I didn't know your name completely, I didn't know your story, but my heart already knew you were someone special. It was truly love at first sight.</p>
            <p>Soon, life took us to different colleges. Distance separated our classrooms, but it never stopped my heart from finding its way to you.</p>

            <div className="w-full h-px bg-primary/10 my-8" />
            <p className="font-serif text-xl text-primary/70">A Love Beyond Distance</p>
            <p>They say long-distance relationships are difficult. They're right.</p>
            <p>We couldn't meet whenever we wanted. We missed each other during celebrations, ordinary days, and even the smallest moments. But despite every kilometer between us, our hearts always stayed connected.</p>
            <p>Every call, every message, every "good morning" and "good night" became our way of holding each other's hands from afar.</p>

            <div className="w-full h-px bg-primary/10 my-8" />
            <p className="font-serif text-xl text-primary/70">Through Every Storm</p>
            <p>Our journey wasn't perfect. We argued. We misunderstood each other. We cried.</p>
            <p>But every time life tested us, love found its way back. Because real love isn't about never fighting — it's about choosing each other even after every fight.</p>
            <p>Every misunderstanding made us stronger. Every goodbye taught us how precious every hello truly is.</p>

            <div className="w-full h-px bg-primary/10 my-8" />
            <p className="font-serif text-xl text-primary/70">One Beautiful Year</p>
            <p>July 3 marks one unforgettable year since the day our journey truly began. One year filled with laughter. One year filled with tears. One year filled with memories that I'll treasure forever.</p>
            <p>Looking back, I don't remember the distance. I don't remember the arguments. I only remember that through everything… it has always been you.</p>
          </div>
        </motion.div>
      </section>

      {/* Love Cards */}
      <LoveCards />

      {/* Timeline */}
      <section className="relative py-24 px-6 z-10 bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <motion.h2 className="font-serif text-4xl md:text-5xl text-center mb-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            The Story of Us
          </motion.h2>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
            {[
              { date: "July 3, 2025", title: "Love at First Sight", desc: "GRD Arts and Science College. I saw you, and the world stopped. I was too nervous to say a single word." },
              { date: "The First Hello", title: "Breaking the Silence", desc: "The day I finally gathered the courage to speak to you. The beginning of forever." },
              { date: "September 15", title: "The Proposal 💍", desc: "The most important day. I asked, you said yes. We officially became us." },
              { date: "Long Distance", title: "Different Colleges, One Heart", desc: "Life separated our classrooms, but never our hearts. Every good night text became our lifeline." },
              { date: "December 9", title: "The Storm 💔", desc: "We broke up. It was the hardest day. But it taught us how much we truly meant to each other." },
              { date: "Through the Storms", title: "Fights & Forgiveness", desc: "We argued. We cried. And every time, we chose each other again. Love always wins." },
              { date: "July 3, 2026", title: "One Beautiful Year 🎉", desc: "One year. And this website — built with every memory, every smile, every heartbeat that whispers your name." },
            ].map((event, index) => (
              <motion.div
                key={index}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 bg-background rounded-full" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 rounded-2xl shadow-sm border border-primary/10">
                  <div className="text-primary font-medium text-sm mb-1">{event.date}</div>
                  <h3 className="font-serif text-xl mb-2">{event.title}</h3>
                  <p className="text-muted-foreground">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Memories Game */}
      <MemoriesGame />

      {/* Proposal Video Reveal */}
      <section className="relative py-24 px-6 z-10 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 className="font-serif text-4xl md:text-5xl mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            The Moment
          </motion.h2>
          <motion.p className="text-muted-foreground mb-12 text-lg" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            The day everything became official.
          </motion.p>
          <AnimatePresence mode="wait">
            {!videoRevealed ? (
              <motion.button
                key="reveal-card"
                className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-5 p-12 rounded-3xl border border-primary/20 cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", minHeight: 240 }}
                onClick={() => setVideoRevealed(true)}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(var(--primary),0.2)" }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span className="text-5xl" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>🎁</motion.span>
                <p className="font-serif text-2xl text-foreground">Tap to Reveal</p>
                <p className="text-muted-foreground text-sm">Something very special is waiting inside…</p>
              </motion.button>
            ) : (
              <motion.div
                key="video"
                className="rounded-3xl overflow-hidden shadow-2xl border border-primary/10"
                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring" }}
              >
                <video src={proposalVideo} controls playsInline className="w-full" data-testid="video-proposal" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Games Hub */}
      <GamesHub />

      {/* A Promise */}
      <section className="relative py-24 px-6 z-10 flex flex-col items-center justify-center text-center">
        <motion.div className="max-w-2xl" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <div className="mb-10 flex justify-center">
            <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-serif text-primary">S</span>
            </div>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl mb-8">A Promise</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-12">
            <p>I can't promise that we'll never argue again.</p>
            <p>I can't promise that life will always be easy.</p>
            <p className="text-foreground font-medium">But I can promise this:</p>
            <p className="font-serif text-2xl text-primary">I'll choose you.</p>
            <p>Again. Tomorrow. Every single day after that.</p>
            <p>No matter how difficult the road becomes, I'll always fight for us. Because you are worth every effort.</p>
          </div>
          <div className="w-full h-px bg-primary/10 mb-12" />
          <p className="text-muted-foreground mb-4">Thank you for staying. Thank you for forgiving me. Thank you for believing in us.</p>
          <p className="text-muted-foreground mb-12">You changed my life in ways you'll never fully understand.</p>
          <p className="font-serif text-3xl md:text-4xl text-primary mb-4">Happy One Year, My Love</p>
          <p className="text-muted-foreground italic">This website isn't just made with code. It's built with every memory we've created, every smile we've shared, every tear we've wiped away, and every heartbeat that whispers your name.</p>
          <p className="font-serif text-2xl text-primary mt-10">I love you. Yesterday. Today. Tomorrow. Forever.</p>

          {/* Chat With Me */}
          <div className="mt-16">
            <div className="w-full h-px bg-primary/10 mb-12" />
            <ChatWithMe />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
