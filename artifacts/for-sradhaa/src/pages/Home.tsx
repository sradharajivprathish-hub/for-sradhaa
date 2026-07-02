import { motion, useScroll, useTransform } from "framer-motion";
import { FloatingPetals } from "@/components/FloatingPetals";
import { LoveCards } from "@/components/LoveCards";
import { LoveCounter } from "@/components/LoveCounter";
import { HeroSection } from "@/components/HeroSection";
import photo1 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.58_PM_1783005492798.jpeg";
import photo2 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_(1)_1783005492798.jpeg";
import photo3 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_(2)_1783005492799.jpeg";
import photo4 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_1783005492800.jpeg";
import photo5 from "@assets/WhatsApp_Image_2026-07-02_at_8.46.00_PM_(1)_1783005492800.jpeg";
import photo6 from "@assets/WhatsApp_Image_2026-07-02_at_8.46.00_PM_1783005492801.jpeg";
import proposalVideo from "@assets/pro.video_1783005492797.mp4";

const photos = [photo1, photo2, photo3, photo4, photo5, photo6];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <FloatingPetals />

      {/* Hero Section */}
      <HeroSection />

      {/* Love Counter */}
      <LoveCounter />

      {/* Our Story — full letter */}
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
            <p>Some people spend years searching for love.</p>
            <p>I found mine in just one month.</p>
            <p>
              The first time I saw you, something felt different. I didn't know your name completely,
              I didn't know your story, but my heart already knew you were someone special.
              It was truly love at first sight.
            </p>
            <p>
              Soon, life took us to different colleges. Distance separated our classrooms,
              but it never stopped my heart from finding its way to you.
            </p>

            <div className="w-full h-px bg-primary/10 my-8" />

            <p className="font-serif text-xl text-primary/70">A Love Beyond Distance</p>
            <p>They say long-distance relationships are difficult.</p>
            <p>They're right.</p>
            <p>
              We couldn't meet whenever we wanted. We missed each other during celebrations,
              ordinary days, and even the smallest moments. But despite every kilometer between us,
              our hearts always stayed connected.
            </p>
            <p>
              Every call, every message, every "good morning" and "good night" became our way
              of holding each other's hands from afar.
            </p>

            <div className="w-full h-px bg-primary/10 my-8" />

            <p className="font-serif text-xl text-primary/70">Through Every Storm</p>
            <p>Our journey wasn't perfect.</p>
            <p>We argued. We misunderstood each other. We cried.</p>
            <p>
              But every time life tested us, love found its way back. Because real love isn't
              about never fighting — it's about choosing each other even after every fight.
            </p>
            <p>Every misunderstanding made us stronger. Every goodbye taught us how precious every hello truly is.</p>

            <div className="w-full h-px bg-primary/10 my-8" />

            <p className="font-serif text-xl text-primary/70">One Beautiful Year</p>
            <p>
              July 3 marks one unforgettable year since the day our journey truly began.
              One year filled with laughter. One year filled with tears.
              One year filled with memories that I'll treasure forever.
            </p>
            <p>
              Looking back, I don't remember the distance. I don't remember the arguments.
              I only remember that through everything&hellip; it has always been you.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Love Cards — interactive flip */}
      <LoveCards />

      {/* Our Timeline */}
      <section className="relative py-24 px-6 z-10 bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="font-serif text-4xl md:text-5xl text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The Story of Us
          </motion.h2>

          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/30 before:to-transparent">
            {[
              { date: "July 3, 2025", title: "Love at First Sight", desc: "GRD Arts and Science College. I saw you, and the world stopped. I was too nervous to say a single word." },
              { date: "The First Hello", title: "Breaking the Silence", desc: "The day I finally gathered the courage to speak to you. The beginning of forever." },
              { date: "Long Distance", title: "Different Colleges, One Heart", desc: "Life separated our classrooms, but never our hearts. Every good night text became our lifeline." },
              { date: "Through the Storms", title: "Fights & Forgiveness", desc: "We argued. We cried. And every time, we chose each other again. Love always wins." },
              { date: "July 3, 2026", title: "One Beautiful Year", desc: "One year. And this website — built with every memory, every smile, every heartbeat that whispers your name." },
            ].map((event, index) => (
              <motion.div
                key={index}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                data-testid={`timeline-event-${index}`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
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

      {/* Photo Gallery */}
      <section className="relative py-24 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="font-serif text-4xl md:text-5xl text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Moments
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Frames I will treasure forever.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((src, index) => (
              <motion.div
                key={index}
                className="overflow-hidden rounded-2xl aspect-[3/4] shadow-md border border-primary/10"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                data-testid={`img-gallery-${index}`}
              >
                <img
                  src={src}
                  alt={`Our memory ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proposal Video */}
      <section className="relative py-24 px-6 z-10 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="font-serif text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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
          <motion.div
            className="rounded-3xl overflow-hidden shadow-2xl border border-primary/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <video
              src={proposalVideo}
              controls
              playsInline
              className="w-full"
              data-testid="video-proposal"
            />
          </motion.div>
        </div>
      </section>

      {/* A Promise */}
      <section className="relative py-24 px-6 z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="mb-10 flex justify-center">
            <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center text-primary">
              <span className="text-2xl font-serif">S</span>
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

          <p className="font-serif text-3xl md:text-4xl text-primary mb-4">
            Happy One Year, My Love
          </p>
          <p className="text-muted-foreground italic">
            This website isn't just made with code. It's built with every memory we've created,
            every smile we've shared, every tear we've wiped away, and every heartbeat that whispers your name.
          </p>
          <p className="font-serif text-2xl text-primary mt-10">
            I love you. Yesterday. Today. Tomorrow. Forever.
          </p>

          {/* Chat Room CTA */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="w-full h-px bg-primary/10 mb-12" />
            <p className="text-xs text-primary/60 tracking-widest uppercase mb-3">Just for us</p>
            <p className="font-serif text-2xl mb-6 text-foreground">Our Private Space</p>
            <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
              A room where only you and I can talk. Forever.
            </p>
            <a
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium text-sm tracking-wide hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              data-testid="link-chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Enter Our Chat
            </a>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
