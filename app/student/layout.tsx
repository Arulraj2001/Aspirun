'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { LoadingState } from '@/components/ui/LoadingState';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Try real Supabase auth if keys are configured
      const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                           !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
      
      if (isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            // Check if there is an active local storage auth token that is currently synchronizing/recovering
            let hasToken = false;
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key?.startsWith('sb-') && key.endsWith('-auth-token')) {
                hasToken = true;
                break;
              }
            }

            if (hasToken) {
              // Wait 1.5s to let Supabase client complete clock-skew resolution or background refresh
              await new Promise((resolve) => setTimeout(resolve, 1500));
              const { data: { session: retriedSession } } = await supabase.auth.getSession();
              if (retriedSession) {
                setAuthorized(true);
                setLoading(false);
                return;
              }
            }

            alert('Please login to continue.');
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
          }
          
          // Get profile role
          const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

          if (profile?.role === 'admin') {
            // Admin is allowed to access student views for testing
            setAuthorized(true);
            return;
          }

          setAuthorized(true);
        } catch (err) {
          console.error('Supabase auth check failed, falling back:', err);
          checkSimulatedAuth();
        }
      } else {
        // 2. Offline Simulation Fallback
        checkSimulatedAuth();
      }
      
      setLoading(false);
    };

    const checkSimulatedAuth = () => {
      const role = localStorage.getItem('simulated_role') || 'guest';
      if (role === 'guest') {
        alert('Please login to continue.');
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      } else {
        // Both student and admin are authorized
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <LoadingState message="Verifying student credentials..." />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
