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
import { User, Shield, RefreshCw, Upload, Check, AlertTriangle, Bell, CreditCard, Sparkles, XCircle, Hourglass } from 'lucide-react';
import Link from 'next/link';

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
    fullName: '',
    username: '',
    email: '',
    phone: '',
    city: '',
    qualification: '',
    targetExam: '',
    avatarUrl: '',
  });

  const [activePlanTitle, setActivePlanTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [usernameConflict, setUsernameConflict] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);

  // Notification Preferences state
  const [notifEmails, setNotifEmails] = useState(true);
  const [notifForum, setNotifForum] = useState(true);
  const [notifMocks, setNotifMocks] = useState(true);

  useEffect(() => {
    // 1. Sync study plan title
    const planId = localStorage.getItem('active_plan_id') || null;
    const plan = planId ? mockPlans.find((p) => p.id === planId) : null;

    // 2. Load profile (either real Supabase profiles table, or local mock data)
    const loadProfile = async () => {
      const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                           !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
      setIsConfigured(configured);
      
      let profileData: UserProfile | null = null;
      let userPayments: any[] = [];
      let userSubs: any[] = [];

      if (configured) {
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
                email: data.email || session.user.email || '',
                phone: data.phone || '',
                city: data.city || '',
                qualification: data.qualification || '',
                targetExam: data.target_exam_id || '',
                avatarUrl: data.avatar_url || '',
              };
            } else {
              profileData = {
                fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                username: session.user.email?.split('@')[0] || '',
                email: session.user.email || '',
                phone: '',
                city: '',
                qualification: '',
                targetExam: '',
                avatarUrl: '',
              };
            }

            // Load payments history
            const { data: pay } = await supabase
              .from('payment_requests')
              .select('*')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false });
            if (pay) userPayments = pay;

            // Load subscriptions passes
            const { data: sub } = await supabase
              .from('student_subscriptions')
              .select('*, subscription_plans(name)')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false });
            if (sub) userSubs = sub;
          }
        } catch (err) {
          console.error('Failed to load Supabase profile & billing:', err);
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
        } else {
          // Default empty/fresh simulated profile for standard guests
          profileData = {
            fullName: 'Aspirant',
            username: 'aspirant_user',
            email: 'aspirant@aspirav.in',
            phone: '',
            city: '',
            qualification: '',
            targetExam: '',
            avatarUrl: '',
          };
        }

        // Payments fallback
        const savedPay = localStorage.getItem('payment_requests_db') || '[]';
        userPayments = JSON.parse(savedPay).filter((p: any) => p.username === 'siddharth_99' || p.user === 'Siddharth Mishra');

        // Subscriptions fallback
        const savedSub = localStorage.getItem('simulated_subscription');
        if (savedSub) {
          const sub = JSON.parse(savedSub);
          userSubs = [{
            id: 'sim-sub-id',
            starts_at: sub.starts_at,
            ends_at: sub.ends_at,
            amount_paid: 599.00,
            status: sub.status,
            subscription_plans: { name: sub.name }
          }];
        }
      }

      setTimeout(() => {
        if (plan) {
          setActivePlanTitle(plan.title);
        } else {
          setActivePlanTitle('No active plan chosen yet.');
        }
        if (profileData) {
          setProfile(profileData);
        }
        setPayments(userPayments);
        setSubscriptions(userSubs);
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

          if (profile.targetExam) {
            const nextPlanId = profile.targetExam === 'exam-upsc' ? 'plan-upsc-polity-30' : 'plan-ssc-quant-45';
            localStorage.setItem('active_plan_id', nextPlanId);
            const plan = mockPlans.find((p) => p.id === nextPlanId);
            if (plan) setActivePlanTitle(plan.title);
          } else {
            localStorage.removeItem('active_plan_id');
            setActivePlanTitle('No active plan chosen yet.');
          }
        }
      } catch (err) {
        console.error('Profile save error:', err);
      }
    } else {
      // Mock save
      localStorage.setItem('simulated_profile', JSON.stringify(profile));
      if (profile.targetExam) {
        const nextPlanId = profile.targetExam === 'exam-upsc' ? 'plan-upsc-polity-30' : 'plan-ssc-quant-45';
        localStorage.setItem('active_plan_id', nextPlanId);
        const plan = mockPlans.find((p) => p.id === nextPlanId);
        if (plan) setActivePlanTitle(plan.title);
      } else {
        localStorage.removeItem('active_plan_id');
        setActivePlanTitle('No active plan chosen yet.');
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

          {/* Billing & Membership Pass History */}
          <Card id="billing" className="border border-surface-200 bg-white">
            <h3 className="text-base font-extrabold text-surface-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-500" />
              Billing & Membership History
            </h3>

            {/* Active Subscription Details */}
            {subscriptions.length > 0 ? (
              <div className="mb-6 p-4 bg-brand-50/20 border border-brand-200 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-brand-650 tracking-wider flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-4 w-4 text-brand-500 animate-pulse" /> Active Pro Membership Pass
                </h4>
                {subscriptions.map((sub) => {
                  const daysLeft = Math.max(0, Math.ceil((new Date(sub.ends_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
                  return (
                    <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-surface-650">
                      <div>
                        <span className="text-[10px] text-surface-400 font-extrabold uppercase">Plan Name</span>
                        <p className="text-brand-650 font-black text-sm">{sub.subscription_plans?.name || 'Aspirav Pro'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-surface-400 font-extrabold uppercase">Valid Until</span>
                        <p className="text-surface-850">{new Date(sub.ends_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-surface-400 font-extrabold uppercase">Remaining Days</span>
                        <p className="text-success-700 font-black text-sm">{daysLeft} Days Remaining</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mb-6 p-4 bg-surface-50 border border-surface-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-surface-850">Standard Account (Free Tier)</h4>
                  <p className="text-[10px] text-surface-450 font-semibold mt-0.5">Upgrade to gain full access to premium mock tests, syllabus roadmaps, and guidelines notes.</p>
                </div>
                <Link href="/pricing">
                  <Button size="sm" variant="primary" className="text-[10px] font-black uppercase tracking-wider">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Invoices List */}
            <div>
              <h4 className="text-xs font-black uppercase text-surface-850 tracking-wider mb-3">Invoice & Verification Queue</h4>
              {payments.length === 0 ? (
                <p className="text-xs text-surface-450 font-semibold py-4 text-center">No payment checkout requests found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-surface-650">
                    <thead>
                      <tr className="border-b border-surface-100 text-[10px] text-surface-400 font-extrabold uppercase bg-surface-50/50">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">UTR Transaction ID</th>
                        <th className="py-2.5 px-3 text-center">Receipt Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {payments.map((req) => (
                        <React.Fragment key={req.id}>
                          <tr className="hover:bg-surface-50/20">
                            <td className="py-3 px-3 text-[11px] whitespace-nowrap">
                              {new Date(req.created_at || req.dateCreated).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                            </td>
                            <td className="py-3 px-3 uppercase text-[10px] font-black text-brand-650">
                              {req.content_type || req.contentType}
                            </td>
                            <td className="py-3 px-3 font-extrabold text-surface-850">
                              ₹{req.amount}
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px] text-surface-550">
                              {req.upi_transaction_id || req.upiTransactionId}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                req.status === 'approved'
                                  ? 'bg-success-50 text-success-700 border-success-100'
                                  : req.status === 'rejected'
                                  ? 'bg-danger-50 text-danger-700 border-danger-100'
                                  : 'bg-orange-50 text-orange-700 border-orange-100'
                              }`}>
                                {req.status === 'approved' && <Check className="h-3 w-3" />}
                                {req.status === 'rejected' && <XCircle className="h-3 w-3" />}
                                {req.status === 'pending' && <Hourglass className="h-3 w-3 animate-spin" />}
                                {req.status}
                              </span>
                            </td>
                          </tr>
                          {req.status === 'rejected' && (req.admin_note || req.adminNote) && (
                            <tr className="bg-danger-50/10">
                              <td colSpan={5} className="py-2 px-3 text-[10px] text-danger-700 border-t-0 font-semibold leading-normal">
                                <span className="font-extrabold uppercase text-[9px] text-danger-600 block">Rejection Note:</span>
                                {req.admin_note || req.adminNote}
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
