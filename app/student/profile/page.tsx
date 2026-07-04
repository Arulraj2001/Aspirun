'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { supabase } from '@/lib/supabase/client';
import {
  User,
  Shield,
  Upload,
  Check,
  AlertTriangle,
  Bell,
  CreditCard,
  Sparkles,
  XCircle,
  Hourglass,
  MapPin,
  Languages,
  BookOpen,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

const EXAM_UUID_MAP: Record<string, string> = {
  'exam-upsc': '123e4567-e89b-12d3-a456-426614174000',
  'exam-ssc': '433a7ad1-77ad-4560-bf88-a739b8bc7e6a',
  'exam-rrb': 'b7c53d10-8b1b-4f51-b0db-bcf643f8e52e',
  'exam-ibps': 'cb03e190-21a4-4f9e-a0db-bcd6f58bc7ea',
};

const UUID_EXAM_MAP: Record<string, string> = {
  '123e4567-e89b-12d3-a456-426614174000': 'exam-upsc',
  '433a7ad1-77ad-4560-bf88-a739b8bc7e6a': 'exam-ssc',
  'b7c53d10-8b1b-4f51-b0db-bcf643f8e52e': 'exam-rrb',
  'cb03e190-21a4-4f9e-a0db-bcd6f58bc7ea': 'exam-ibps',
};

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  qualification: string;
  targetExam: string;
  avatarUrl: string;
  preferredLanguage: string;
  bio: string;
  dateOfBirth: string;
}

const INITIAL_PROFILE: UserProfile = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  qualification: '',
  targetExam: '',
  avatarUrl: '',
  preferredLanguage: 'Hindi',
  bio: '',
  dateOfBirth: '',
};

