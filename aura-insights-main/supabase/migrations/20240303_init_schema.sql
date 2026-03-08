-- SENTINEX INITIAL DATABASE SCHEMA
-- Purpose: Privacy-first emotional intelligence tracking
-- Built for: PostgreSQL (Supabase)

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('individual', 'org_admin', 'super_admin');
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- 2. TABLES

-- Profiles: Links to auth.users but adds roles and org associations
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    role user_role DEFAULT 'individual' NOT NULL,
    org_id UUID,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Mood Logs: The core data input
-- Note: encrypted_text should be handled via pgsodium or app-level encryption (AES-256)
CREATE TABLE public.mood_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10) NOT NULL,
    emotion_type TEXT NOT NULL,
    encrypted_text TEXT, -- Encrypted AES-256 string
    sentiment_score FLOAT, -- Derived by AI service
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Risk Scores: Derived emotional intelligence metrics
CREATE TABLE public.risk_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    stress_index FLOAT DEFAULT 0 NOT NULL,
    volatility FLOAT DEFAULT 0 NOT NULL,
    burnout_probability FLOAT DEFAULT 0 NOT NULL,
    risk_status risk_level DEFAULT 'LOW' NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Org Analytics: Aggregated, non-identifiable data for admins
CREATE TABLE public.org_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL,
    avg_stress FLOAT NOT NULL,
    volatility_index FLOAT NOT NULL,
    burnout_rate FLOAT NOT NULL,
    data_points_count INTEGER NOT NULL, -- k-anonymity enforcement
    week_start DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(org_id, week_start)
);

-- 3. ROW LEVEL SECURITY (RLS) policies

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Mood Logs Policies
CREATE POLICY "Individuals can view their own mood logs" ON public.mood_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Individuals can insert their own mood logs" ON public.mood_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Risk Scores Policies
CREATE POLICY "Individuals can view their own risk scores" ON public.risk_scores
    FOR SELECT USING (auth.uid() = user_id);

-- Org Analytics Policies (Aggregated Only)
CREATE POLICY "Org Admins can view their own org analytics" ON public.org_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'org_admin' 
            AND org_id = public.org_analytics.org_id
        )
    );

-- 4. FUNCTIONS & TRIGGERS

-- Function to handle new user creation in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'full_name', 
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'individual'::user_role)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
