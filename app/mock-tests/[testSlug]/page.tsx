'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockExams, mockMockTests } from '@/data/mockData';
import { MockTest } from '@/types';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Clock,
  FileQuestion,
  Award,
  CheckCircle2,
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
  params: Promise<{ testSlug: string }>;
}

export default function MockTestInstructionPage({ params }: PageProps) {
  const router = useRouter();
  const { testSlug } = use(params);
  const [test, setTest] = useState<MockTest | null>(null);

  // Payment states
  const [isPaymentModeOn, setIsPaymentModeOn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<PaymentRequest | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleOpenPayment = () => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmStart = () => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      return;
    }
    router.push(`/mock-tests/${testSlug}/start`);
  };

  const syncAccessData = useCallback(async () => {
    if (!test) return;

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

    if (!paymentMode || test.isFree) {
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

        // 1. Check access record
        const { data: access } = await supabase
          .from('user_content_access')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('content_type', 'mock_test')
          .eq('content_id', test.id)
          .maybeSingle();

        // 2. Check pending request record
        const { data: req } = await supabase
          .from('payment_requests')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('content_type', 'mock_test')
          .eq('content_id', test.id)
          .maybeSingle();

        setIsPaymentModeOn(paymentMode);
        setHasAccess(!!access);
        if (req) {
          setPendingPayment({
            id: req.id,
            user: '',
            username: '',
            contentType: 'mock_test',
            contentId: req.content_id,
            contentTitle: test.title,
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
        (a) => a.username === 'siddharth_99' && a.contentType === 'mock_test' && a.contentId === test.id
      );

      const payReqsSaved = localStorage.getItem('payment_requests_db') || '[]';
      const allReqs: PaymentRequest[] = JSON.parse(payReqsSaved);
      const matchingReq = allReqs.find(
        (r) => r.username === 'siddharth_99' && r.contentType === 'mock_test' && r.contentId === test.id
      );

      setIsPaymentModeOn(paymentMode);
      setHasAccess(ownsItem);
      if (matchingReq) {
        setPendingPayment(matchingReq);
      } else {
        setPendingPayment(null);
      }
    }
  }, [test]);

  useEffect(() => {
    let saved = localStorage.getItem('mock_tests_db');
    if (!saved) {
      localStorage.setItem('mock_tests_db', JSON.stringify(mockMockTests));
      saved = JSON.stringify(mockMockTests);
    }
    const data: MockTest[] = JSON.parse(saved);
    const item = data.find((t) => t.slug === testSlug || t.id === testSlug);
    setTimeout(() => {
      if (item) {
        setTest(item);
      }
    }, 0);
  }, [testSlug]);

  useEffect(() => {
    syncAccessData();
  }, [test, syncAccessData]);

  if (!test) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Test Profile Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We couldn&apos;t locate a mock exam matching &quot;{testSlug}&quot;.</p>
        <Link href="/mock-tests">
          <Button>Back to Mock Tests</Button>
        </Link>
      </Container>
    );
  }

  const associatedExam = mockExams.find((e) => e.id === test.examId);

  return (
    <Container size="xl" className="py-8 md:py-12 max-w-3xl">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/mock-tests" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Mock Tests
        </Link>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8">
        <div className="space-y-6">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100 uppercase">
                {associatedExam?.code || 'Govt Exam'}
              </span>
              {!test.isFree && !isPaymentModeOn && (
                <span className="text-[9px] font-black uppercase bg-success-50 text-success-700 border px-2 py-0.5 rounded">
                  Free Access (Payment mode OFF)
                </span>
              )}
            </div>
            <h1 className="text-lg md:text-2xl font-black text-surface-900 mt-2.5 leading-snug">
              {test.title}
            </h1>
            <p className="text-xs text-surface-500 font-bold uppercase mt-1">Subject Area: {test.subject}</p>
          </div>

          {/* Core metrics summary */}
          <div className="bg-surface-50 p-4 border border-surface-150 rounded-2xl grid grid-cols-3 gap-2 text-center text-xs font-bold text-surface-700">
            <div>
              <p className="text-[10px] text-surface-450 uppercase mb-1 flex items-center justify-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Duration
              </p>
              <p className="font-extrabold text-base text-brand-650">{test.durationMinutes} Mins</p>
            </div>
            <div>
              <p className="text-[10px] text-surface-450 uppercase mb-1 flex items-center justify-center gap-1">
                <FileQuestion className="h-3.5 w-3.5" /> Questions
              </p>
              <p className="font-extrabold text-base text-brand-650">{test.totalQuestions} Qs</p>
            </div>
            <div>
              <p className="text-[10px] text-surface-450 uppercase mb-1 flex items-center justify-center gap-1">
                <Award className="h-3.5 w-3.5" /> Max Marks
              </p>
              <p className="font-extrabold text-base text-brand-650">{test.totalMarks} Marks</p>
            </div>
          </div>

          {/* Test rules lists */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-xs md:text-sm font-black text-surface-850 uppercase tracking-wider">
              Standard Instructions & Regulations
            </h4>
            
            <ul className="space-y-3 pl-2 text-xs md:text-sm text-surface-600 font-semibold leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="p-0.5 bg-brand-50 text-brand-600 rounded-lg mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span>Objective Format: Each question carries four choices (A, B, C, D) with only one correct response.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="p-0.5 bg-brand-50 text-brand-600 rounded-lg mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span>Negative Marking: 1/4th of the question marks will be deducted for every incorrect response. No marks deducted for unattempted questions.</span>
              </li>
            </ul>
          </div>

          {/* Start trigger */}
          <div className="pt-4 border-t border-surface-150 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {!hasAccess && (
                <span className="text-xs text-danger-700 font-bold flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-danger-650" /> Premium Quiz Lock Active
                </span>
              )}
            </div>

            <div className="flex gap-3 items-center w-full sm:w-auto justify-end">
              {hasAccess ? (
                <Button onClick={handleConfirmStart} size="md" variant="primary" className="px-8 font-black">
                  Confirm & Start Assessment
                </Button>
              ) : (
                <div className="flex flex-wrap gap-3 items-center justify-end w-full">
                  <Button onClick={handleOpenPayment} size="md" variant="secondary">
                    Unlock with UPI (₹79)
                  </Button>

                  {pendingPayment && pendingPayment.status === 'pending' && (
                    <span className="px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black rounded-2xl flex items-center gap-1.5">
                      <Hourglass className="h-4 w-4 animate-spin" /> Pending Approval (UTR: {pendingPayment.upiTransactionId})
                    </span>
                  )}

                  {pendingPayment && pendingPayment.status === 'rejected' && (
                    <span className="px-4 py-2 bg-danger-50 border border-danger-200 text-danger-700 text-xs font-black rounded-2xl flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" /> Rejected. Reason: {pendingPayment.adminNote || 'Mismatch UTR'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </Card>

      {showPaymentModal && (
        <PaymentModal
          contentType="mock_test"
          contentId={test.id}
          contentTitle={test.title}
          amount={79} // Demo price for mock tests
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
