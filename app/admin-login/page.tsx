'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // 1. Try real Supabase auth if keys are configured
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (session) {
          // Fetch user profile role to guide routing
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role !== 'admin') {
            setErrorMsg('Access Denied. You do not have administrator permissions.');
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }

          router.push('/admin/dashboard');
        }
      } catch (err) {
        console.error('Admin login failed:', err);
        const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
        setErrorMsg(message);
        setLoading(false);
      }
    } else {
      // 2. Local Simulation Fallback
      setTimeout(async () => {
        try {
          const encoder = new TextEncoder();
          const data = encoder.encode(password);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

          setLoading(false);
          
          // Match SHA-256 of AdminSecureSetu2026!
          if (email === 'admin@aspirav.in' && hashHex === '649b87a0a26fc54edfdf264e388946c1f7c2ddf0b67def6e9c5682d785bbd710') {
            localStorage.setItem('simulated_role', 'admin');
            router.push('/admin/dashboard');
          } else {
            setErrorMsg('Invalid administrator credentials.');
          }
        } catch (err) {
          setLoading(false);
          setErrorMsg('An error occurred during local verification.');
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm" className="space-y-6">
        
        <div className="flex flex-col items-center text-center">
          <span className="p-3.5 bg-danger-500 rounded-2xl text-white shadow-lg shadow-danger-500/20 mb-4 animate-pulse">
            <ShieldCheck className="h-8 w-8" />
          </span>
          <h1 className="text-xl md:text-2xl font-black text-surface-900 tracking-tight">
            Aspirav Control Panel
          </h1>
          <p className="text-xs md:text-sm text-surface-450 font-bold mt-1">
            Authenticate to access dynamic sitemaps and moderation portals.
          </p>
        </div>

        <Card className="shadow-2xl border border-surface-200 bg-white">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-danger-50 border border-danger-150 text-danger-700 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <Input
              label="Admin ID Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aspirav.in"
              required
            />

            <div>
              <label className="block text-xs md:text-sm font-black text-surface-800 mb-1.5">Secret Passkey</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-white border border-surface-250 rounded-xl text-xs md:text-sm text-surface-850 placeholder:text-surface-400 focus:outline-none focus:border-danger-500 focus:ring-1 focus:ring-danger-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="danger"
              className="w-full justify-center mt-6"
              icon={<ArrowRight className="h-4.5 w-4.5" />}
              iconPosition="right"
            >
              Sign In to Console
            </Button>
          </form>

          <div className="border-t border-surface-150 mt-6 pt-4 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-black text-brand-650 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Aspirant Hub
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
