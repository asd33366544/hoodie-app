import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qlmspxujroqfwnntbxnm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsbXNweHVqcm9xZndubnRieG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MzY3NjYsImV4cCI6MjEwNDExMjc2Nn0.7tGdwIFKR24kV94dkyYfqUEBGZ9pCwd9Wvx6NLSkZXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
