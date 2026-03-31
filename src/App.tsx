import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CursorGlow from "./components/CursorGlow";
import GlobalBackground from "./components/GlobalBackground";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import LaunchScreen from "./components/LaunchScreen";

const queryClient = new QueryClient();

export default function App() {
  const [isLaunched, setIsLaunched] = useState<boolean | null>(null);

  useEffect(() => {
    const launched = localStorage.getItem("nikai_launched") === "true";
    setIsLaunched(launched);
  }, []);

  // Avoid flash
  if (isLaunched === null) return null;

  if (!isLaunched) {
    return (
      <LaunchScreen onLaunched={() => setIsLaunched(true)} />
    );
  }

  // Full website
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CursorGlow />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH_ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

