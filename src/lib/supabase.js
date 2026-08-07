import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Check your .env.local file.'
  )
}

// Fallback to a valid-looking URL to prevent the entire React app from crashing on load
const url = supabaseUrl || 'https://missing-project.supabase.co'
const key = supabaseAnonKey || 'missing-key'

export const supabase = createClient(url, key)
