'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockPlans } from '@/data/mockData';
import { supabase } from '@/lib/supabase/client';
import { User, Shield, RefreshCw, Upload, Check, AlertTriangle, Bell } from 'lucide-react';

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  qualification: string;
  targetExam: string;
  avatarUrl: string;
}

export default function StudentProfile() {
  const router = useRouter();

  // Profile fields state
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Siddharth Mishra',
    username: 'siddharth_99',
    email: 'aspirant@studysetu.in',
    phone: '9876543210',
    city: 'New Delhi',
    qualification: 'B.Tech Graduate',
    targetExam: 'exam-ssc',
    avatarUrl: '',
  });

  const [activePlanTitle, setActivePlanTitle] = useState('30-Day Laxmikanth Indian Polity Crash Course');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usernameConflict, setUsernameConflict] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Notification Preferences state
  const [notifEmails, setNotifEmails] = useState(true);
  const [notifForum, setNotifForum] = useState(true);
  const [notifMocks, setNotifMocks] = useState(true);

  useEffect(() => {
    // 1. Sync study plan title
    const planId = localStorage.getItem('active_plan_id') || 'plan-upsc-polity-30';
    const plan = mockPlans.find((p) => p.id === planId);

    // 2. Load profile (either real Supabase profiles table, or local mock data)
    const loadProfile = async () => {
      const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                           !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
      
      let profileData: UserProfile | null = null;

      if (isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (data) {
              profileData = {
                fullName: data.full_name || '',
                username: data.username || '',
                email: data.email || '',
                phone: data.phone || '',
                city: data.city || '',
                qualification: data.qualification || '',
                targetExam: data.target_exam_id || '',
                avatarUrl: data.avatar_url || '',
              };
            }
          }
        } catch (err) {
          console.error('Failed to load Supabase profile:', err);
        }
      } else {
        // Mock fallback
        const saved = localStorage.getItem('simulated_profile');
        if (saved) {
          try {
            profileData = JSON.parse(saved);
          } catch (e) {
            console.error('Failed to parse simulated profile:', e);
          }
        }
      }

      setTimeout(() => {
        if (plan) {
          setActivePlanTitle(plan.title);
        }
        if (profileData) {
          setProfile(profileData);
        }
      }, 0);
    };

    loadProfile();
  }, []);

  // Check username uniqueness
  const handleUsernameChange = async (val: string) => {
    setProfile((prev) => ({ ...prev, username: val }));
    if (!val.trim()) return;

    setCheckingUsername(true);
    setUsernameConflict(false);

    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', val)
          .single();

        if (data && data.id !== session?.user?.id) {
          setUsernameConflict(true);
        }
      } catch {
        // Not found or error: username is free
      }
    } else {
      // Mock validation list
      setTimeout(() => {
        const taken = ['admin_moderator', 'topper_cgl', 'prepmaster'];
        if (taken.includes(val.toLowerCase()) && val.toLowerCase() !== 'siddharth_99') {
          setUsernameConflict(true);
        }
        setCheckingUsername(false);
      }, 300);
      return;
    }
    setCheckingUsername(false);
  };

  // Handle avatar file selection & upload simulation
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local Preview FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfile((prev) => ({ ...prev, avatarUrl: result }));
      
      // Save preview in mock mode immediately
      const saved = localStorage.getItem('simulated_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.avatarUrl = result;
        localStorage.setItem('simulated_profile', JSON.stringify(parsed));
      }
    };
    reader.readAsDataURL(file);

    // Real Supabase storage upload if keys are active
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    if (isConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${session.user.id}-${Math.random()}.${fileExt}`;

        // Upload to bucket
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Avatar upload failed:', uploadError.message);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Update profile schema
        await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', session.user.id);
      } catch (err) {
        console.error('Supabase bucket avatar upload error:', err);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameConflict) return;

    setIsSaving(true);
    setSaveSuccess(false);

    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { error } = await supabase
            .from('profiles')
            .update({
              full_name: profile.fullName,
              username: profile.username,
              phone: profile.phone,
              city: profile.city,
              qualification: profile.qualification,
              target_exam_id: profile.targetExam || null,
            })
            .eq('id', session.user.id);

          if (error) {
            alert(error.message);
            setIsSaving(false);
            return;
          }
        }
      } catch (err) {
        console.error('Profile save error:', err);
      }
    } else {
      // Mock save
      localStorage.setItem('simulated_profile', JSON.stringify(profile));
      if (profile.targetExam) {
        localStorage.setItem('active_plan_id', profile.targetExam === 'exam-upsc' ? 'plan-upsc-polity-30' : 'plan-ssc-quant-45');
        // Retrieve plan name
        const plan = mockPlans.find((p) => p.id === (profile.targetExam === 'exam-upsc' ? 'plan-upsc-polity-30' : 'plan-ssc-quant-45'));
        if (plan) setActivePlanTitle(plan.title);
      }
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleResetSimulation = () => {
    localStorage.clear();
    alert('Simulated session and local streaks cleared. Redirecting to landing page.');
    router.push('/');
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title="Student Profile & Settings"
        subtitle="Manage your personal details, target credentials, and simulated test credentials."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Quick details avatar card */}
        <div className="space-y-6">
          <Card className="text-center flex flex-col items-center border border-surface-200">
            <div className="relative group mb-4">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover border-2 border-brand-500 shadow-md"
                />
              ) : (
                <span className="h-20 w-20 bg-brand-50 rounded-full border border-brand-100 flex items-center justify-center text-brand-650 shadow-md">
                  <User className="h-10 w-10" />
                </span>
              )}
              <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-150 text-white text-[10px] font-black uppercase">
                <Upload className="h-4 w-4 mr-1" /> Edit
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="text-lg font-black text-surface-900">{profile.fullName || 'Guest Aspirant'}</h3>
            <p className="text-xs font-bold text-surface-450 mt-0.5">{profile.email}</p>
            <span className="mt-3 text-[10px] font-black uppercase text-success-700 bg-success-50 border border-success-100 px-2.5 py-0.5 rounded-full">
              Verified Student
            </span>
          </Card>

          <Card className="border border-surface-200">
            <h4 className="text-sm font-black uppercase text-surface-850 tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="h-4.5 w-4.5 text-brand-500" />
              Credentials & Role
            </h4>
            <div className="space-y-3.5 text-xs font-bold text-surface-650">
              <div className="flex justify-between">
                <span>Account Role</span>
                <span className="text-surface-850 uppercase">Student</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="shrink-0">Target Study Plan</span>
                <span className="text-surface-850 text-right font-black max-w-[160px] truncate">
                  {activePlanTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-success-600">Active</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Edit forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-surface-200">
            <h3 className="text-base font-extrabold text-surface-900 mb-4">Edit Profile Details</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {saveSuccess && (
                <div className="p-3 bg-success-50 border border-success-150 text-success-700 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-in fade-in duration-200">
                  <Check className="h-4.5 w-4.5" /> Profile settings updated successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  required
                />
                <div>
                  <Input
                    label="Username"
                    value={profile.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    required
                    hint={checkingUsername ? 'Checking availability...' : 'Enter your unique alias.'}
                  />
                  {usernameConflict && (
                    <span className="text-[10px] text-danger-600 font-bold flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> This username is already taken.
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  value={profile.email}
                  disabled
                  hint="Email cannot be changed after verification."
                />
                <Input
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  required
                />
                <Input
                  label="Qualification"
                  value={profile.qualification}
                  onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                  required
                />
              </div>

              <Select
                label="Target Government Exam"
                value={profile.targetExam}
                onChange={(e) => setProfile({ ...profile, targetExam: e.target.value })}
                options={[
                  { value: 'exam-upsc', label: 'UPSC Civil Services' },
                  { value: 'exam-ssc', label: 'SSC CGL Grade Officers' },
                  { value: 'exam-rrb', label: 'RRB NTPC Railways' },
                  { value: 'exam-ibps', label: 'IBPS PO Public Sector Banks' },
                ]}
              />

              <div className="flex justify-end pt-3 border-t border-surface-100 mt-6">
                <Button type="submit" size="sm" isLoading={isSaving} disabled={usernameConflict}>
                  Save Details
                </Button>
              </div>
            </form>
          </Card>

          {/* Notification Preferences Card */}
          <Card className="border border-surface-200 bg-white">
            <h3 className="text-base font-extrabold text-surface-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-500" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-surface-650">
                <input
                  type="checkbox"
                  checked={notifEmails}
                  onChange={(e) => setNotifEmails(e.target.checked)}
                  className="mt-0.5"
                />
                <div>
                  <span>Daily Study Checklist Alerts</span>
                  <p className="text-[10px] text-surface-400 font-semibold mt-0.5">Receive daily notifications for active targets checklists and streaks reminder alerts.</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-surface-650">
                <input
                  type="checkbox"
                  checked={notifForum}
                  onChange={(e) => setNotifForum(e.target.checked)}
                  className="mt-0.5"
                />
                <div>
                  <span>Community doubt Alerts</span>
                  <p className="text-[10px] text-surface-400 font-semibold mt-0.5">Receive notifications when your posts get replies or answers are marked helpful by mentors.</p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-surface-650">
                <input
                  type="checkbox"
                  checked={notifMocks}
                  onChange={(e) => setNotifMocks(e.target.checked)}
                  className="mt-0.5"
                />
                <div>
                  <span>Mock Results Scorecard Alerts</span>
                  <p className="text-[10px] text-surface-400 font-semibold mt-0.5">Receive email scorecard updates with detailed solution analytics upon submissions.</p>
                </div>
              </label>
            </div>
          </Card>

          <Card className="border border-surface-200 bg-red-50/5">
            <h3 className="text-base font-extrabold text-surface-900 mb-4 flex items-center gap-2 text-danger-600">
              <RefreshCw className="h-5 w-5" />
              Simulation Settings
            </h3>
            <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold mb-5">
              Reset the local state simulation to start from scratch. This clears cookies, active study plan variables, and custom mock test streaks.
            </p>
            <div>
              <Button onClick={handleResetSimulation} variant="danger" size="sm">
                Reset Simulated Session
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </Container>
  );
}
