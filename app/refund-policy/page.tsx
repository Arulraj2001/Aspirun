import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

export default function RefundPolicyPage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-surface-900 tracking-tight">
          Refund Policy
        </h1>
        <p className="text-xs text-surface-450 font-bold">Last Updated: July 2026</p>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8 space-y-6 text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">1. No-Refund Commitment</h3>
          <p>
            Due to the downloadable nature of study plan syllabus PDFs and practice worksheets guides, all successful payments approved by the system are final and strictly non-refundable.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">2. Double Deduction Errors</h3>
          <p>
            If your UPI account was debited multiple times for a single purchase due to network gateway timeouts, the extra amount will be automatically reversed to your bank source account within 3 to 5 business days.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">3. Dispute Resolution Support</h3>
          <p>
            For any double payment issues or verification delays, please email support@aspirav.co.in with bank deduction summaries.
          </p>
        </div>

        <div className="pt-4 border-t text-[11px] text-surface-450">
          We thank you for supporting the study community.
        </div>
      </Card>
    </Container>
  );
}
