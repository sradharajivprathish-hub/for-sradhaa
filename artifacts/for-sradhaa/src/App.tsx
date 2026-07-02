import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Games from "@/pages/Games";
import NotFound from "@/pages/not-found";
import { VoiceChat } from "@/components/VoiceChat";
import { EntryOverlay } from "@/components/EntryOverlay";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/games" component={Games} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [entered, setEntered] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat_user");
    if (saved) {
      try { setPhone((JSON.parse(saved) as { phone: string }).phone); } catch {}
    }
  }, []);

  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <VoiceChat phone={phone} />
        <AnimatePresence>
          {!entered && (
            <EntryOverlay onEnter={() => setEntered(true)} />
          )}
        </AnimatePresence>
      </WouterRouter>
    </TooltipProvider>
  );
}

export default App;
