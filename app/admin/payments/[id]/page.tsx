'use client';

import React, { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface PaymentRequest {
  id: string;
  user: string;
  username: string;
  userId: string; // Keep user_id to insert into user_content_access
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

interface UserContentAccess {
  username: string;
  contentType: 'study_plan' | 'material' | 'mock_test';
  contentId: string;
}

export default function AdminPaymentDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const [request, setRequest] = useState<PaymentRequest | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(true);

  const syncRequestData = useCallback(async () => {
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { data: item, error } = await supabase
          .from('payment_requests')
          .select('*, profiles:user_id(id, full_name, username)')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;

        if (item) {
          // Resolve content title based on type
          let itemTitle = `Content Access: ${item.content_id}`;
          if (item.content_type === 'plan') {
            const { data } = await supabase.from('study_plans').select('name').eq('id', item.content_id).maybeSingle();
            if (data) itemTitle = data.name;
          } else if (item.content_type === 'mock_test') {
            const { data } = await supabase.from('mock_tests').select('title').eq('id', item.content_id).maybeSingle();
            if (data) itemTitle = data.title;
          } else if (item.content_type === 'material') {
            const { data } = await supabase.from('materials').select('title').eq('id', item.content_id).maybeSingle();
            if (data) itemTitle = data.title;
          }

          const profile = item.profiles as any;

          setRequest({
            id: item.id,
            user: profile?.full_name || 'Anonymous User',
            username: profile?.username || 'anonymous',
            userId: item.user_id,
            contentType: item.content_type === 'plan' ? 'study_plan' : item.content_type,
            contentId: item.content_id,
            contentTitle: itemTitle,
            amount: Number(item.amount),
            upiTransactionId: item.upi_transaction_id,
            screenshot: item.screenshot_url || undefined,
            notes: item.notes || undefined,
            status: item.status,
            adminNote: item.admin_note || '',
            dateCreated: item.created_at
          });
          setAdminNote(item.admin_note || '');
        }
      } catch (err) {
        console.error("Failed to fetch detailed payment request:", err);
      } finally {
        setLoading(false);
      }
    } else {
      const saved = localStorage.getItem('payment_requests_db') || '[]';
      const allReqs: PaymentRequest[] = JSON.parse(saved);
      const found = allReqs.find((r) => r.id === id);

      if (found) {
        setRequest(found);
        setAdminNote(found.adminNote || '');
      }
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    syncRequestData();
  }, [id, syncRequestData]);

  const handleApprove = async () => {
    if (!request) return;
    if (!confirm('Are you sure you want to APPROVE this payment? This will immediately unlock content access for the student.')) {
      return;
    }

    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert('Verification session expired. Please sign in again.');
          return;
        }

        const dbContentType = request.contentType === 'study_plan' ? 'plan' : request.contentType;

        // 1. Update request record
        const { error: updateError } = await supabase
          .from('payment_requests')
          .update({
            status: 'approved',
            admin_note: adminNote,
            reviewed_by: session.user.id,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', id);

        if (updateError) throw updateError;

        // 2. Grant access record (on conflict do nothing)
        const { error: accessError } = await supabase
          .from('user_content_access')
          .insert({
            user_id: request.userId,
            content_type: dbContentType,
            content_id: request.contentId,
            granted_by: session.user.id
          });

        if (accessError && !accessError.message.includes('unique') && accessError.code !== '23505') {
          throw accessError;
        }

        alert('Payment approved. Premium access keys successfully granted.');
        router.push('/admin/payments');
      } catch (err: any) {
        console.error("Approval flow failed:", err);
        alert(`Failed to approve payment request: ${err.message}`);
      }
    } else {
      // Simulation mode
      const saved = localStorage.getItem('payment_requests_db') || '[]';
      const allReqs: PaymentRequest[] = JSON.parse(saved);
      const updatedReqs = allReqs.map((r) => {
        if (r.id === id) {
          return { ...r, status: 'approved', adminNote };
        }
        return r;
      });
      localStorage.setItem('payment_requests_db', JSON.stringify(updatedReqs));

      // Create user content access row
      const savedAccess = localStorage.getItem('user_content_access_db') || '[]';
      const allAccess: UserContentAccess[] = JSON.parse(savedAccess);
      const alreadyOwns = allAccess.some(
        (a) => a.username === request.username && a.contentType === request.contentType && a.contentId === request.contentId
      );

      if (!alreadyOwns) {
        allAccess.push({
          username: request.username,
          contentType: request.contentType,
          contentId: request.contentId
        });
        localStorage.setItem('user_content_access_db', JSON.stringify(allAccess));
      }

      alert('Payment approved. Premium access keys successfully granted.');
      router.push('/admin/payments');
    }
  };

  const handleReject = async () => {
    if (!request) return;
    if (!adminNote.trim()) {
      alert('Please provide an administrative note explaining the rejection reason (e.g. invalid UTR number).');
      return;
    }
    if (!confirm('Are you sure you want to REJECT this payment request?')) {
      return;
    }

    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert('Verification session expired. Please sign in again.');
          return;
        }

        const { error } = await supabase
          .from('payment_requests')
          .update({
            status: 'rejected',
            admin_note: adminNote,
            reviewed_by: session.user.id,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;

        alert('Payment request marked as rejected.');
        router.push('/admin/payments');
      } catch (err: any) {
        console.error("Rejection flow failed:", err);
        alert(`Failed to reject request: ${err.message}`);
      }
    } else {
      // Simulation mode
      const saved = localStorage.getItem('payment_requests_db') || '[]';
      const allReqs: PaymentRequest[] = JSON.parse(saved);
      const updatedReqs = allReqs.map((r) => {
        if (r.id === id) {
          return { ...r, status: 'rejected', adminNote };
        }
        return r;
      });
      localStorage.setItem('payment_requests_db', JSON.stringify(updatedReqs));

      alert('Payment request marked as rejected.');
      router.push('/admin/payments');
    }
  };

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-bold">Syncing transaction file...</p>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Request Not Found</h3>
        <Link href="/admin/payments">
          <Button>Back to Queue</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 max-w-4xl space-y-6">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/payments" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Queue
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Verify Transaction ID
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Compare UTR references with bank statements.
          </p>
        </div>

        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border ${
          request.status === 'pending'
            ? 'bg-orange-50 border-orange-200 text-orange-700'
            : request.status === 'approved'
            ? 'bg-success-50 border-success-200 text-success-700'
            : 'bg-danger-50 border-danger-200 text-danger-700'
        }`}>
          Status: {request.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Columns: request details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-surface-200">
            <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4 border-b pb-2 flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-brand-650" /> Student & Content Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-surface-650">
              <div>
                <p className="text-[10px] text-surface-400 font-bold uppercase">Aspirant Profile</p>
                <p className="text-surface-900 font-black mt-0.5">{request.user} (@{request.username})</p>
              </div>
              <div>
                <p className="text-[10px] text-surface-400 font-bold uppercase">Date Submitted</p>
                <p className="text-surface-900 font-black mt-0.5">{new Date(request.dateCreated).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-[10px] text-surface-400 font-bold uppercase">Requested Item</p>
                <p className="text-surface-900 font-black mt-0.5 capitalize">{request.contentType.replace('_', ' ')}: {request.contentTitle}</p>
              </div>
              <div>
                <p className="text-[10px] text-surface-400 font-bold uppercase">Billing Cost</p>
                <p className="text-brand-650 font-black text-sm mt-0.5">₹{request.amount}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-xs font-semibold text-surface-650">
              <p className="text-[10px] text-surface-400 font-bold uppercase">Official UPI UTR / Transaction ID</p>
              <p className="text-base text-surface-900 font-black tracking-wider mt-1 select-all bg-surface-50 p-2.5 border rounded-xl w-fit">
                {request.upiTransactionId}
              </p>
            </div>

            {request.notes && (
              <div className="mt-6 pt-4 border-t text-xs font-semibold text-surface-650">
                <p className="text-[10px] text-surface-400 font-bold uppercase">Student Notes</p>
                <p className="text-surface-700 italic mt-1 bg-surface-50/50 p-3 rounded-xl border">
                  &ldquo;{request.notes}&rdquo;
                </p>
              </div>
            )}
          </Card>

          {/* Screenshot Upload panel */}
          <Card className="border border-surface-200">
            <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4 border-b pb-2">
              Attached Payment Screenshot
            </h3>

            {request.screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={request.screenshot} alt="Payment screenshot" className="max-w-full rounded-2xl border" />
            ) : (
              <div className="py-12 text-center bg-surface-50 border rounded-2xl text-xs text-surface-400 font-bold italic">
                No screenshot uploaded. Verified manually via transaction ID (UTR).
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Decisions block */}
        <div className="md:col-span-1">
          <Card className="border border-surface-200 sticky top-4">
            <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4 border-b pb-2">
              Audit Actions
            </h3>

            <div className="space-y-4">
              <Textarea
                label="Admin Audit Note / Feedback"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Verified with bank statement or 'Incorrect UTR. Transaction rejected.'"
                rows={4}
              />

              {request.status === 'pending' ? (
                <div className="space-y-3.5 pt-2">
                  <Button
                    onClick={handleApprove}
                    variant="success"
                    className="w-full justify-center"
                    icon={<CheckCircle className="h-4.5 w-4.5" />}
                  >
                    Approve Payment
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="danger"
                    className="w-full justify-center"
                    icon={<XCircle className="h-4.5 w-4.5" />}
                  >
                    Reject Payment
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-surface-50 border rounded-2xl text-[11px] font-semibold text-surface-500 flex items-start gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-surface-400 shrink-0 mt-0.5" />
                  <p>
                    Audit completed. Status cannot be modified once marked {request.status}. Note logged: &ldquo;{request.adminNote || 'None'}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </Container>
  );
}
