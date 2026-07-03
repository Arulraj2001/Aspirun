'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
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

          const userRole = profile?.role || 'student';
          
          if (userRole === 'admin') {
            setErrorMsg('Admin logins must be performed through the dedicated Admin portal.');
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }

          const params = new URLSearchParams(window.location.search);
          const next = params.get('redirect') || params.get('next');
          router.push(next || '/student/dashboard');
        }
      } catch (err) {
        console.error('Login failed:', err);
        const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
        setErrorMsg(message);
        setLoading(false);
      }
    } else {
      // 2. Local Simulation Fallback
      setTimeout(() => {
        setLoading(false);
        
        if (email.toLowerCase().includes('admin') || email === 'admin@aspirav.in') {
          setErrorMsg('Admin logins must be performed through the dedicated Admin portal.');
          return;
        }

        localStorage.setItem('simulated_role', 'student');
        
        // Ensure a simulated profile exists
        const existingProfile = localStorage.getItem('simulated_profile');
        if (!existingProfile) {
          const mockProfile = {
            fullName: 'Siddharth Mishra',
            username: 'siddharth_99',
            email: email || 'aspirant@aspirav.in',
            phone: '9876543210',
            city: 'New Delhi',
            qualification: 'B.Tech Graduate',
            targetExam: 'exam-ssc',
            avatarUrl: '',
          };
          localStorage.setItem('simulated_profile', JSON.stringify(mockProfile));
        }

        const params = new URLSearchParams(window.location.search);
        const next = params.get('redirect') || params.get('next');
        router.push(next || '/student/dashboard');
      }, 1000);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    
    if (isConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/student/dashboard`,
          }
        });
        if (error) throw error;
      } catch (err) {
        console.error('Google OAuth failed:', err);
        const message = err instanceof Error ? err.message : 'Google authentication failed.';
        setErrorMsg(message);
        setLoading(false);
      }
    } else {
      // Simulation: Google OAuth logs in as student
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('simulated_role', 'student');
        
        // Ensure a simulated profile exists
        const existingProfile = localStorage.getItem('simulated_profile');
        if (!existingProfile) {
          const mockProfile = {
            fullName: 'Siddharth Mishra',
            username: 'siddharth_99',
            email: 'siddharth.google@aspirav.in',
            phone: '9876543210',
            city: 'New Delhi',
            qualification: 'B.Tech Graduate',
            targetExam: 'exam-ssc',
            avatarUrl: '',
          };
          localStorage.setItem('simulated_profile', JSON.stringify(mockProfile));
        }

        const params = new URLSearchParams(window.location.search);
        const next = params.get('redirect') || params.get('next');
        router.push(next || '/student/dashboard');
      }, 1000);
    }
  };

  return (
    <Container size="sm" className="py-12 md:py-20">
      <div className="flex flex-col items-center mb-8">
        <span className="p-3 bg-brand-500 rounded-2xl text-white shadow-md shadow-brand-500/20 mb-4">
          <GraduationCap className="h-8 w-8" />
        </span>
        <h1 className="text-xl md:text-2xl font-black text-surface-900 tracking-tight text-center">
          Sign In to Aspirav
        </h1>
        <p className="text-xs md:text-sm text-surface-500 font-semibold text-center mt-1">
          Access your daily targets, mock tests, and peer doubts board.
        </p>
      </div>

      <Card className="shadow-lg border border-surface-200">
        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white border border-surface-250 hover:bg-surface-50 text-surface-700 text-xs md:text-sm font-black rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-surface-450 font-bold">Or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-danger-50 border border-danger-150 text-danger-700 text-xs font-bold rounded-xl">
              {errorMsg}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aspirant@aspirav.in"
            required
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs md:text-sm font-black text-surface-800">Password</label>
              <Link href="#" className="text-xs font-black text-brand-650 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 bg-white border border-surface-250 rounded-xl text-xs md:text-sm text-surface-850 placeholder:text-surface-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full justify-center mt-6"
            icon={<ArrowRight className="h-4.5 w-4.5" />}
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        <div className="border-t border-surface-150 mt-6 pt-4 text-center flex flex-col gap-3">
          <p className="text-xs md:text-sm font-semibold text-surface-550">
            New to Aspirav?{' '}
            <Link href="/register" className="text-brand-600 font-black hover:underline">
              Register Free Account
            </Link>
          </p>
          <div className="pt-3 border-t border-surface-100">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-black text-brand-650 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Home
            </Link>
          </div>
        </div>
      </Card>
    </Container>
  );
}