export default function StudentProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [usernameConflict, setUsernameConflict] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Notification prefs
  const [notifEmailChecklist, setNotifEmailChecklist] = useState(true);
  const [notifForumReplies, setNotifForumReplies] = useState(true);
  const [notifMockResults, setNotifMockResults] = useState(true);

  useEffect(() => {
    const configured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    setIsConfigured(configured);

    const loadProfile = async () => {
      setIsLoading(true);

      if (configured) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            router.push('/login?redirect=/student/profile');
            return;
          }

          setUserId(session.user.id);

          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            const targetExamSlug = UUID_EXAM_MAP[profileData.target_exam_id ?? ''] || '';
            const notifPrefs = profileData.notification_preferences || {};

            setProfile({
              fullName: profileData.full_name || '',
              username: profileData.username || '',
              email: profileData.email || session.user.email || '',
              phone: profileData.phone || '',
              city: profileData.city || '',
              state: profileData.state || '',
              qualification: profileData.qualification || '',
              targetExam: targetExamSlug,
              avatarUrl: profileData.avatar_url || '',
              preferredLanguage: profileData.preferred_language || 'Hindi',
              bio: profileData.bio || '',
              dateOfBirth: profileData.date_of_birth || '',
            });

            setNotifEmailChecklist(notifPrefs.email_checklist ?? true);
            setNotifForumReplies(notifPrefs.forum_replies ?? true);
            setNotifMockResults(notifPrefs.mock_results ?? true);
          }

          // Load payment history
          const { data: payData } = await supabase
            .from('payment_requests')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(20);
          if (payData) setPayments(payData);

          // Load subscriptions
          const { data: subData } = await supabase
            .from('student_subscriptions')
            .select('*, subscription_plans(name)')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
          if (subData) setSubscriptions(subData);
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      } else {
        // Simulation fallback
        const saved = localStorage.getItem('simulated_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile({
            fullName: parsed.fullName || 'Aspirant',
            username: parsed.username || 'aspirant_user',
            email: parsed.email || 'aspirant@aspirav.in',
            phone: parsed.phone || '',
            city: parsed.city || '',
            state: parsed.state || '',
            qualification: parsed.qualification || '',
            targetExam: parsed.targetExam || '',
            avatarUrl: parsed.avatarUrl || '',
            preferredLanguage: parsed.preferredLanguage || 'Hindi',
            bio: parsed.bio || '',
            dateOfBirth: parsed.dateOfBirth || '',
          });
        }
      }

      setIsLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleCheckUsername = async (val: string) => {
    setProfile((p) => ({ ...p, username: val }));
    if (!val.trim() || val.length < 3) return;
    setCheckingUsername(true);
    setUsernameConflict(false);

    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', val)
        .maybeSingle();
      if (data && data.id !== userId) setUsernameConflict(true);
    } catch {
      // ignore
    }
    setCheckingUsername(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfile((p) => ({ ...p, avatarUrl: result }));
    };
    reader.readAsDataURL(file);

    if (isConfigured && userId) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
          setProfile((p) => ({ ...p, avatarUrl: publicUrl }));
          await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId);
        }
      } catch (err) {
        console.error('Avatar upload error:', err);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameConflict) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    const notifPrefs = {
      email_checklist: notifEmailChecklist,
      forum_replies: notifForumReplies,
      mock_results: notifMockResults,
    };

    if (isConfigured && userId) {
      try {
        const targetExamUuid = EXAM_UUID_MAP[profile.targetExam] || null;

        const { error } = await supabase.from('profiles').update({
          full_name: profile.fullName,
          username: profile.username,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          qualification: profile.qualification,
          preferred_language: profile.preferredLanguage,
          bio: profile.bio,
          date_of_birth: profile.dateOfBirth || null,
          target_exam_id: targetExamUuid,
          notification_preferences: notifPrefs,
        }).eq('id', userId);

        if (error) {
          setSaveError(error.message);
          setIsSaving(false);
          return;
        }
      } catch (err) {
        setSaveError('Failed to save. Please try again.');
        setIsSaving(false);
        return;
      }
    } else {
      // Simulation
      localStorage.setItem('simulated_profile', JSON.stringify({ ...profile, ...notifPrefs }));
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 600);
  };

  if (isLoading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-surface-200 rounded-xl mx-auto"></div>
          <div className="h-4 w-64 bg-surface-100 rounded-xl mx-auto"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-surface-400 font-bold mb-6">
        <Link href="/student/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-surface-700">My Profile</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">Profile & Settings</h1>
        <p className="text-sm text-surface-450 font-semibold mt-1">
          Manage your personal details, exam preferences, and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left column: Avatar + quick info */}
        <div className="lg:col-span-1 space-y-5">
          <Card className="text-center flex flex-col items-center border border-surface-200 bg-white shadow-sm">
            <div className="relative group mb-4">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover border-4 border-brand-100 shadow-lg ring-2 ring-brand-500/20"
                />
              ) : (
                <div className="h-24 w-24 bg-gradient-to-br from-brand-100 to-brand-200 rounded-full border-4 border-brand-100 flex items-center justify-center shadow-lg ring-2 ring-brand-500/20">
                  <User className="h-11 w-11 text-brand-500" />
                </div>
              )}
              <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200 text-white gap-1">
                <Upload className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase">Change</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <h3 className="text-lg font-black text-surface-900 leading-tight">{profile.fullName || 'Aspirant'}</h3>
            <p className="text-xs font-bold text-surface-400 mt-0.5">@{profile.username}</p>
            <p className="text-[10px] font-semibold text-surface-400 mt-0.5">{profile.email}</p>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <span className="text-[10px] font-black uppercase text-success-700 bg-success-50 border border-success-100 px-2.5 py-0.5 rounded-full">
                Verified
              </span>
              <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full">
                Student
              </span>
            </div>
          </Card>

          <Card className="border border-surface-200 bg-white shadow-sm">
            <h4 className="text-xs font-black uppercase text-surface-450 tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-brand-500" />
              Account Info
            </h4>
            <div className="space-y-3 text-xs font-semibold text-surface-550">
              {profile.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-surface-400 shrink-0" />
                  <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
                </div>
              )}
              {profile.preferredLanguage && (
                <div className="flex items-center gap-2">
                  <Languages className="h-3.5 w-3.5 text-surface-400 shrink-0" />
                  <span>{profile.preferredLanguage}</span>
                </div>
              )}
              {profile.qualification && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-surface-400 shrink-0" />
                  <span>{profile.qualification}</span>
                </div>
              )}
              {profile.targetExam && (
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                  <span className="text-brand-700 font-bold">
                    {{
                      'exam-upsc': 'UPSC Civil Services',
                      'exam-ssc': 'SSC CGL',
                      'exam-rrb': 'RRB NTPC',
                      'exam-ibps': 'IBPS PO',
                    }[profile.targetExam] || profile.targetExam}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick navigation */}
          <Card className="border border-surface-200 bg-white shadow-sm">
            <h4 className="text-xs font-black uppercase text-surface-450 tracking-wider mb-3">Quick Links</h4>
            <nav className="space-y-1">
              {[
                { label: 'Dashboard', href: '/student/dashboard' },
                { label: 'My Study Plan', href: '/student/my-plan' },
                { label: 'Progress Reports', href: '/student/progress' },
                { label: 'Mock Results', href: '/student/mock-results' },
                { label: 'Upgrade Plan', href: '/pricing' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between text-xs font-bold text-surface-600 hover:text-brand-600 hover:bg-brand-50 px-2 py-1.5 rounded-lg transition-colors"
                >
                  {link.label}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </nav>
          </Card>
        </div>

        {/* Right column: Edit forms */}
        <div className="lg:col-span-3 space-y-6">

          {/* Edit Profile Card */}
          <Card className="border border-surface-200 bg-white shadow-sm">
            <h3 className="text-base font-black text-surface-900 mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-brand-500" />
              Edit Profile Details
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {saveSuccess && (
                <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-150 text-success-700 text-xs font-bold rounded-xl animate-in fade-in duration-300">
                  <Check className="h-4 w-4 shrink-0" />
                  Profile updated successfully!
                </div>
              )}

              {saveError && (
                <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-150 text-danger-700 text-xs font-bold rounded-xl">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {saveError}
                </div>
              )}

              {/* Personal Info */}
              <div>
                <p className="text-[11px] font-black uppercase text-surface-400 tracking-wider mb-3">Personal Information</p>
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
                      onChange={(e) => handleCheckUsername(e.target.value)}
                      required
                      hint={
                        checkingUsername
                          ? 'Checking...'
                          : usernameConflict
                          ? '✗ Username taken'
                          : profile.username.length >= 3
                          ? '✓ Available'
                          : 'Unique public handle'
                      }
                    />
                    {usernameConflict && (
                      <span className="text-[10px] text-danger-600 font-bold flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" /> This username is already taken
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Email Address"
                    value={profile.email}
                    disabled
                    hint="Email cannot be changed."
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Bio (Optional)"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Brief intro about your exam journey..."
                  />
                </div>
              </div>

              {/* Location */}
              <div className="border-t border-surface-100 pt-5">
                <p className="text-[11px] font-black uppercase text-surface-400 tracking-wider mb-3">Location & Education</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="New Delhi"
                    required
                  />
                  <Input
                    label="State"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    placeholder="Delhi"
                  />
                  <Input
                    label="Qualification"
                    value={profile.qualification}
                    onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                    placeholder="B.Tech / B.Sc / BA"
                    required
                  />
                </div>
              </div>

              {/* Exam & Language */}
              <div className="border-t border-surface-100 pt-5">
                <p className="text-[11px] font-black uppercase text-surface-400 tracking-wider mb-3">Exam Preferences</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Target Exam"
                    value={profile.targetExam}
                    onChange={(e) => setProfile({ ...profile, targetExam: e.target.value })}
                    options={[
                      { value: '', label: 'Select target exam' },
                      { value: 'exam-upsc', label: 'UPSC Civil Services' },
                      { value: 'exam-ssc', label: 'SSC CGL' },
                      { value: 'exam-rrb', label: 'RRB NTPC' },
                      { value: 'exam-ibps', label: 'IBPS PO' },
                    ]}
                  />
                  <Select
                    label="Preferred Language"
                    value={profile.preferredLanguage}
                    onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                    options={[
                      { value: 'Hindi', label: 'हिंदी (Hindi)' },
                      { value: 'English', label: 'English' },
                      { value: 'Both', label: 'Both' },
                    ]}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-surface-100 mt-2">
                <Button type="submit" size="sm" isLoading={isSaving} disabled={usernameConflict}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Notification Preferences */}
          <Card className="border border-surface-200 bg-white shadow-sm">
            <h3 className="text-base font-black text-surface-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-500" />
              Notification Preferences
            </h3>

            <div className="space-y-4">
              {[
                {
                  id: 'notif-checklist',
                  checked: notifEmailChecklist,
                  onChange: setNotifEmailChecklist,
                  label: 'Daily Study Checklist Alerts',
                  desc: 'Get notified about your daily targets, streak milestones, and plan reminders.',
                },
                {
                  id: 'notif-forum',
                  checked: notifForumReplies,
                  onChange: setNotifForumReplies,
                  label: 'Community Reply Notifications',
                  desc: 'Be alerted when someone replies to your doubt threads or marks your answer helpful.',
                },
                {
                  id: 'notif-mocks',
                  checked: notifMockResults,
                  onChange: setNotifMockResults,
                  label: 'Mock Test Result Emails',
                  desc: 'Receive detailed score reports and solution breakdowns after each test submission.',
                },
              ].map((pref) => (
                <label
                  key={pref.id}
                  htmlFor={pref.id}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative mt-0.5">
                    <input
                      id={pref.id}
                      type="checkbox"
                      checked={pref.checked}
                      onChange={(e) => pref.onChange(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 rounded-full transition-colors ${pref.checked ? 'bg-brand-500' : 'bg-surface-200'}`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform mt-0.5 ml-0.5 ${pref.checked ? 'translate-x-5' : 'translate-x-0'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black text-surface-800">{pref.label}</p>
                    <p className="text-[10px] text-surface-450 font-semibold mt-0.5 leading-relaxed">{pref.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end mt-5 pt-4 border-t border-surface-100">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveProfile}
                isLoading={isSaving}
              >
                Save Preferences
              </Button>
            </div>
          </Card>

          {/* Billing & Subscription */}
          <Card id="billing" className="border border-surface-200 bg-white shadow-sm">
            <h3 className="text-base font-black text-surface-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-500" />
              Membership & Billing
            </h3>

            {subscriptions.length > 0 ? (
              <div className="mb-6 p-4 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-200 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-brand-650 tracking-wider flex items-center gap-1.5 mb-3">
                  <Sparkles className="h-4 w-4 text-brand-500 animate-pulse" />
                  Active Pro Membership
                </h4>
                {subscriptions.slice(0, 1).map((sub) => {
                  const daysLeft = Math.max(
                    0,
                    Math.ceil((new Date(sub.ends_at).getTime() - Date.now()) / 86400000)
                  );
                  const isActive = sub.status === 'active' && daysLeft > 0;
                  return (
                    <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-surface-650">
                      <div>
                        <span className="text-[10px] text-surface-400 font-extrabold uppercase">Plan</span>
                        <p className="text-brand-700 font-black text-sm mt-0.5">
                          {(sub.subscription_plans as any)?.name || 'Aspirav Pro'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-surface-400 font-extrabold uppercase">Valid Until</span>
                        <p className="text-surface-850 mt-0.5">
                          {new Date(sub.ends_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-surface-400 font-extrabold uppercase">Status</span>
                        <p className={`font-black text-sm mt-0.5 ${isActive ? 'text-success-700' : 'text-danger-600'}`}>
                          {isActive ? `${daysLeft} days left` : 'Expired'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mb-6 p-4 bg-surface-50 border border-surface-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-surface-850">Free Tier Account</h4>
                  <p className="text-[10px] text-surface-450 font-semibold mt-0.5 max-w-sm">
                    Upgrade to Pro for full mock tests, premium study plans, PDF notes, and priority doubt support.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button size="sm" variant="primary" className="text-[10px] font-black uppercase tracking-wider shrink-0">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Payment history */}
            <div>
              <h4 className="text-xs font-black uppercase text-surface-850 tracking-wider mb-3">
                Payment History
              </h4>
              {payments.length === 0 ? (
                <p className="text-xs text-surface-450 font-semibold py-4 text-center border border-dashed border-surface-200 rounded-xl">
                  No payment records found.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-surface-200">
                  <table className="w-full text-left text-xs font-semibold text-surface-650">
                    <thead>
                      <tr className="border-b border-surface-100 text-[10px] text-surface-400 font-extrabold uppercase bg-surface-50">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">UTR / Transaction ID</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {payments.map((req) => (
                        <React.Fragment key={req.id}>
                          <tr className="hover:bg-surface-50/50 transition-colors">
                            <td className="py-3 px-3 whitespace-nowrap">
                              {new Date(req.created_at).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                            </td>
                            <td className="py-3 px-3 uppercase text-[10px] font-black text-brand-650">
                              {req.content_type}
                            </td>
                            <td className="py-3 px-3 font-extrabold text-surface-850">
                              ₹{req.amount}
                            </td>
                            <td className="py-3 px-3 font-mono text-[10px] text-surface-550 truncate max-w-[160px]">
                              {req.upi_transaction_id}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                  req.status === 'approved'
                                    ? 'bg-success-50 text-success-700 border-success-100'
                                    : req.status === 'rejected'
                                    ? 'bg-danger-50 text-danger-700 border-danger-100'
                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                }`}
                              >
                                {req.status === 'approved' && <Check className="h-3 w-3" />}
                                {req.status === 'rejected' && <XCircle className="h-3 w-3" />}
                                {req.status === 'pending' && <Hourglass className="h-3 w-3" />}
                                {req.status}
                              </span>
                            </td>
                          </tr>
                          {req.status === 'rejected' && req.admin_note && (
                            <tr className="bg-danger-50/20">
                              <td colSpan={5} className="py-2 px-3 text-[10px] text-danger-700 font-semibold leading-relaxed">
                                <span className="font-extrabold uppercase text-[9px] text-danger-600">Admin Note: </span>
                                {req.admin_note}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </Container>
  );
}
