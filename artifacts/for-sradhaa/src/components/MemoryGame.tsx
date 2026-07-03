import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import photo1 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.58_PM_1783005492798.jpeg";
import photo2 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_(1)_1783005492798.jpeg";
import photo3 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_(2)_1783005492799.jpeg";
import photo4 from "@assets/WhatsApp_Image_2026-07-02_at_8.45.59_PM_1783005492800.jpeg";
import photo5 from "@assets/WhatsApp_Image_2026-07-02_at_8.46.00_PM_(1)_1783005492800.jpeg";
import photo6 from "@assets/WhatsApp_Image_2026-07-02_at_8.46.00_PM_1783005492801.jpeg";

const FUNNY_WRONG = [
  "Pizza 🍕", "WiFi password 📶", "His phone charger 🔋", "Netflix 📺", "His pillow 🛏️",
  "The moon 🌙", "Biryani 🍚", "His mom's cooking 🍳", "Air conditioning ❄️", "His bed 😴",
  "Sleep 💤", "Money 💸", "His best friend's memes 😂", "Friday night 🎉", "Ice cream 🍦",
  "Coffee ☕", "His gaming controller 🎮", "His pet goldfish 🐠", "Sunsets 🌅", "Rain ☔",
  "His reflection in the mirror 🪞", "Chicken wings 🍗", "The internet 🌐", "Chocolate 🍫",
  "His playlist 🎵", "Mangoes 🥭", "Cricket 🏏", "His best friend Udaya 😅", "Nishant bro 😂",
  "Bread 🍞", "YouTube 📱", "His alarm clock that he always ignores ⏰", "His old hoodie 🧥",
  "Petrol smell ⛽", "New sneakers 👟", "The last slice of pizza 🍕", "His mom 👩", "His dog 🐶",
  "Himself 😂", "The gym 💪", "Samosas 🥟", "His bike 🏍️", "Chai ☕", "His childhood toys 🧸",
  "Instagram reels 📱", "His trophy shelf 🏆", "Butter naan 🫓", "Watermelon 🍉", "His headphones 🎧",
  "A warm blanket on cold nights 🛌", "His notes he never studies 📚", "Sunday mornings 🌤️",
  "The last cookie in the jar 🍪", "His favorite T-shirt 👕", "The smell of petrichor 🌧️",
  "His imaginary future car 🚗", "Cold water on a hot day 💧", "His childhood memories 🧒",
  "Paani puri 💛", "His football team ⚽", "AC in summer 🌬️", "His morning chai ritual ☕",
  "The first episode of his favorite show 📺", "Dosas 🥞", "His earphones 🎧", "Night drives 🌃",
  "Stars on a clear night ⭐", "His perfectly arranged bookshelf 📚", "Free WiFi 📶",
  "His secret snack stash 🍬", "The weekend 📅", "Unlimited data plan 📡", "Curd rice 🍚",
  "Holiday sales 🛍️", "His lucky pen ✒️", "The smell of books 📖", "A fully charged phone 🔋",
  "His superhero movies 🦸", "Pani puri on a rainy day ⛈️", "His childhood blanket 🧸",
  "Roadside chai 🍵", "His perfectly made bed (once a year) 🛏️", "Spider-Man 🕷️",
  "His lucky underwear 🩲", "A long nap 😴", "His football jersey ⚽", "Butter chicken 🍗",
  "Roadside vada pav 🥙", "His morning alarm (which he ignores) ⏰", "His comic book collection 📚",
  "Old Bollywood songs 🎶", "His signature selfie pose 🤳", "Gulab jamun 🍮",
  "The smell of rain on hot ground 🌧️", "A surprise holiday 🏖️", "His favorite mug ☕",
  "Midnight Maggi 🍜", "His art doodles 🎨", "His secret playlist 🎵", "His gym gains 💪",
  "Cricket highlights at 2am 🏏", "His dramatic sneezes 😤", "Halwa 🍮",
  "His ability to sleep anywhere 😴", "The last bite of food 🍽️", "His favorite pen 🖊️",
  "His 'one more episode' nights 📺", "Pav bhaji 🍲", "His autographed cricket ball 🏏",
  "His perfectly curated memes 🐸", "Kadala curry 🍛", "His Spotify wrapped every year 🎶",
  "Gajar ka halwa in winter 🥕", "His childhood school bag 🎒", "Mountain Dew 🥤",
  "His perfectly timed jokes 😂", "The first rain after summer 🌧️", "Filter coffee ☕",
  "His pet hypothetical arguments 💬", "His worn-out slippers 🥿", "Thali at a nice restaurant 🍽️",
  "His habit of starting sentences with 'Actually...' 😅", "The perfect game score 🎮",
  "His weekend plans that never happen 📅", "Murukku 🥨", "His one good shirt for occasions 👔",
  "His midnight philosophy sessions 🌙", "Rava upma 🍽️", "His perfectly memorized movie dialogues 🎬",
  "His theory that 'one more match' won't take long ⚽", "Puliyodarai 🍚",
  "His ritual of checking if the door is locked 3 times 🚪", "His air guitar performances 🎸",
  "Rasam when sick 🍲", "His imaginary band name 🎵", "His 'this is the last reel I'm watching' promise 📱",
  "His elaborate sandwich-making process 🥪", "Appam with stew 🥘",
  "His special talent of finding food everywhere 🍕", "Idli with coconut chutney 🥥",
  "His perfectly memorized cricket stats 📊", "His 'I know a shortcut' confidence 🗺️",
  "Cold coffee on a hot day ☕❄️", "His invisible future sports car 🚗",
  "His superhero origin story he's been planning 🦸", "Masala chai in a clay cup 🫖",
  "His theory that he'd win MasterChef 👨‍🍳", "His selective memory 🧠",
  "Chole bhature on Sunday 🍛", "His imaginary perfect day that never comes 📅",
  "His perfectly rehearsed comeback lines 💬", "Beetroot halwa 🍮",
  "His diplomatic answer to 'what do you want to eat?' 🤷", "His special sleeping position 🛌",
  "Pongal on festival days 🎊", "His 10-minute alarm that he snoozes for an hour ⏰",
  "His rain playlist that he listens to in summer 🎵🌧️", "Payasam 🍮",
  "His invisible trophy for surviving Mondays 🏆", "His imaginary conversation he rehearsed vs what he actually said 😅",
  "Sev puri from the local stall 🥙", "His way of explaining complex things with simple wrong analogies 🤓",
  "His annual promise to wake up early 🌅", "Bread omelette at midnight 🍳",
  "His invisible PhD in procrastination ⏳", "His award for most creative excuses 🏅",
  "Coconut water on a sunny day 🥥", "His talent for starting late but arriving exactly on time 🕐",
  "His perfectly timed 'I told you so' moments 😏", "Mango lassi 🥭",
  "His unfinished bucket list from 3 years ago 📝", "His legendary 5-more-minutes 🛌",
  "Dal makhani on a cold night 🍛", "His invisible black belt in overthinking 🧠",
  "His dramatic exit lines from arguments 💨", "Jalebi fresh from the kadai 🍩",
  "His perfect plan that changes every week 🗺️", "Aloo paratha for breakfast 🥞",
  "His award for napping at the most inappropriate times 😴", "Rabri 🍮",
  "His invisible career as a background dancer 🕺", "Chana masala with bhature 🍛",
  "His lifelong membership of the 'one more chapter' reading club 📚",
  "Lemon rice with pickle 🍋", "His imaginary autobiography in progress ✍️",
  "Sabudana khichdi on fasting days 🌾",
];

