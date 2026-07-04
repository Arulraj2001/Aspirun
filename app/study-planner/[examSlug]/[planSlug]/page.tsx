'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockPlans, mockExams, mockMaterials, mockMockTests } from '@/data/mockData';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { supabase } from '@/lib/supabase/client';
import {
  Calendar,
  Compass,
  CheckCircle,
  FileText,
  PlayCircle,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Clock,
  BookMarked,
  Award,
  Lock,
  Hourglass,
  XCircle
} from 'lucide-react';

interface UserContentAccess {
  username: string;
  contentType: 'study_plan' | 'material' | 'mock_test';
  contentId: string;
}

interface PaymentRequest {
  id: string;
  user: string;
  username: string;
  contentType: 'study_plan' | 'material' | 'mock_test';
  contentId: string;
  contentTitle: string;
  amount: number;
  upiTransactionId: string;
  screenshot?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  dateCreated: string;
}

interface PageProps {
  params: Promise<{ examSlug: string; planSlug: string }>;
}

export default function StudyPlanDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { examSlug, planSlug } = use(params);

  const [enrolledStatus, setEnrolledStatus] = useState(false);
  
  // Payment states
  const [isPaymentModeOn, setIsPaymentModeOn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<PaymentRequest | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch plan matching planSlug
  const plan = mockPlans.find((p) => p.slug === planSlug || p.id === planSlug);
  const exam = mockExams.find((e) => e.slug === examSlug);

  const syncAccessData = useCallback(async () => {
    if (!plan) return;

    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    let paymentMode = false;

    if (isConfigured) {
      try {
        const { data } = await supabase.from('payment_settings').select('payment_mode').limit(1).maybeSingle();
        if (data) {
          paymentMode = data.payment_mode === 'on';
        }
      } catch (err) {
        console.error("Failed to load payment lock mode from db:", err);
      }
    } else {
      const settingsSaved = localStorage.getItem('payment_settings');
      if (settingsSaved) {
        const settings = JSON.parse(settingsSaved);
        paymentMode = settings.payment_mode === 'on';
      }
    }

    if (!paymentMode || plan.isFree) {
      setIsPaymentModeOn(paymentMode);
      setHasAccess(true);
      return;
    }

    if (isConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsPaymentModeOn(paymentMode);
          setHasAccess(false);
          setPendingPayment(null);
          return;
        }

        // 1. Check access (db check constraint content_type is 'plan')
        const { data: access } = await supabase
          .from('user_content_access')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('content_type', 'plan')
          .eq('content_id', plan.id)
          .maybeSingle();

        // 2. Check pending request
        const { data: req } = await supabase
          .from('payment_requests')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('content_type', 'plan')
          .eq('content_id', plan.id)
          .maybeSingle();

        setIsPaymentModeOn(paymentMode);
        setHasAccess(!!access);
        if (req) {
          setPendingPayment({
            id: req.id,
            user: '',
            username: '',
            contentType: 'study_plan',
            contentId: req.content_id,
            contentTitle: plan.title,
            amount: Number(req.amount),
            upiTransactionId: req.upi_transaction_id,
            screenshot: req.screenshot_url || undefined,
            notes: req.notes || undefined,
            status: req.status,
            adminNote: req.admin_note || undefined,
            dateCreated: req.created_at
          });
        } else {
          setPendingPayment(null);
        }
      } catch (err) {
        console.error("Database access sync failed:", err);
      }
    } else {
      // Local Storage Fallback
      const accessSaved = localStorage.getItem('user_content_access_db') || '[]';
      const accessList: UserContentAccess[] = JSON.parse(accessSaved);
      const ownsItem = accessList.some(
        (a) => a.username === 'siddharth_99' && a.contentType === 'study_plan' && a.contentId === plan.id
      );

      const payReqsSaved = localStorage.getItem('payment_requests_db') || '[]';
      const allReqs: PaymentRequest[] = JSON.parse(payReqsSaved);
      const matchingReq = allReqs.find(
        (r) => r.username === 'siddharth_99' && r.contentType === 'study_plan' && r.contentId === plan.id
      );

      setIsPaymentModeOn(paymentMode);
      setHasAccess(ownsItem);
      if (matchingReq) {
        setPendingPayment(matchingReq);
      } else {
        setPendingPayment(null);
      }
    }
  }, [plan]);

  useEffect(() => {
    syncAccessData();

    // Check enrollment
    const savedActivePlan = localStorage.getItem('active_plan_id');
    setTimeout(() => {
      if (plan && savedActivePlan === plan.id) {
        setEnrolledStatus(true);
      } else {
        setEnrolledStatus(false);
      }
    }, 0);
  }, [plan, syncAccessData]);

  if (!plan || !exam) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Study Plan Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We couldn&apos;t locate a roadmap matching &quot;{planSlug}&quot;.</p>
        <Link href="/study-planner">
          <Button>Back to Planners</Button>
        </Link>
      </Container>
    );
  }

  const handleOpenPayment = () => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setShowPaymentModal(true);
  };

  // Handle enrollment action
  const handleEnroll = () => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!hasAccess) {
      handleOpenPayment();
      return;
    }

    const savedActivePlanId = localStorage.getItem('active_plan_id');
    const oldPlan = mockPlans.find((p) => p.id === savedActivePlanId);

    if (oldPlan && oldPlan.examId === plan.examId && oldPlan.id !== plan.id) {
      const confirmSwitch = window.confirm(
        `You already have an active study plan ("${oldPlan.title}") for this exam. Do you want to switch to "${plan.title}"? Your old progress will be preserved but paused.`
      );
      if (!confirmSwitch) return;
    }

    localStorage.setItem('active_plan_id', plan.id);
    localStorage.setItem('simulated_role', 'student');
    router.push('/student/dashboard');
  };

  const materialsList = mockMaterials.slice(0, 3);
  const mocksList = mockMockTests.slice(0, 2);

  interface CurriculumTask {
    title: string;
    type: string;
    material?: typeof materialsList[0];
    test?: typeof mocksList[0];
  }

  interface CurriculumDay {
    dayNumber: number;
    weekNumber: number;
    title: string;
    estimatedTime: string;
    revisionNotes: string;
    tasks: CurriculumTask[];
  }

  const daysMock: CurriculumDay[] = [
    {
      dayNumber: 1,
      weekNumber: 1,
      title: 'Introduction & Core Foundations',
      estimatedTime: '2.5 Hours',
      revisionNotes: 'Revise constitutional timelines, members, and historical acts (1773-1947).',
      tasks: [
        { title: 'Read foundation notes and summaries', type: 'read', material: materialsList[0] },
        { title: 'Attempt polity beginner diagnostic quiz', type: 'quiz', test: mocksList[0] }
      ]
    },
    {
      dayNumber: 2,
      weekNumber: 1,
      title: 'Preamble & Fundamental Rights Part 1',
      estimatedTime: '3 Hours',
      revisionNotes: 'Memorize the core terminology of preamble and Articles 12-18.',
      tasks: [
        { title: 'Read Fundamental Rights notes', type: 'read', material: materialsList[1] },
        { title: 'Attempt Article 14 speed quiz', type: 'quiz', test: mocksList[1] }
      ]
    },
    {
      dayNumber: 3,
      weekNumber: 1,
      title: 'Fundamental Rights Part 2 & Duties',
      estimatedTime: '2 Hours',
      revisionNotes: 'Revise writs (Habeas Corpus, Mandamus, etc.) and Articles 19-32.',
      tasks: [
        { title: 'Read Constitutional Remedies summary', type: 'read', material: materialsList[2] },
        { title: 'Solve 10 practice questions on writs', type: 'practice' }
      ]
    }
  ];

  const weeksAccordionItems = [
    {
      id: 'week-1',
      title: 'Week 1 — Historical Background & Fundamental Rights',
      content: (
        <div className="space-y-4 pt-2">
          {daysMock.map((day) => (
            <Card key={day.dayNumber} className="border border-surface-200 bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-surface-150 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                    Day {day.dayNumber}
                  </span>
                  <h4 className="text-xs md:text-sm font-extrabold text-surface-900">{day.title}</h4>
                </div>
                <span className="text-[10px] font-bold text-surface-450 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Est: {day.estimatedTime}
                </span>
              </div>

              <div className="space-y-3.5">
                {day.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-4 text-xs font-semibold text-surface-650 bg-surface-50 p-2.5 rounded-xl border border-surface-100">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-wider text-brand-650 bg-brand-50 px-1 py-0.2 rounded mr-2">
                        {task.type}
                      </span>
                      <span>{task.title}</span>
                    </div>

                    {task.material && (
                      <Link href="/materials" className="text-[10px] font-black text-brand-650 hover:underline flex items-center gap-0.5">
                        <FileText className="h-3 w-3" /> Get PDF
                      </Link>
                    )}
                    {task.test && (
                      <Link href="/mock-tests" className="text-[10px] font-black text-orange-600 hover:underline flex items-center gap-0.5">
                        <PlayCircle className="h-3 w-3" /> Start Test
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3.5 pt-3 border-t border-surface-100 text-[10px] md:text-xs text-surface-500 font-semibold leading-relaxed">
                <span className="font-extrabold text-brand-650 uppercase tracking-wider block mb-0.5">Revision Focus:</span>
                {day.revisionNotes}
              </div>
            </Card>
          ))}
        </div>
      )
    }
  ];

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* 1. Enrollment Banner */}
      {enrolledStatus && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 text-success-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5.5 w-5.5 text-success-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold">Active Study Plan</h4>
              <p className="text-xs text-success-700 mt-0.5">You are currently following this study plan. Hit targets daily to keep your streaks alive.</p>
            </div>
          </div>
          <Link href="/student/tasks">
            <Button size="sm" variant="success" icon={<ChevronRight className="h-4 w-4" />} iconPosition="right">
              Continue Daily Checklist
            </Button>
          </Link>
        </div>
      )}

      {/* 2. Plan Hero Banner */}
      <Card className="border border-surface-200 bg-gradient-to-b from-brand-50/20 to-white p-6 md:p-8 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded">
              {exam.code} Roadmap
            </span>
            <DifficultyBadge difficulty={plan.difficulty} />
            <StatusBadge status={plan.isFree || !isPaymentModeOn ? 'free' : 'premium'} />
            {!plan.isFree && !isPaymentModeOn && (
              <span className="text-[9px] font-black uppercase bg-success-50 text-success-700 border px-2 py-0.5 rounded">
                Free Access (Payment mode OFF)
              </span>
            )}
          </div>

          <h1 className="text-xl md:text-3.5xl font-black text-surface-900 leading-snug">
            {plan.title}
          </h1>

          <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold max-w-3xl">
            {plan.description}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-6 border-t border-surface-150">
            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-brand-50 text-brand-650 rounded-xl">
                <Calendar className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[9px] text-surface-450 uppercase font-bold">Duration</p>
                <p className="text-xs md:text-sm font-extrabold text-surface-850">{plan.durationDays} Days</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-success-50 text-success-700 rounded-xl">
                <Compass className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[9px] text-surface-450 uppercase font-bold">Daily Tasks</p>
                <p className="text-xs md:text-sm font-extrabold text-surface-850">{plan.tasksCount || 90} Tasks</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                <Award className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[9px] text-surface-450 uppercase font-bold">Mock Tests</p>
                <p className="text-xs md:text-sm font-extrabold text-surface-850">{plan.mocksCount || 10} Tests</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-purple-50 text-purple-650 rounded-xl">
                <TrendingUp className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[9px] text-surface-450 uppercase font-bold">Aspirants</p>
                <p className="text-xs md:text-sm font-extrabold text-surface-850">{plan.enrolledCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {!enrolledStatus && (
              <Button onClick={handleEnroll} size="md" variant={hasAccess ? 'primary' : 'secondary'}>
                {hasAccess ? 'Start This Plan' : 'Unlock Premium Plan'}
              </Button>
            )}
            
            {pendingPayment && pendingPayment.status === 'pending' && (
              <span className="px-4 py-2.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black rounded-2xl flex items-center gap-1.5">
                <Hourglass className="h-4 w-4 animate-spin" /> Payment Request Pending Approval (UTR: {pendingPayment.upiTransactionId})
              </span>
            )}

            {pendingPayment && pendingPayment.status === 'rejected' && (
              <span className="px-4 py-2.5 bg-danger-50 border border-danger-200 text-danger-700 text-xs font-black rounded-2xl flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Request Rejected. Reason: {pendingPayment.adminNote || 'Mismatch UTR'}
              </span>
            )}

            <Link href="/community">
              <Button variant="ghost" size="md" icon={<MessageSquare className="h-4.5 w-4.5" />}>
                Join Plan Discussions
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 3. Curriculum Week Accordion */}
      <div>
        <h3 className="text-lg font-black text-surface-900 mb-4 flex items-center gap-1.5">
          <BookMarked className="h-5 w-5 text-brand-650" />
          Study Curriculum Roadmap
        </h3>

        {hasAccess ? (
          <Accordion items={weeksAccordionItems} defaultActiveId="week-1" />
        ) : (
          <Card className="text-center py-16 border border-surface-200 bg-surface-50/20 max-w-2xl mx-auto space-y-4">
            <Lock className="h-10 w-10 text-surface-300 mx-auto" />
            <h4 className="text-sm font-black text-surface-850">Premium Study Curriculum Locked</h4>
            <p className="text-xs text-surface-500 font-semibold max-w-md mx-auto leading-relaxed">
              This is a paid planner syllabus roadmap. To unlock day tasks checklist, please complete the manual UPI payment.
            </p>
            <Button onClick={handleOpenPayment} size="sm">
              Unlock with UPI
            </Button>
          </Card>
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          contentType="study_plan"
          contentId={plan.id}
          contentTitle={plan.title}
          amount={99} // Flat premium plan price for demo
          onClose={() => setShowPaymentModal(false)}
          onSubmitSuccess={() => {
            setShowPaymentModal(false);
            syncAccessData();
          }}
        />
      )}
    </Container>
  );
}
