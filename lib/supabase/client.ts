import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Verify if the credentials are valid and not placeholders
const isConfigured = !!supabaseUrl && 
                     !!supabaseAnonKey && 
                     !supabaseUrl.includes('your-project-id') &&
                     supabaseUrl !== 'https://your-project-id.supabase.co';

// Resilient fallback client to bypass pre-rendering module crashes
const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
    signInWithPassword: async () => ({ data: { session: null }, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: async () => ({ data: null, error: null })
    })
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    })
  }
} as unknown as SupabaseClient;

if (!isConfigured) {
  console.warn(
    'Supabase credentials are not configured or are placeholders. Running in client-side offline mock mode.'
  );
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : mockSupabase;
