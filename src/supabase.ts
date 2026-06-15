// ─────────────────────────────────────────────────────────────────────────────
// Supabase client for IGO Agri Mart.
//
// SECURITY: Only the *anon* (public) key belongs in frontend code. It is safe to
// expose ONLY because Row-Level Security (RLS) policies protect the tables — see
// supabase_schema.sql. NEVER put the service_role key here or anywhere in the
// website/admin client; it bypasses all security.
//
// You can override these via a .env file (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://elkylzsyrktltvrftjgt.supabase.co';

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsa3lsenN5cmt0bHR2cmZ0amd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDIxNzksImV4cCI6MjA5NzA3ODE3OX0.BjAxdCnOSmVBfSRJ1c9wZFQZVDq2FQYUFXu2ApVRieQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// Flag so the rest of the app can detect a misconfigured client.
export const SUPABASE_READY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
