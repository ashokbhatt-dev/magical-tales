// lib/db/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ✅ Singleton instances - only create once
let clientInstance: SupabaseClient | null = null
let adminInstance: SupabaseClient | null = null

// Client-side Supabase client (uses anon key)
export const getSupabaseClient = () => {
  // ✅ Return cached instance if exists
  if (clientInstance) {
    return clientInstance
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase client environment variables')
  }

  // ✅ Create and cache
  clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// Server-side Supabase client (uses service role key - bypasses RLS)
export const getSupabaseAdmin = () => {
  // ✅ Return cached instance if exists
  if (adminInstance) {
    return adminInstance
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin environment variables')
  }

  // ✅ Create and cache
  adminInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return adminInstance
}