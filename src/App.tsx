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

const STORAGE_KEY = 'nikai_launch_unlocked';

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLaunchStatus = async () => {
      console.log('[NikAI] App: Fetching launch status...');

      // 1. Try Supabase first (Database is the source of truth)
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('launch_status')
            .select('launched')
            .eq('id', 1)
            .single();

          if (data && !error) {
            console.log('[NikAI] App: Database launch status:', data.launched);
            if (data.launched) {
              localStorage.setItem(STORAGE_KEY, 'true');
              setIsUnlocked(true);
              setChecking(false);
              return;
            }
          } else {
            console.warn('[NikAI] App: Supabase fetch error or no data:', error?.message);
          }
        } catch (err) {
          console.error('[NikAI] App: Supabase fetch exception:', err);
        }
      }

      // 2. Fallback to localStorage for speed if Supabase fails or is unconfigured
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        console.log('[NikAI] App: Using localStorage fallback (unlocked)');
        setIsUnlocked(true);
      } else {
        console.log('[NikAI] App: System remains locked');
      }

      setChecking(false);
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
