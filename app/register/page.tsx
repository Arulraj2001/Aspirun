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
import { GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Registration states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [qualification, setQualification] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Username validation check
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    if (!usernameRegex.test(username)) {
      setErrorMsg('Username must be 3-15 characters long and contain only letters, numbers, or underscores.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // 1. Try real Supabase auth if keys are configured
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username,
              phone,
              city,
              qualification,
              target_exam_id: targetExam || null,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        alert('Registration successful! Please check your email for the confirmation link.');
        router.push('/login');
      } catch (err) {
        console.error('Registration failed:', err);
        const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
        setErrorMsg(message);
        setLoading(false);
      }
    } else {
      // 2. Local Simulation Mode
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem('simulated_role', 'student');
        localStorage.setItem('active_plan_id', targetExam === 'exam-upsc' ? 'plan-upsc-polity-30' : 'plan-ssc-quant-45');
        
        const mockProfile = {
          fullName,
          username,
          email,
          phone,
          city,
          qualification,
          targetExam,
          avatarUrl: '',
        };
        localStorage.setItem('simulated_profile', JSON.stringify(mockProfile));

        router.push('/student/dashboard');
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
          Join Aspirav Free
        </h1>
        <p className="text-xs md:text-sm text-surface-500 font-semibold text-center mt-1">
          Begin day-by-day organized learning and clear doubt equations.
        </p>
      </div>

      <Card className="shadow-lg border border-surface-200">
        <form onSubmit={handleRegister} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-danger-50 border border-danger-150 text-danger-700 text-xs font-bold rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Siddharth Mishra"
              required
            />
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="siddharth_99"
              required
              hint="Alphanumeric & underscore only."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aspirant@aspirav.in"
              required
            />
            <Input
              label="Phone Number (Optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
            />
          </div>

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New Delhi"
              required
            />
            <Input
              label="Qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="B.Tech / B.Sc / BA"
              required
            />
          </div>

          <Select
            label="Target Government Exam (Optional)"
            value={targetExam}
            onChange={(e) => setTargetExam(e.target.value)}
            options={[
              { value: '', label: 'Select Target Exam' },
              { value: 'exam-upsc', label: 'UPSC Civil Services' },
              { value: 'exam-ssc', label: 'SSC CGL Grade Officers' },
              { value: 'exam-rrb', label: 'RRB NTPC Railways' },
              { value: 'exam-ibps', label: 'IBPS PO Public Sector Banks' },
            ]}
          />

          <div className="text-xs font-semibold text-surface-650 pt-1 leading-relaxed">
            By registering, you agree to comply with our{' '}
            <Link href="/community" className="text-brand-650 font-black hover:underline">
              Strict Community Guidelines
            </Link>{' '}
            against spam posting.
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full justify-center mt-6"
            icon={<ArrowRight className="h-4.5 w-4.5" />}
            iconPosition="right"
          >
            Create Account
          </Button>
        </form>

        <div className="border-t border-surface-150 mt-6 pt-4 text-center flex flex-col gap-3">
          <p className="text-xs md:text-sm font-semibold text-surface-550">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 font-black hover:underline">
              Sign In Here
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
