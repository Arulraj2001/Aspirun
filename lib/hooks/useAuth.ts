'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

export type UserRole = 'student' | 'admin' | 'moderator' | 'content_creator';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const isSupabaseConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Simulation fallback: read from localStorage
      const savedRole = localStorage.getItem('simulated_role');
      if (savedRole && savedRole !== 'guest') {
        const savedProfile = localStorage.getItem('simulated_profile');
        const profile = savedProfile ? JSON.parse(savedProfile) : {};
        setUser({
          id: 'sim-user',
          email: profile.email || 'aspirant@aspirav.in',
          role: (savedRole as UserRole) || 'student',
          username: profile.username || 'aspirant_user',
          fullName: profile.fullName || 'Aspirant',
          avatarUrl: profile.avatarUrl || null,
        });
      }
      setIsLoading(false);
      return;
    }

    // Real Supabase auth
    const loadSession = async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        await applySession(s);
      } catch {
        setIsLoading(false);
      }
    };

    const applySession = async (s: Session | null) => {
      setSession(s);
      if (!s) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, username, full_name, avatar_url')
          .eq('id', s.user.id)
          .single();

        setUser({
          id: s.user.id,
          email: s.user.email || '',
          role: (profile?.role as UserRole) || 'student',
          username: profile?.username || null,
          fullName: profile?.full_name || null,
          avatarUrl: profile?.avatar_url || null,
        });
      } catch {
        // Profile fetch failed — still mark as logged in with basic info
        setUser({
          id: s.user.id,
          email: s.user.email || '',
          role: 'student',
          username: null,
          fullName: null,
          avatarUrl: null,
        });
      }
      setIsLoading(false);
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      applySession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    isLoading,
    isLoggedIn: !!user,
  };
}
