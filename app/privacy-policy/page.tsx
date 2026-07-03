import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

export default function PrivacyPolicyPage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-surface-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-surface-450 font-bold">Last Updated: July 2026</p>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8 space-y-6 text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">1. Information We Collect</h3>
          <p>
            When you register on StudySetu, we collect basic details such as your name, target govt exams, qualifications, email, and billing screenshots. This is strictly used to configure your daily syllabus schedules and verify payment logs.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">2. Local Storage and Cookies</h3>
          <p>
            StudySetu relies on local web storage (`localStorage`) to synchronize progress lists, streak tallies, mock answers, and forum activities locally. Deleting browser storage data will reset local data configurations.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">3. Data Sharing Policies</h3>
          <p>
            We strictly do NOT share your personal identification, email addresses, or exam qualifications with third-party advertising companies. All data remains secure and private.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">4. Payment Integrity</h3>
          <p>
            All payment transaction screenshots and manual UTR references uploaded during access checks are strictly reviewed by verified platform administrators to approve planner enrollments.
          </p>
        </div>

        <div className="pt-4 border-t text-[11px] text-surface-450">
          For any data query or if you wish to delete your student account from our systems, please email us at support@studysetu.co.in.
        </div>
      </Card>
    </Container>
  );
}
