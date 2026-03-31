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
import LaunchUnlock from "./components/LaunchUnlock";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLaunchStatus = async () => {
      console.log('[NikAI] App: Initializing single source of truth (Supabase)...');

      if (!isSupabaseConfigured) {
        console.error('[NikAI] App: Supabase is not configured. Site remained locked.');
        setChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('launch_status')
          .select('launched')
          .eq('id', 1)
          .single();

        if (error) {
          console.error('[NikAI] App: Supabase fetch error:', error.message);
          setIsUnlocked(false);
        } else if (data) {
          console.log('[NikAI] App: Database launch status:', data.launched);
          setIsUnlocked(data.launched);
        }
      } catch (err) {
        console.error('[NikAI] App: Supabase fetch exception:', err);
        setIsUnlocked(false);
      } finally {
        setChecking(false);
      }
    };

    checkLaunchStatus();
  }, []);

  if (checking) return null;

  if (!isUnlocked) {
    return <LaunchUnlock onUnlocked={() => setIsUnlocked(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CursorGlow />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
