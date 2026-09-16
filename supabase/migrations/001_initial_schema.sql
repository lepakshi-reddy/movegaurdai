-- MoveGuard AI — Database Schema Migration (Supabase / PostgreSQL)
-- Created for Hackathon HealthTech Production Deployment

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  height NUMERIC,
  fitness_level TEXT DEFAULT 'intermediate' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'te', 'hi')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workout Sessions Table
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('squat', 'pushup', 'situp', 'lunge')),
  repetitions INTEGER NOT NULL DEFAULT 0,
  form_score NUMERIC NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  feedback_summary JSONB DEFAULT '[]'::jsonb,
  is_demo BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Rep Events Table
CREATE TABLE IF NOT EXISTS public.rep_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  rep_number INTEGER NOT NULL,
  form_score NUMERIC NOT NULL DEFAULT 0,
  feedback TEXT NOT NULL DEFAULT '',
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Posture Sessions Table
CREATE TABLE IF NOT EXISTS public.posture_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  overall_score NUMERIC NOT NULL DEFAULT 0,
  neck_score NUMERIC NOT NULL DEFAULT 0,
  shoulder_score NUMERIC NOT NULL DEFAULT 0,
  back_score NUMERIC NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  detected_issues JSONB DEFAULT '[]'::jsonb,
  feedback_summary JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Daily Activity Table
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  movement_score NUMERIC NOT NULL DEFAULT 0,
  total_reps INTEGER NOT NULL DEFAULT 0,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  active_minutes INTEGER NOT NULL DEFAULT 0,
  posture_checks INTEGER NOT NULL DEFAULT 0,
  movement_breaks INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

-- 6. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_created_at ON public.workout_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rep_events_session_id ON public.rep_events(session_id);
CREATE INDEX IF NOT EXISTS idx_posture_sessions_user_id ON public.posture_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rep_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posture_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Workout Sessions Policies
CREATE POLICY "Users can view their own workout sessions"
  ON public.workout_sessions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own workout sessions"
  ON public.workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Rep Events Policies
CREATE POLICY "Users can view their own rep events"
  ON public.rep_events FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own rep events"
  ON public.rep_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Posture Sessions Policies
CREATE POLICY "Users can view their own posture sessions"
  ON public.posture_sessions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert their own posture sessions"
  ON public.posture_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Daily Activity Policies
CREATE POLICY "Users can view their own daily activity"
  ON public.daily_activity FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can modify their own daily activity"
  ON public.daily_activity FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- Chat Messages Policies
CREATE POLICY "Users can view their own chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);
