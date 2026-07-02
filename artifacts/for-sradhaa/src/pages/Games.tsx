import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameSocket, type GameType } from "@/hooks/useGameSocket";
import { TicTacToe } from "@/components/games/TicTacToe";
import { ConnectFour } from "@/components/games/ConnectFour";
import { RockPaperScissors } from "@/components/games/RockPaperScissors";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { NumberGuess } from "@/components/games/NumberGuess";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const NATIVE_GAMES: { id: GameType; emoji: string; title: string; desc: string; color: string }[] = [
  { id: "tictactoe", emoji: "❌", title: "Tic-Tac-Toe", desc: "Classic 3×3 grid battle. First to three in a row wins!", color: "hsl(345 80% 60%)" },
  { id: "connectfour", emoji: "🔴", title: "Connect Four", desc: "Drop pieces to connect four in a row before your partner!", color: "hsl(200 80% 55%)" },
  { id: "rps", emoji: "🪨", title: "Rock Paper Scissors", desc: "Best of 5 rounds. Who has the better instincts?", color: "hsl(280 60% 60%)" },
  { id: "memory", emoji: "🧩", title: "Memory Match", desc: "Flip cards and find matching pairs. Train your memory!", color: "hsl(20 80% 60%)" },
  { id: "numberguess", emoji: "🔢", title: "Number Guessing", desc: "Guess the secret number 1–100. Higher or lower?", color: "hsl(150 60% 45%)" },
];


const PHONE_VALID: Record<string, string> = {
  "919944293646": "Prathish",
  "919940739865": "Sradhaa",
  "91994039865": "Sradhaa",
};

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: "linear-gradient(135deg, hsl(345 80% 96% / 0.7), hsl(280 50% 97% / 0.5))",
        backdropFilter: "blur(20px)",
        border: "1px solid hsl(345 70% 80% / 0.3)",
        boxShadow: "0 8px 40px hsl(345 70% 70% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.5)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FloatingHeart({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: size }}
      animate={{ y: [0, -25, 0], opacity: [0, 0.4, 0] }}
      transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      ❤️
    </motion.div>
  );
}

const HEARTS = Array.from({ length: 10 }, (_, i) => ({ x: 5 + i * 10, y: 20 + (i % 4) * 18, size: 10 + (i % 3) * 4, delay: i * 0.5, id: i }));

function LoginForm({ onLogin }: { onLogin: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const clean = phone.replace(/\s+/g, "").replace(/^\+/, "");
    if (!PHONE_VALID[clean]) { setError("Number not recognised. Use your registered number."); return; }
    onLogin(clean);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "hsl(var(--background))" }}>
      <GlassCard className="w-full max-w-sm rounded-3xl p-8 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <h1 className="font-serif text-2xl mb-1">Our Game Room</h1>
        <p className="text-muted-foreground text-sm mb-8">Enter your phone number to play</p>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="e.g. 919944293646"
          className="w-full px-4 py-3 rounded-2xl text-center border outline-none focus:ring-2 focus:ring-primary/30 mb-3"
          style={{ background: "hsl(var(--card))", border: "1.5px solid hsl(var(--primary)/0.2)" }}
        />
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <button onClick={handleSubmit} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-medium">Enter Game Room</button>
        <a href={`${BASE}/`} className="block mt-4 text-xs text-muted-foreground/50 hover:text-muted-foreground">← Back to home</a>
      </GlassCard>
    </div>
  );
}

function Lobby({ selectedGame, onCreate, onJoin, onBack, connected, error }: {
  selectedGame: (typeof NATIVE_GAMES)[0];
  onCreate: () => void;
  onJoin: (id: string) => void;
  onBack: () => void;
  connected: boolean;
  error: string | null;
}) {
  const [joinId, setJoinId] = useState("");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
      <div className="text-5xl">{selectedGame.emoji}</div>
      <div className="text-center">
        <h2 className="font-serif text-2xl">{selectedGame.title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{selectedGame.desc}</p>
      </div>

      {!connected && (
        <div className="text-xs text-amber-500 text-center px-4 py-2 rounded-xl" style={{ background: "hsl(45 80% 96%)", border: "1px solid hsl(45 70% 80%/0.4)" }}>
          Connecting to server…
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 text-center px-4 py-2 rounded-xl" style={{ background: "hsl(0 80% 96%)", border: "1px solid hsl(0 70% 80%/0.4)" }}>
          {error}
        </div>
      )}

      <GlassCard className="w-full rounded-3xl p-6 space-y-4">
        <button
          onClick={onCreate}
          disabled={!connected}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-50"
        >
          🎮 Create Private Room
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-primary/10" />
          <span className="text-xs text-muted-foreground">or join</span>
          <div className="flex-1 h-px bg-primary/10" />
        </div>

        <div className="flex gap-2">
          <input
            value={joinId}
            onChange={(e) => setJoinId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && joinId && onJoin(joinId)}
            placeholder="Room code"
            maxLength={6}
            className="flex-1 px-4 py-3 rounded-2xl text-center tracking-widest uppercase border outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            style={{ background: "hsl(var(--card))", border: "1.5px solid hsl(var(--primary)/0.2)" }}
          />
          <button
            onClick={() => joinId && onJoin(joinId)}
            disabled={!connected || !joinId}
            className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            Join
          </button>
        </div>
      </GlassCard>

      <button onClick={onBack} className="text-xs text-muted-foreground/50 hover:text-muted-foreground">← Back to games</button>
    </motion.div>
  );
}

