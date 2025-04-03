import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://anwavqhppnwbgtyfcfcd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud2F2cWhwcG53Ymd0eWZjZmNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1ODc2OTcsImV4cCI6MjA1OTE2MzY5N30.wx_KWoBfBwFkODDByGvCfm5TijUxnvgVh3Vttb8dOhI';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export a default instance for convenience
export default supabase;
