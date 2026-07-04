'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Users,
  Award,
} from 'lucide-react';

const BENEFITS = [
  { icon: BookOpen, text: 'Daily study plans for UPSC, SSC, RRB & IBPS' },
  { icon: Award, text: 'Free mock tests with detailed analytics' },
  { icon: Users, text: 'Peer doubt-clearing community with toppers' },
  { icon: CheckCircle2, text: 'Track your streak and progress daily' },
];

const isSupabaseConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

// Inner component uses useSearchParams — must be wrapped in Suspense
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || searchParams?.get('next') || '/student/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSupabaseConfigured()) {
      try {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(
            error.message === 'Invalid login credentials'
              ? 'Incorrect email or password. Please try again.'
              : error.message
          );
          setLoading(false);
          return;
        }

        if (session) {
          // Check role for routing
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          const role = profile?.role || 'student';
          if (role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push(redirectTo);
          }
        }
      } catch (err) {
        setErrorMsg('Something went wrong. Please try again.');
        setLoading(false);
      }
    } else {
      // Simulation fallback
      setTimeout(() => {
        const isAdmin = email.toLowerCase().includes('admin');
        const role = isAdmin ? 'admin' : 'student';
        localStorage.setItem('simulated_role', role);
        if (!localStorage.getItem('simulated_profile')) {
          localStorage.setItem('simulated_profile', JSON.stringify({
            fullName: isAdmin ? 'Admin User' : 'Aspirant',
            username: isAdmin ? 'admin_user' : 'aspirant_user',
            email,
            city: 'New Delhi',
            targetExam: 'exam-ssc',
          }));
        }
        router.push(isAdmin ? '/admin/dashboard' : redirectTo);
      }, 800);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        localStorage.setItem('simulated_role', 'student');
        router.push(redirectTo);
      }, 800);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Enter your email address above first, then click Forgot Password.');
      return;
    }
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/student/profile`,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('');
        alert(`Password reset link sent to ${email}. Check your inbox.`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-surface-950 to-indigo-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left panel — branding */}
        <div className="hidden lg:flex flex-col gap-7 text-white px-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="p-2.5 bg-brand-500 rounded-2xl shadow-lg shadow-brand-500/30">
              <GraduationCap className="h-7 w-7 text-white" />
            </span>
            <span className="text-2xl font-black tracking-tight">
              Aspira<span className="text-brand-400">v</span>
            </span>
          </Link>

          <div>
            <h1 className="text-3xl font-black leading-tight mb-2">
              Welcome back,<br />
              <span className="text-brand-400">Aspirant.</span>
            </h1>
            <p className="text-brand-100/70 text-sm font-medium leading-relaxed">
              Sign in to continue your exam preparation journey.
            </p>
          </div>

          <div className="space-y-3">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1.5 bg-brand-500/20 rounded-lg shrink-0">
                    <Icon className="h-4 w-4 text-brand-300" />
                  </div>
                  <span className="text-sm text-white/75 font-medium">{b.text}</span>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-brand-200/60 font-semibold">
            Trusted by 85,000+ aspirants preparing for government exams across India.
          </div>
        </div>

        {/* Right panel — form */}
        <div className="w-full">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <span className="p-2 bg-brand-500 rounded-xl text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-black text-white">
              Aspira<span className="text-brand-400">v</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-6 md:p-8">
            <h2 className="text-xl font-black text-surface-900 mb-1">Sign in to your account</h2>
            <p className="text-xs text-surface-450 font-semibold mb-6">
              Don&apos;t have an account?{' '}
              <Link
                href={`/register${redirectTo !== '/student/dashboard' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-brand-600 font-black hover:underline"
              >
                Register free
              </Link>
            </p>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-surface-200 rounded-xl text-sm font-bold text-surface-700 hover:bg-surface-50 transition-colors mb-5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                  or sign in with email
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-danger-50 border border-danger-150 text-danger-700 text-xs font-bold rounded-xl mb-4">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aspirant@gmail.com"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-8 text-surface-400 hover:text-surface-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-black text-brand-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full justify-center"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-surface-100 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-surface-400 hover:text-brand-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Outer page wraps LoginContent in Suspense so Next.js can prerender a shell
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-brand-950 via-surface-950 to-indigo-950 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="p-3 bg-brand-500/30 rounded-2xl">
              <GraduationCap className="h-8 w-8 text-brand-300" />
            </div>
            <div className="h-4 w-32 bg-white/10 rounded-lg" />
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
