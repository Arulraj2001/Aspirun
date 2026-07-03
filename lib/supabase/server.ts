import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// Verify if the credentials are valid and not placeholders
const isConfigured = !!supabaseUrl && 
                     !!supabaseAnonKey && 
                     !supabaseUrl.includes('your-project-id') &&
                     supabaseUrl !== 'https://your-project-id.supabase.co';

const isServiceConfigured = isConfigured && 
                            !!supabaseServiceKey && 
                            !supabaseServiceKey.includes('your-service-role');

// Resilient fallback client to bypass pre-rendering module crashes
const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    })
  })
} as unknown as SupabaseClient;

// Standard server client (applies Row Level Security)
export const supabaseServer = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : mockSupabase;

// Admin server client (bypasses Row Level Security)
// WARNING: NEVER import or execute this client on the client-side of the application.
export const supabaseAdmin = isServiceConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : mockSupabase;
