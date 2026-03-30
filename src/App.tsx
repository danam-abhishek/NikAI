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
      console.log('[NikAI] App: Checking launch status...');
      console.log('[NikAI] App: Supabase configured:', isSupabaseConfigured);

      // PRIMARY SOURCE: Always check Supabase first
      if (isSupabaseConfigured) {
        try {
          console.log('[NikAI] App: Fetching from Supabase...');
          const { data, error } = await supabase
            .from('launch_status')
            .select('launched')
            .eq('id', 1)
            .single();

          console.log('[NikAI] App: Supabase response:', { data, error: error?.message });

          if (data && !error && data.launched === true) {
            console.log('[NikAI] App: launched=true in database → skipping lock screen');
            localStorage.setItem(STORAGE_KEY, 'true');
            setIsUnlocked(true);
            setChecking(false);
            return;
          }

          if (data && !error && data.launched === false) {
            console.log('[NikAI] App: launched=false in database → showing lock screen');
            localStorage.removeItem(STORAGE_KEY);
            setIsUnlocked(false);
            setChecking(false);
            return;
          }
        } catch (err) {
          console.error('[NikAI] App: Supabase fetch failed:', err);
        }
      }

      // FALLBACK ONLY: Use localStorage if Supabase is unavailable
      console.log('[NikAI] App: Falling back to localStorage');
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        setIsUnlocked(true);
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
