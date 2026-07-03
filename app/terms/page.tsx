import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

export default function TermsOfServicePage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-surface-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-surface-450 font-bold">Last Updated: July 2026</p>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8 space-y-6 text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">1. Student Registration</h3>
          <p>
            StudySetu accounts are single-user only. Registering multiple accounts to spam mock quizzes or share access links is strictly prohibited.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">2. Forum Communication Rules</h3>
          <p>
            You agree to post constructive academic questions or exam strategy papers. Any account posting spam, links redirection, or hostile/abusive messages will be muted or banned by community moderators.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">3. Manual UPI Billing Access</h3>
          <p>
            Premium study plan keys are unlocked after transaction validation by admin audit. Submitting fraudulent transaction IDs or fabricated screenshot proofs will lead to immediate account suspension.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">4. Disclaimers</h3>
          <p>
            StudySetu is an independent educational tool. We do NOT represent nor hold official affiliations with govt recruitment boards (UPSC, SSC, RRB). Syllabus timelines are targets and depend on student execution.
          </p>
        </div>

        <div className="pt-4 border-t text-[11px] text-surface-450">
          By utilizing StudySetu daily checklists, you agree to these terms of service rules.
        </div>
      </Card>
    </Container>
  );
}
