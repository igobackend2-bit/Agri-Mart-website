import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://elkylzsyrktltvrftjgt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsa3lsenN5cmt0bHR2cmZ0amd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDIxNzksImV4cCI6MjA5NzA3ODE3OX0.BjAxdCnOSmVBfSRJ1c9wZFQZVDq2FQYUFXu2ApVRieQ';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
