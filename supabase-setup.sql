-- =============================================================
-- NikAI Launch Status — Supabase Table Setup
-- Run this in Supabase SQL Editor (supabase.com → project → SQL Editor)
-- =============================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.launch_status (
  id         INT PRIMARY KEY DEFAULT 1,
  lock1      BOOLEAN NOT NULL DEFAULT false,
  lock2      BOOLEAN NOT NULL DEFAULT false,
  lock3      BOOLEAN NOT NULL DEFAULT false,
  launched   BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 2. Insert the initial row
INSERT INTO public.launch_status (id, lock1, lock2, lock3, launched)
VALUES (1, false, false, false, false)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security
ALTER TABLE public.launch_status ENABLE ROW LEVEL SECURITY;

-- 4. Allow anonymous read access (no auth required)
CREATE POLICY "Anyone can read launch_status"
  ON public.launch_status FOR SELECT
  USING (true);

-- 5. Allow anonymous update access (no auth required)
CREATE POLICY "Anyone can update launch_status"
  ON public.launch_status FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 6. Enable realtime for cross-device sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.launch_status;

-- =============================================================
-- To RESET all locks (run manually if needed):
-- UPDATE public.launch_status SET lock1=false, lock2=false, lock3=false, launched=false WHERE id=1;
-- =============================================================
