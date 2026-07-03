import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingScreen } from "@/components/LandingScreen";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [entered, setEntered] = useState(false);

  return (
    <TooltipProvider>
      {!entered && <LandingScreen onEnter={() => setEntered(true)} />}
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </TooltipProvider>
  );
}

export default App;
