import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "/api";

interface Message {
  id: number;
  sender_phone: string;
  content: string | null;
  image_data: string | null;
  message_type: string;
  read_at: string | null;
  created_at: string;
}

interface User {
  phone: string;
  name: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "long" });
}

function groupByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = "";
  for (const msg of messages) {
    const d = formatDate(msg.created_at);
    if (d !== currentDate) {
      currentDate = d;
      groups.push({ date: d, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }
  return groups;
}

export default function Chat() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("chat_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loginPhone, setLoginPhone] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherName, setOtherName] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch messages history
  const fetchMessages = useCallback(async (phone: string) => {
    try {
      const res = await fetch(`${API_BASE}/chat/messages?phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {}
  }, []);

  // Connect WebSocket
  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://${window.location.host}/api/ws?phone=${user.phone}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      fetchMessages(user.phone);
    };

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === "message") {
          setMessages((prev) => {
            if (prev.find((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
          // Mark as read if from other
          if (data.message.sender_phone !== user.phone) {
            ws.send(JSON.stringify({ type: "read" }));
          }
        } else if (data.type === "presence") {
          if (data.phone !== user.phone) {
            setOtherOnline(data.online);
            setOtherName(data.name);
          }
        } else if (data.type === "typing") {
          if (data.phone !== user.phone) {
            setOtherTyping(data.isTyping);
            setOtherName(data.name);
          }
        }
      } catch {}
    };

    ws.onclose = () => {};

    return () => {
      ws.close();
    };
  }, [user, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherTyping, scrollToBottom]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/chat/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error ?? "Login failed");
      } else {
        setUser(data);
        localStorage.setItem("chat_user", JSON.stringify(data));
      }
    } catch {
      setLoginError("Could not connect. Try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "message", content: text, messageType: "text" }));
      } else {
        const res = await fetch(`${API_BASE}/chat/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: user.phone, content: text, messageType: "text" }),
        });
        if (res.ok) {
          const msg = await res.json();
          setMessages((prev) => [...prev, msg]);
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleImageSend = async (file: File) => {
    if (!user) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "message", imageData: base64, messageType: "image" }));
      } else {
        const res = await fetch(`${API_BASE}/chat/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: user.phone, imageData: base64, messageType: "image" }),
        });
        if (res.ok) {
          const msg = await res.json();
          setMessages((prev) => [...prev, msg]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTyping = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "typing" }));
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      wsRef.current?.send(JSON.stringify({ type: "stop_typing" }));
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem("chat_user");
    setUser(null);
    setMessages([]);
    wsRef.current?.close();
  };

  // ── LOGIN SCREEN ──
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "hsl(35 60% 97%)" }}
      >
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-10">
            <motion.div
              className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"
              animate={{ boxShadow: ["0 0 0px rgba(244,63,94,0.2)", "0 0 24px rgba(244,63,94,0.35)", "0 0 0px rgba(244,63,94,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(345 70% 45%)" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </motion.div>
            <h1 className="font-serif text-3xl text-foreground mb-1">Heart Space 💕</h1>
            <p className="text-sm text-muted-foreground">Private chat for two — enter your number to begin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 tracking-widest uppercase">Your Mobile Number</label>
              <input
                type="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e as unknown as React.FormEvent)}
                placeholder="e.g. 919944293646"
                className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm text-center tracking-wider"
                data-testid="input-phone"
                autoFocus
                required
              />
            </div>

            {loginError && (
              <motion.p
                className="text-sm text-red-400 text-center"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {loginError}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm tracking-wide disabled:opacity-60"
              data-testid="button-login"
            >
              {loginLoading ? "Entering…" : "Enter Our Space ❤️"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const dateGroups = groupByDate(messages);

  // ── CHAT SCREEN ──
  return (
    <div className="flex flex-col h-screen" style={{ background: "hsl(35 60% 97%)" }}>

      {/* Header */}
      <div className="border-b border-primary/10 bg-card/80 backdrop-blur sticky top-0 z-20 shadow-sm">
        {/* Welcome bar */}
        <div className="px-4 pt-2.5 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary/70 font-medium">Welcome,</span>
            <span className="text-xs font-semibold text-primary">{user.name}</span>
            <span className="text-xs text-muted-foreground/50">·</span>
            <span className="text-xs text-muted-foreground/60 font-mono">+{user.phone}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            data-testid="button-logout"
          >
            Leave
          </button>
        </div>
        {/* Chat partner row */}
        <div className="px-4 pb-2.5 flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="font-serif text-primary text-sm">
                {user.name === "Prathish" ? "S" : "P"}
              </span>
            </div>
            {otherOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-background" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm text-foreground leading-tight">
              {user.name === "Prathish" ? "Sradhaa" : "Prathish"}
            </p>
            <p className="text-xs text-muted-foreground">
              {otherOnline ? "online" : otherName ? "last seen recently" : "offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(345 70% 45% / 0.5)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="font-serif text-lg text-muted-foreground">Say hello, {user.name === "Prathish" ? "to Sradhaa" : "to Prathish"}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Your messages are private and secure.</p>
          </div>
        )}

        {dateGroups.map((group) => (
          <div key={group.date}>
            <div className="flex justify-center my-3">
              <span className="text-xs text-muted-foreground bg-primary/5 px-3 py-1 rounded-full">{group.date}</span>
            </div>
            {group.messages.map((msg, idx) => {
              const isMine = msg.sender_phone === user.phone;
              const showTail = idx === group.messages.length - 1 || group.messages[idx + 1]?.sender_phone !== msg.sender_phone;
              return (
                <motion.div
                  key={msg.id}
                  className={`flex mb-1 ${isMine ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  data-testid={`message-bubble-${msg.id}`}
                >
                  <div
                    className={`max-w-[72%] ${isMine
                      ? "bg-primary text-primary-foreground rounded-t-2xl rounded-bl-2xl" + (showTail ? " rounded-br-sm" : " rounded-br-2xl")
                      : "bg-card border border-primary/10 text-foreground rounded-t-2xl rounded-br-2xl" + (showTail ? " rounded-bl-sm" : " rounded-bl-2xl")
                    } px-4 py-2.5 shadow-sm`}
                  >
                    {msg.message_type === "image" && msg.image_data ? (
                      <img
                        src={msg.image_data}
                        alt="Snap"
                        className="max-w-full rounded-xl max-h-64 object-cover"
                      />
                    ) : (
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                    )}
                    <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className={`text-[10px] ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {formatTime(msg.created_at)}
                      </span>
                      {isMine && (
                        <svg width="14" height="10" viewBox="0 0 16 11" fill="none">
                          {msg.read_at ? (
                            <>
                              <path d="M1 5.5L5 9.5L15 1.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M4 5.5L8 9.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </>
                          ) : (
                            <path d="M1 5.5L5 9.5L15 1.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          )}
                        </svg>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {otherTyping && (
            <motion.div
              className="flex justify-start mb-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <div className="bg-card border border-primary/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary/40"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-3 py-3 border-t border-primary/10 bg-card/80 backdrop-blur">
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 hover:bg-primary/20 transition-colors"
            data-testid="button-attach"
            title="Send a snap"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageSend(file);
              e.target.value = "";
            }}
          />
          <div className="flex-1 bg-background border border-primary/20 rounded-2xl px-4 py-2.5 flex items-end">
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); handleTyping(); }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Say something..."
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-32 leading-relaxed"
              data-testid="input-message"
              style={{ overflow: "auto" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
            data-testid="button-send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
