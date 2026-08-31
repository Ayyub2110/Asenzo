-- =====================================================================
-- ASENZO Growth Operating System - Complete Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://database.supabase.com)
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. FOUNDATION TABLE (Stores Core DNA, ICP, Positioning & Contexts)
CREATE TABLE IF NOT EXISTS public.foundation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    core_dna JSONB DEFAULT '{}'::jsonb,
    icp JSONB DEFAULT '{}'::jsonb,
    offer JSONB DEFAULT '{}'::jsonb,
    brand_voice JSONB DEFAULT '{}'::jsonb,
    founder_voice JSONB DEFAULT '{}'::jsonb,
    readiness JSONB DEFAULT '{}'::jsonb,
    business_context JSONB DEFAULT '{}'::jsonb,
    customer_context JSONB DEFAULT '{}'::jsonb,
    positioning_context JSONB DEFAULT '{}'::jsonb,
    offer_context JSONB DEFAULT '{}'::jsonb,
    brand_context JSONB DEFAULT '{}'::jsonb,
    knowledge JSONB DEFAULT '[]'::jsonb,
    proof_settings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ATTENTION IDEAS TABLE (Content Engine & Post Backlog)
CREATE TABLE IF NOT EXISTS public.attention_ideas (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT,
    platform TEXT DEFAULT 'LinkedIn',
    stage TEXT DEFAULT 'IDEATION',
    hook TEXT,
    body TEXT,
    cta TEXT,
    performance JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CONVERSION OPPORTUNITIES TABLE (CRM Pipeline & Sales Qualification)
CREATE TABLE IF NOT EXISTS public.conversion_opportunities (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    company TEXT,
    value NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'LEAD',
    stage TEXT DEFAULT 'QUALIFICATION',
    qualification JSONB DEFAULT '{}'::jsonb,
    sales_call JSONB DEFAULT '{}'::jsonb,
    proposal JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. DELIVERY ENGAGEMENTS TABLE (Client Success & Milestones)
CREATE TABLE IF NOT EXISTS public.delivery_engagements (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    status TEXT DEFAULT 'ONBOARDING',
    health_score NUMERIC DEFAULT 100,
    start_date TEXT,
    renewal_date TEXT,
    milestones JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CALENDAR EVENTS TABLE (Schedule & Time Allocation)
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    category TEXT DEFAULT 'OPERATIONS',
    priority TEXT DEFAULT 'MEDIUM',
    status TEXT DEFAULT 'SCHEDULED',
    deep_work BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SYSTEM SETTINGS TABLE (User Preferences & OS Configuration)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile JSONB DEFAULT '{}'::jsonb,
    notifications JSONB DEFAULT '{}'::jsonb,
    system JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS for all tables and grant full access to authenticated users / anon
-- =====================================================================

ALTER TABLE public.foundation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attention_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (public) or authenticated users
CREATE POLICY "Allow public read foundation" ON public.foundation FOR SELECT USING (true);
CREATE POLICY "Allow public insert foundation" ON public.foundation FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update foundation" ON public.foundation FOR UPDATE USING (true);

CREATE POLICY "Allow public read attention" ON public.attention_ideas FOR SELECT USING (true);
CREATE POLICY "Allow public insert attention" ON public.attention_ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update attention" ON public.attention_ideas FOR UPDATE USING (true);

CREATE POLICY "Allow public read conversion" ON public.conversion_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public insert conversion" ON public.conversion_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update conversion" ON public.conversion_opportunities FOR UPDATE USING (true);

CREATE POLICY "Allow public read delivery" ON public.delivery_engagements FOR SELECT USING (true);
CREATE POLICY "Allow public insert delivery" ON public.delivery_engagements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update delivery" ON public.delivery_engagements FOR UPDATE USING (true);

CREATE POLICY "Allow public read calendar" ON public.calendar_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert calendar" ON public.calendar_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update calendar" ON public.calendar_events FOR UPDATE USING (true);

CREATE POLICY "Allow public read settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert settings" ON public.system_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update settings" ON public.system_settings FOR UPDATE USING (true);
