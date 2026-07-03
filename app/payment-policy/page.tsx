import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

export default function PaymentPolicyPage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-surface-900 tracking-tight">
          Payment Policy
        </h1>
        <p className="text-xs text-surface-450 font-bold">Last Updated: July 2026</p>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8 space-y-6 text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">1. Manual UPI Reference Check</h3>
          <p>
            StudySetu supports manual payment locks utilizing merchant QR codes. Aspirants submit proof of payments by entering the unique 12-digit transaction ID (UTR number) and uploading screenshots.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">2. Processing Timeframes</h3>
          <p>
            Submitted payment requests are reviewed manually by our administration team. Activation typically takes between 15 minutes to 4 hours.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">3. Integrity Verification</h3>
          <p>
            UTR numbers are cross-referenced with bank account ledger records. Entering duplicate, simulated, or wrong UTR numbers blocks user accounts from billing centers.
          </p>
        </div>

        <div className="pt-4 border-t text-[11px] text-surface-450">
          Payment issues? WhatsApp support line at +91 98765 43210.
        </div>
      </Card>
    </Container>
  );
}
