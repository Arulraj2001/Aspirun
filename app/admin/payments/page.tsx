'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface PaymentRequest {
  id: string;
  user: string;
  username: string;
  contentType: 'study_plan' | 'material' | 'mock_test' | 'subscription';
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

export default function AdminPaymentsPage() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    const loadRequests = async () => {
      if (isConfigured) {
        try {
          // 1. Fetch study items caches to resolve titles
          const [plansRes, testsRes, matsRes] = await Promise.all([
            supabase.from('study_plans').select('id, name'),
            supabase.from('mock_tests').select('id, title'),
            supabase.from('materials').select('id, title')
          ]);

          const titleMap: Record<string, string> = {};
          plansRes.data?.forEach(p => { titleMap[p.id] = p.name; });
          testsRes.data?.forEach(t => { titleMap[t.id] = t.title; });
          matsRes.data?.forEach(m => { titleMap[m.id] = m.title; });

          // 2. Fetch all payment requests with profiles join
          const { data, error } = await supabase
            .from('payment_requests')
            .select(`
              *,
              profiles:user_id (
                full_name,
                username
              )
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data) {
            const mapped: PaymentRequest[] = data.map((item) => {
              const profile = item.profiles as any;
              return {
                id: item.id,
                user: profile?.full_name || 'Anonymous User',
                username: profile?.username || 'anonymous',
                contentType: item.content_type === 'plan' ? 'study_plan' : item.content_type,
                contentId: item.content_id,
                contentTitle: titleMap[item.content_id] || `Content Access: ${item.content_id}`,
                amount: Number(item.amount),
                upiTransactionId: item.upi_transaction_id,
                screenshot: item.screenshot_url || undefined,
                notes: item.notes || undefined,
                status: item.status,
                adminNote: item.admin_note || '',
                dateCreated: item.created_at
              };
            });
            setRequests(mapped);
          }
        } catch (err) {
          console.error("Failed to query live payment requests:", err);
        } finally {
          setLoading(false);
        }
      } else {
        // Simulation Fallback
        const saved = localStorage.getItem('payment_requests_db');
        let data: PaymentRequest[] = [];
        if (saved) {
          data = JSON.parse(saved);
        } else {
          data = [
            {
              id: 'pay-seed-1',
              user: 'Siddharth Mishra',
              username: 'siddharth_99',
              contentType: 'study_plan',
              contentId: 'plan-upsc-polity-30',
              contentTitle: 'UPSC CSE Polity 30-Day Masterplan',
              amount: 99,
              upiTransactionId: '617283940123',
              notes: 'Completed UPI transfer. Please approve.',
              status: 'pending',
              adminNote: '',
              dateCreated: new Date().toISOString()
            }
          ];
          localStorage.setItem('payment_requests_db', JSON.stringify(data));
        }
        setRequests(data);
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back to dashboard */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Billing Verification Queue
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Audit manual UPI transactions, verify UTR screenshot attachments, and grant premium access.
          </p>
        </div>

        <Link href="/admin/settings/payment">
          <Button size="sm" variant="outline" className="text-surface-700 hover:bg-surface-50">
            Configure Gate Settings
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 overflow-x-auto gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as 'all' | 'pending' | 'approved' | 'rejected')}
            className={`pb-4 text-xs font-black px-4 uppercase border-b-2 transition-colors cursor-pointer ${
              filterStatus === status
                ? 'border-brand-600 text-brand-650'
                : 'border-transparent text-surface-450 hover:text-surface-800'
            }`}
          >
            {status} ({status === 'all' ? requests.length : requests.filter((r) => r.status === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold animate-pulse">Syncing verification files...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <HelpCircle className="h-10 w-10 text-surface-300 mx-auto mb-2" />
          <p className="text-xs text-surface-450 font-semibold italic">No billing submissions match this status index.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <Card key={req.id} className="border border-surface-200 hover:border-brand-200 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-1.5 py-0.2 rounded">
                      {req.contentType.replace('_', ' ')}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded border ${
                      req.status === 'pending'
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : req.status === 'approved'
                        ? 'bg-success-50 border-success-200 text-success-700'
                        : 'bg-danger-50 border-danger-200 text-danger-700'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h3 className="text-xs md:text-sm font-black text-surface-850 leading-snug">
                    {req.contentTitle}
                  </h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-surface-450 font-bold uppercase mt-2">
                    <p>User: {req.user} (@{req.username})</p>
                    <p>&bull;</p>
                    <p>Amount: ₹{req.amount}</p>
                    <p>&bull;</p>
                    <p>UTR: {req.upiTransactionId}</p>
                  </div>
                </div>

                <div className="flex justify-end w-full md:w-auto shrink-0">
                  <Link href={`/admin/payments/${req.id}`}>
                    <Button size="sm" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
                      Audit Request
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