function WaitingRoom({ roomId, onLeave }: { roomId: string; onLeave: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center">
      <motion.div className="text-5xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>💕</motion.div>
      <div>
        <h2 className="font-serif text-2xl mb-1">Waiting for your partner…</h2>
        <p className="text-muted-foreground text-sm">Share this room code:</p>
        <motion.p
          className="font-serif text-5xl text-primary tracking-[0.2em] mt-3"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {roomId}
        </motion.p>
      </div>
      <button onClick={onLeave} className="text-xs text-muted-foreground/50 hover:text-muted-foreground">← Cancel</button>
    </motion.div>
  );
}

export default function Games() {
  const [phone, setPhone] = useState<string | null>(() => {
    const saved = localStorage.getItem("chat_user");
    if (saved) {
      const user = JSON.parse(saved) as { phone: string };
      return user.phone;
    }
    const rawPhone = localStorage.getItem("game_phone");
    return rawPhone;
  });

  const [selectedGame, setSelectedGame] = useState<(typeof NATIVE_GAMES)[0] | null>(null);
  const [view, setView] = useState<"hub" | "lobby" | "waiting" | "playing">("hub");

  const { connected, room, error, createRoom, joinRoom, makeMove, restart, leaveRoom, getName } = useGameSocket(phone);

  function handleLogin(p: string) {
    localStorage.setItem("game_phone", p);
    setPhone(p);
  }

  function handleSelectGame(game: (typeof NATIVE_GAMES)[0]) {
    setSelectedGame(game);
    setView("lobby");
  }

  function handleCreate() {
    if (!selectedGame) return;
    createRoom(selectedGame.id);
    setView("waiting");
  }

  function handleJoin(id: string) {
    joinRoom(id);
  }

  function handleLeave() {
    leaveRoom();
    setView("hub");
    setSelectedGame(null);
  }

  // When room becomes active with 2 players, transition to playing
  if (room && room.players.length === 2 && room.state.status !== "waiting" && view !== "playing") {
    setView("playing");
  }

  if (!phone) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, hsl(345 80% 90% / 0.3), transparent 70%)" }} className="absolute inset-0" />
      </div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {HEARTS.map(h => <FloatingHeart key={h.id} {...h} />)}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs text-primary/60 tracking-widest uppercase mb-1">Just for us</p>
            <h1 className="font-serif text-3xl md:text-4xl">Our Game Room 🎮</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-amber-400"}`} />
            <span className="text-xs text-muted-foreground">{getName(phone)}</span>
            <a href={`${BASE}/`} className="text-xs text-muted-foreground/50 hover:text-muted-foreground ml-2">← Home</a>
          </div>
        </div>

        {/* Views */}
        <AnimatePresence mode="wait">
          {view === "hub" && (
            <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Native multiplayer games */}
              <h2 className="font-serif text-2xl mb-2">Play Together — Live</h2>
              <p className="text-muted-foreground text-sm mb-8">Real-time multiplayer, just the two of us.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
                {NATIVE_GAMES.map((game, i) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="cursor-pointer"
                    onClick={() => handleSelectGame(game)}
                  >
                    <GlassCard className="rounded-3xl p-6 h-full relative overflow-hidden">
                      <motion.div
                        className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${game.color}20`, color: game.color, border: `1px solid ${game.color}40` }}
                      >
                        Live
                      </motion.div>
                      <div className="text-4xl mb-3">{game.emoji}</div>
                      <h3 className="font-serif text-lg mb-1">{game.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{game.desc}</p>
                      <div className="mt-4 text-xs font-medium" style={{ color: game.color }}>Play now →</div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}

          {view === "lobby" && selectedGame && (
            <motion.div key="lobby" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <Lobby
                selectedGame={selectedGame}
                onCreate={handleCreate}
                onJoin={handleJoin}
                onBack={() => { setView("hub"); setSelectedGame(null); }}
                connected={connected}
                error={error}
              />
            </motion.div>
          )}

          {view === "waiting" && room && (
            <motion.div key="waiting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <WaitingRoom roomId={room.id} onLeave={handleLeave} />
            </motion.div>
          )}

          {view === "playing" && room && phone && (
            <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6 text-center">
                <p className="text-xs text-primary/60 tracking-widest uppercase mb-1">Room {room.id}</p>
                <h2 className="font-serif text-2xl">{NATIVE_GAMES.find(g => g.id === room.gameType)?.title}</h2>
              </div>

              {room.gameType === "tictactoe" && (
                <TicTacToe room={room} myPhone={phone} getName={getName} onMove={makeMove} onRestart={restart} onLeave={handleLeave} />
              )}
              {room.gameType === "connectfour" && (
                <ConnectFour room={room} myPhone={phone} getName={getName} onMove={makeMove} onRestart={restart} onLeave={handleLeave} />
              )}
              {room.gameType === "rps" && (
                <RockPaperScissors room={room} myPhone={phone} getName={getName} onMove={makeMove} onRestart={restart} onLeave={handleLeave} />
              )}
              {room.gameType === "memory" && (
                <MemoryMatch room={room} myPhone={phone} getName={getName} onMove={makeMove} onRestart={restart} onLeave={handleLeave} />
              )}
              {room.gameType === "numberguess" && (
                <NumberGuess room={room} myPhone={phone} getName={getName} onMove={makeMove} onRestart={restart} onLeave={handleLeave} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