const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

const MEMORIES: {
  title: string;
  question: string;
  answer: string;
  message: string;
  options: string[];
  photo: string;
}[] = [
  {
    title: "Memory 1",
    question: "What is my favorite color?",
    answer: "Pink",
    message: "Pink — just like the colour of love. You know me so well, my love. 💗",
    options: shuffle(["Pink", "Blue"]),
    photo: photo1,
  },
  {
    title: "Memory 2",
    question: "On which date did I propose to you and we officially became a couple?",
    answer: "September 15 2025",
    message: "September 15, 2025 — the day my heart finally found its home. ❤️",
    options: shuffle(["September 15 2025", "July 3 2025"]),
    photo: photo2,
  },
  {
    title: "Memory 3",
    question: "On which date did we break up first?",
    answer: "December 9 2025",
    message: "December 9 — the hardest day. But we found each other again, and that's what matters most. 💞",
    options: shuffle(["December 9 2025", "December 25 2025"]),
    photo: photo3,
  },
  {
    title: "Memory 4",
    question: "Who is the best couple forever?",
    answer: "Us ❤️",
    message: "Always and forever — it's us. 💑",
    options: shuffle(["Us ❤️", "Romeo & Juliet"]),
    photo: photo4,
  },
  {
    title: "Memory 5",
    question: "Who are our closest friends?",
    answer: "Udaya & Nishant",
    message: "Udaya & Nishant — our forever people who know our whole story. 🤝💕",
    options: shuffle(["Udaya & Nishant", "Rohan & Meera"]),
    photo: photo5,
  },
  {
    title: "Memory 6",
    question: "Who does Prathish love the most in the whole world?",
    answer: "Sradha ❤️",
    message: "It has always been you. Every heartbeat, every thought, every moment — you, only you. 💖",
    options: shuffle(["Sradha ❤️", FUNNY_WRONG[Math.floor(Math.random() * FUNNY_WRONG.length)]]),
    photo: photo6,
  },
];

function FloatingSuccessHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-base select-none"
          style={{ left: `${5 + i * 8}%`, bottom: "10%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -120, opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: i * 0.15, ease: "easeOut" }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}

function MemoryCard({ memory, index }: { memory: typeof MEMORIES[0]; index: number }) {
  const [unlocked, setUnlocked] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const handleAnswer = (opt: string) => {
    if (unlocked) return;
    if (opt === memory.answer) {
      setSelected(opt);
      setUnlocked(true);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2500);
    } else {
      setSelected(opt);
      setWrong(true);
      setTimeout(() => { setSelected(null); setWrong(false); }, 1200);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(345 80% 96% / 0.7), hsl(280 60% 97% / 0.5))",
        backdropFilter: "blur(20px)",
        border: "1px solid hsl(345 70% 80% / 0.3)",
        boxShadow: "0 8px 40px hsl(345 70% 70% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
      }}
    >
      {showHearts && <FloatingSuccessHearts />}

      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
            {unlocked ? "✓" : index + 1}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{memory.title}</p>
            <p className="text-xs text-muted-foreground">{unlocked ? "Unlocked 💕" : "Locked 🔒"}</p>
          </div>
        </div>

        {!unlocked ? (
          <>
            <p className="font-serif text-base text-foreground mb-4 leading-relaxed">{memory.question}</p>

            <AnimatePresence>
              {wrong && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-3 p-3 rounded-2xl text-center"
                  style={{ background: "hsl(0 80% 95%)", border: "1px solid hsl(0 70% 80% / 0.4)" }}
                >
                  <p className="text-sm font-medium" style={{ color: "hsl(0 70% 50%)" }}>❌ Incorrect Answer</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(0 60% 60%)" }}>Try again, my love ❤️</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3">
              {memory.options?.map((opt) => (
                <motion.button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="text-center text-sm font-medium px-4 py-4 rounded-2xl transition-all duration-200"
                  style={{
                    background: selected === opt && wrong
                      ? "hsl(0 80% 95%)"
                      : "linear-gradient(135deg, hsl(345 80% 97% / 0.8), hsl(0 0% 100% / 0.6))",
                    border: selected === opt && wrong
                      ? "1.5px solid hsl(0 70% 70% / 0.6)"
                      : "1.5px solid hsl(var(--primary) / 0.2)",
                    color: "hsl(var(--foreground) / 0.85)",
                    boxShadow: "0 2px 12px hsl(345 70% 70% / 0.08)",
                  }}
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 20px hsl(345 70% 70% / 0.2)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-3 p-3 rounded-2xl text-center"
              style={{ background: "hsl(120 60% 95%)", border: "1px solid hsl(120 50% 70% / 0.4)" }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <p className="text-sm font-medium" style={{ color: "hsl(120 50% 35%)" }}>✨ Correct!</p>
            </motion.div>

            <div className="rounded-2xl overflow-hidden mb-3 aspect-[4/3]">
              <img src={memory.photo} alt={memory.title} className="w-full h-full object-cover" />
            </div>

            <p className="font-serif text-sm text-foreground/80 leading-relaxed text-center italic">
              {memory.message}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function MemoryGame() {
  return (
    <section className="relative py-24 px-6 z-10">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-center text-primary/60 tracking-widest uppercase text-xs mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Can you remember?
        </motion.p>
        <motion.h2
          className="font-serif text-4xl md:text-5xl text-center mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Six Memories
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-14 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Each memory is locked. Answer the question correctly to unlock it. 🔐
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEMORIES.map((m, i) => (
            <MemoryCard key={i} memory={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
