import { createClient } from '@supabase/supabase-js'

// .env.local file එකෙන් අපේ keys ගන්නවා
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// Supabase client එක හදනවා
export const supabase = createClient(supabaseUrl, supabaseAnonKey)