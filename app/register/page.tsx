'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import type { Metadata } from 'next';

// Target exam UUID map — all four exams supported
const EXAM_UUID_MAP: Record<string, string> = {
  'exam-upsc': '123e4567-e89b-12d3-a456-426614174000',
  'exam-ssc': '433a7ad1-77ad-4560-bf88-a739b8bc7e6a',
  'exam-rrb': 'b7c53d10-8b1b-4f51-b0db-bcf643f8e52e',
  'exam-ibps': 'cb03e190-21a4-4f9e-a0db-bcd6f58bc7ea',
};

const FEATURES = [
  'Free daily study checklists tailored to your exam',
  'Peer doubt-solving community with toppers',
  'Sectional quizzes and full mock tests',
  'Current affairs digests & strategy blogs',
  'Track your streak, progress, and weak topics',
];

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [qualification, setQualification] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('Hindi');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleCheckUsername = async (val: string) => {
    setUsername(val);
    if (val.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', val)
        .maybeSingle();
      setUsernameAvailable(!data);
    } catch {
      setUsernameAvailable(null);
    }
    setCheckingUsername(false);
  };

  const handleGoogleRegister = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/student/dashboard`,
      },
    });
    if (error) setErrorMsg(error.message);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setErrorMsg('Username must be 3–20 characters: letters, numbers, or underscores only.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    const isConfigured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const targetExamUuid = EXAM_UUID_MAP[targetExam] || null;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username,
              phone,
              city,
              state,
              qualification,
              preferred_language: preferredLanguage,
              target_exam_id: targetExam || null,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        // Update target_exam_id to uuid after registration (triggers handle_new_user)
        // The trigger handles the conversion from slug to uuid

        router.push('/student/dashboard');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed. Try again.';
        setErrorMsg(message);
        setLoading(false);
      }
    } else {
      // Simulation fallback
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('simulated_role', 'student');
        const planId =
          targetExam === 'exam-upsc'
            ? 'plan-upsc-polity-30'
            : targetExam === 'exam-ssc'
            ? 'plan-ssc-quant-45'
            : targetExam === 'exam-rrb'
            ? 'plan-rrb-general-30'
            : 'plan-ibps-quant-30';
        localStorage.setItem('active_plan_id', planId);
        localStorage.setItem(
          'simulated_profile',
          JSON.stringify({ fullName, username, email, phone, city, state, qualification, targetExam, avatarUrl: '' })
        );
        router.push('/student/dashboard');
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-surface-950 to-indigo-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left — Branding Panel */}
        <div className="hidden lg:flex flex-col gap-8 text-white px-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-brand-500 rounded-2xl shadow-lg shadow-brand-500/30">
              <GraduationCap className="h-7 w-7 text-white" />
            </span>
            <span className="text-2xl font-black tracking-tight">
              Aspir<span className="text-brand-400">av</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
              Your Exam Prep<br />
              <span className="text-brand-400">Starts Here.</span>
            </h1>
            <p className="text-brand-100/70 text-sm font-medium leading-relaxed max-w-sm">
              Join 85,000+ aspirants who use Aspirav's daily planner to ace UPSC, SSC, RRB, and IBPS exams.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((feat, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/80 font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-xs text-white/60 font-medium mb-2">Trusted by aspirants preparing for</p>
            <div className="flex flex-wrap gap-2">
              {['UPSC IAS', 'SSC CGL', 'RRB NTPC', 'IBPS PO', 'SBI PO'].map((exam) => (
                <span
                  key={exam}
                  className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300"
                >
                  {exam}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Registration Form */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <span className="p-2 bg-brand-500 rounded-xl text-white shadow-lg shadow-brand-500/30">
              <GraduationCap className="h-6 w-6" />
            </span>
            <span className="text-xl font-black text-white tracking-tight">
              Aspir<span className="text-brand-400">av</span>
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-6 md:p-8">
            <h2 className="text-xl font-black text-surface-900 mb-1">Create your account</h2>
            <p className="text-xs text-surface-450 font-semibold mb-6">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-600 font-black hover:underline">
                Sign in
              </Link>
            </p>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-surface-200 rounded-xl text-sm font-bold text-surface-700 hover:bg-surface-50 transition-colors mb-4 shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                  or register with email
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-danger-50 border border-danger-150 text-danger-700 text-xs font-bold rounded-xl mb-4">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Step 1: Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Siddharth Mishra"
                  required
                />
                <div className="relative">
                  <Input
                    label="Username"
                    value={username}
                    onChange={(e) => handleCheckUsername(e.target.value)}
                    placeholder="siddharth_99"
                    required
                    hint={
                      checkingUsername
                        ? 'Checking...'
                        : username.length >= 3
                        ? usernameAvailable === true
                          ? '✓ Available'
                          : usernameAvailable === false
                          ? '✗ Already taken'
                          : 'Letters, numbers, underscores only'
                        : 'Letters, numbers, underscores only'
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aspirant@gmail.com"
                  required
                />
                <Input
                  label="Phone (Optional)"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-8 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New Delhi"
                  required
                />
                <Input
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Delhi"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="B.Tech / B.Sc / BA"
                  required
                />
                <Select
                  label="Preferred Language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  options={[
                    { value: 'Hindi', label: 'हिंदी (Hindi)' },
                    { value: 'English', label: 'English' },
                    { value: 'Both', label: 'Both Hindi & English' },
                  ]}
                />
              </div>

              <Select
                label="Target Government Exam"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                options={[
                  { value: '', label: 'Select your target exam (optional)' },
                  { value: 'exam-upsc', label: 'UPSC Civil Services (IAS/IPS)' },
                  { value: 'exam-ssc', label: 'SSC CGL — Grade B & C Officers' },
                  { value: 'exam-rrb', label: 'RRB NTPC — Railway Non-Technical' },
                  { value: 'exam-ibps', label: 'IBPS PO — Public Sector Banks' },
                ]}
              />

              <p className="text-xs font-semibold text-surface-500 leading-relaxed pt-1">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-brand-600 font-black hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/community-guidelines" className="text-brand-600 font-black hover:underline">
                  Community Guidelines
                </Link>
                .
              </p>

              <Button
                type="submit"
                isLoading={loading}
                disabled={usernameAvailable === false}
                className="w-full justify-center mt-2"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                Create Free Account
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-surface-100 text-center">
              <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-surface-400 hover:text-brand-600 transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
