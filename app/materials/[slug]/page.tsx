'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockExams, mockMaterials, mockPlans } from '@/data/mockData';
import { StudyMaterial } from '@/types';
import { PaymentModal } from '@/components/payments/PaymentModal';
import {
  Calendar,
  Download,
  BookOpen,
  ArrowLeft,
  Bookmark,
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
  params: Promise<{ slug: string }>;
}

export default function MaterialDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const [material, setMaterial] = useState<StudyMaterial | null>(null);

  // Payment states
  const [isPaymentModeOn, setIsPaymentModeOn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<PaymentRequest | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!material) return;
    const savedIds: string[] = JSON.parse(localStorage.getItem('saved_materials_ids') || '[]');
    setIsSaved(savedIds.includes(material.id));
  }, [material]);

  const handleOpenPayment = () => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setShowPaymentModal(true);
  };

  const handleToggleSave = () => {
    if (!material) return;
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const savedIds: string[] = JSON.parse(localStorage.getItem('saved_materials_ids') || '[]');
    let updated: string[] = [];
    if (savedIds.includes(material.id)) {
      updated = savedIds.filter((id) => id !== material.id);
      setIsSaved(false);
      alert('Material removed from saved list.');
    } else {
      updated = [...savedIds, material.id];
      setIsSaved(true);
      alert('Material saved to your dashboard bookmarks.');
    }
    localStorage.setItem('saved_materials_ids', JSON.stringify(updated));
  };

  const syncAccessData = useCallback(() => {
    if (!material) return;

    const settingsSaved = localStorage.getItem('payment_settings');
    let paymentMode = false;
    if (settingsSaved) {
      const settings = JSON.parse(settingsSaved);
      paymentMode = settings.payment_mode === 'on';
    }

    if (!paymentMode || material.isFree) {
      setTimeout(() => {
        setIsPaymentModeOn(paymentMode);
        setHasAccess(true);
      }, 0);
      return;
    }

    const accessSaved = localStorage.getItem('user_content_access_db') || '[]';
    const accessList: UserContentAccess[] = JSON.parse(accessSaved);
    const ownsItem = accessList.some(
      (a) => a.username === 'siddharth_99' && a.contentType === 'material' && a.contentId === material.id
    );

    const payReqsSaved = localStorage.getItem('payment_requests_db') || '[]';
    const allReqs: PaymentRequest[] = JSON.parse(payReqsSaved);
    const matchingReq = allReqs.find(
      (r) => r.username === 'siddharth_99' && r.contentType === 'material' && r.contentId === material.id
    );

    setTimeout(() => {
      setIsPaymentModeOn(paymentMode);
      setHasAccess(ownsItem);
      if (matchingReq) {
        setPendingPayment(matchingReq);
      } else {
        setPendingPayment(null);
      }
    }, 0);
  }, [material]);

  useEffect(() => {
    let saved = localStorage.getItem('materials_db');
    if (!saved) {
      localStorage.setItem('materials_db', JSON.stringify(mockMaterials));
      saved = JSON.stringify(mockMaterials);
    }
    const data: StudyMaterial[] = JSON.parse(saved);
    const item = data.find((m) => m.slug === slug || m.id === slug);
    setTimeout(() => {
      if (item) {
        setMaterial(item);
      }
    }, 0);
  }, [slug]);

  useEffect(() => {
    syncAccessData();
  }, [material, syncAccessData]);

  if (!material) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Material Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We couldn&apos;t locate a handout matching &quot;{slug}&quot;.</p>
        <Link href="/materials">
          <Button>Back to Catalog</Button>
        </Link>
      </Container>
    );
  }

  const associatedExam = mockExams.find((e) => e.id === material.examId);
  const relatedPlans = mockPlans.filter((p) => p.examId === material.examId).slice(0, 2);
  const hasPDF = material.url && material.url.toLowerCase().endsWith('.pdf');

  const defaultContent = `
    <h3>1. Introduction & Overview</h3>
    <p>This study handout provides high-yield concepts, core definitions, and memory mappings for civil services and government competitive exams in India. Read the notes systematically and highlight primary keywords to maximize retention.</p>
  `;

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/materials" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Handouts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Handout Reading Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-surface-200">
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
              <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
                {material.category}
              </span>
              <div className="flex items-center gap-2">
                <StatusBadge status={material.isFree || !isPaymentModeOn ? 'free' : 'premium'} />
                {!material.isFree && !isPaymentModeOn && (
                  <span className="text-[9px] font-black uppercase bg-success-50 text-success-700 border px-2 py-0.5 rounded">
                    Free Access (Payment mode OFF)
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-xl md:text-3.5xl font-black text-surface-900 tracking-tight leading-snug">
              {material.title}
            </h1>

            {/* Metadata attributes */}
            <div className="flex flex-wrap gap-4 text-xs font-bold text-surface-450 border-y border-surface-150 py-3.5 mt-4 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Last Updated: {material.updatedAt || 'July 3, 2026'}
              </span>
              <span>&bull;</span>
              <span>Exam: {associatedExam?.name || 'Govt Exams'}</span>
              <span>&bull;</span>
              <span>Subject: {material.subject}</span>
            </div>

            {/* Save notes button */}
            <div className="mb-6">
              <Button
                variant={isSaved ? 'success' : 'outline'}
                size="sm"
                onClick={handleToggleSave}
                icon={<Bookmark className="h-4 w-4" />}
              >
                {isSaved ? 'Saved to Bookmarks' : 'Save Notes to Bookmarks'}
              </Button>
            </div>

            {hasAccess ? (
              <>
                {/* Content view body */}
                <div 
                  className="prose max-w-none text-xs md:text-sm font-semibold text-surface-650 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: material.content || defaultContent }}
                />

                {/* PDF attachment button block */}
                {hasPDF && (
                  <div className="mt-8 p-4 bg-brand-50/20 border border-brand-100 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 items-center">
                      <Bookmark className="h-5.5 w-5.5 text-brand-650" />
                      <div>
                        <h4 className="text-xs md:text-sm font-black text-surface-850">Reference Document Attached</h4>
                        <p className="text-[10px] text-surface-450 mt-0.5 font-bold uppercase">Size: {material.sizeOrDuration}</p>
                      </div>
                    </div>
                    <a href={material.url} download className="w-full sm:w-auto">
                      <Button variant="primary" size="sm" className="w-full justify-center flex items-center gap-1">
                        <Download className="h-4 w-4" /> Download PDF Notes
                      </Button>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center border-t space-y-4">
                <Lock className="h-10 w-10 text-surface-300 mx-auto" />
                <h4 className="text-sm font-black text-surface-850">Premium Notes Locked</h4>
                <p className="text-xs text-surface-500 font-semibold max-w-md mx-auto leading-relaxed">
                  This study guide contains premium guidelines notes and practice sheets. Please unlock via manual UPI verification.
                </p>
                <div className="flex flex-col items-center gap-3">
                  <Button onClick={handleOpenPayment} size="sm">
                    Unlock with UPI (₹49)
                  </Button>

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
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Related Study Plans */}
          <Card className="border border-surface-200">
            <h3 className="text-sm font-black text-surface-850 mb-4 flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-brand-650" />
              Associated Study Planners
            </h3>
            <div className="space-y-3">
              {relatedPlans.map((plan) => (
                <div key={plan.id} className="p-3 bg-surface-50 rounded-xl border border-surface-150 flex flex-col gap-2">
                  <h4 className="text-xs font-black text-surface-850 leading-snug line-clamp-1">{plan.title}</h4>
                  <Link href={`/study-planner/${associatedExam?.slug}/${plan.slug}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black justify-center w-full">
                      View Planner Roadmap
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

      {showPaymentModal && (
        <PaymentModal
          contentType="material"
          contentId={material.id}
          contentTitle={material.title}
          amount={49} // Demo price for materials
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
