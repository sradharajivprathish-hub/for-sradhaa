import { Switch, Route, Router as WouterRouter } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import NotFound from "@/pages/not-found";
import { MusicPlayer } from "@/components/MusicPlayer";

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
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <MusicPlayer />
      </WouterRouter>
    </TooltipProvider>
  );
}

export default App;
