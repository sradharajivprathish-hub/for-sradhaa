import { motion, AnimatePresence } from "framer-motion";
import { useVoiceChat } from "@/hooks/useVoiceChat";

interface Props {
  phone: string | null;
}

const NAMES: Record<string, string> = {
  "919944293646": "Prathish",
  "919940739865": "Sradhaa",
  "91994039865": "Sradhaa",
};

export function VoiceChat({ phone }: Props) {
  const { status, muted, otherSpeaking, wsReady, startCall, hangup, toggleMute } = useVoiceChat(phone);

  if (!phone) return null;

  const myName = NAMES[phone] ?? "You";

  return (
    <div className="fixed bottom-16 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {(status === "calling" || status === "connected") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl px-4 py-3 flex flex-col gap-2.5 min-w-[200px]"
            style={{
              background: "linear-gradient(135deg, hsl(345 80% 96% / 0.95), hsl(280 50% 97% / 0.9))",
              backdropFilter: "blur(20px)",
              border: "1px solid hsl(345 70% 80% / 0.35)",
              boxShadow: "0 8px 32px hsl(345 70% 60% / 0.18)",
            }}
          >
            {/* Status row */}
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: status === "connected" ? "hsl(142 70% 45%)" : "hsl(45 90% 50%)" }}
                animate={status === "calling" ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-foreground">
                {status === "calling" ? "Calling… 📞" : "Voice Connected 🎙️"}
              </span>
            </div>

            {/* Other speaking indicator */}
            {status === "connected" && (
              <div className="flex items-center gap-1.5">
                <AnimatePresence>
                  {otherSpeaking ? (
                    <motion.div key="speaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-0.5 items-end h-4">
                      {[1, 1.5, 2, 1.5, 1].map((h, i) => (
                        <motion.div key={i} className="w-0.5 rounded-full" style={{ background: "hsl(142 70% 45%)", height: `${h * 6}px` }}
                          animate={{ height: [`${h * 6}px`, `${h * 10}px`, `${h * 6}px`] }}
                          transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }} />
                      ))}
                    </motion.div>
                  ) : (
                    <div key="quiet" className="flex gap-0.5 items-end h-4">
                      {[1, 1, 1, 1, 1].map((_, i) => (
                        <div key={i} className="w-0.5 rounded-full" style={{ background: "hsl(var(--muted-foreground))", height: "3px" }} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
                <span className="text-[10px] text-muted-foreground">
                  {otherSpeaking ? "Speaking…" : "Listening"}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {status === "connected" && (
                <button
                  onClick={toggleMute}
                  className="flex-1 py-1.5 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1"
                  style={{
                    background: muted ? "hsl(0 70% 92%)" : "hsl(var(--muted))",
                    color: muted ? "hsl(0 70% 50%)" : "hsl(var(--muted-foreground))",
                    border: muted ? "1px solid hsl(0 60% 80%/0.4)" : "1px solid transparent",
                  }}
                >
                  {muted ? "🔇 Muted" : "🎙️ Mute"}
                </button>
              )}
              <button
                onClick={() => hangup(true)}
                className="flex-1 py-1.5 rounded-xl text-[11px] font-medium text-white"
                style={{ background: "hsl(0 70% 55%)" }}
              >
                📵 End
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main call button */}
      {status === "idle" && (
        <motion.button
          onClick={startCall}
          disabled={!wsReady}
          title="Start voice call"
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg disabled:opacity-40"
          style={{ background: "hsl(142 60% 45%)", color: "white" }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
        </motion.button>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[10px] text-red-400 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200/40"
        >
          Mic access denied
        </motion.div>
      )}
    </div>
  );
}
