import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CompetitionDetails from "./pages/CompetitionDetails";
import MatchDetails from "./pages/MatchDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto pt-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/competition/:id/:seasonId" element={<CompetitionDetails />} />
                <Route path="/match/:competitionId/:seasonId/:id" element={<MatchDetails />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;