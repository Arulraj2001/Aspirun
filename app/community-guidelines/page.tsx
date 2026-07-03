import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Eye, ShieldAlert, AlertOctagon } from 'lucide-react';

export default function CommunityGuidelinesPage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-surface-900 tracking-tight">
          Community Guidelines & Safety
        </h1>
        <p className="text-xs text-surface-450 font-bold">Safe & Constructive Doubt Solving Ecosytem</p>
      </div>

      <div className="bg-success-50 border border-success-150 p-4 rounded-2xl flex items-start gap-3 text-xs md:text-sm font-semibold text-success-850">
        <ShieldCheck className="h-5 w-5 text-success-650 shrink-0 mt-0.5" />
        <span>StudySetu maintains strict, zero-tolerance anti-spam policies to protect student focus. Learn how we keep this forum safe.</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Core Rules */}
        <Card className="border border-surface-200 p-6 md:p-8 space-y-4">
          <h3 className="text-sm md:text-base font-black text-surface-850 flex items-center gap-1.5 border-b pb-2">
            <Eye className="h-4.5 w-4.5 text-brand-650" />
            1. Core Community Rules
          </h3>

          <ul className="list-disc pl-5 space-y-2.5 text-xs md:text-sm text-surface-650 font-semibold leading-relaxed">
            <li>
              <strong>Academic Focus:</strong> Keep posts restricted to exam strategies, mock doubt resolutions, revision notes, or daily routine logs.
            </li>
            <li>
              <strong>No Spamming/Adverts:</strong> External commercial Telegram channel invitations, book sale links, and payment links are strictly blocked.
            </li>
            <li>
              <strong>Respectful Tone:</strong> Treat other aspirants with respect. Hateful insults, regional mocking, or abusive language will lead to immediate account bans.
            </li>
          </ul>
        </Card>

        {/* Safety Notice */}
        <Card className="border border-surface-200 p-6 md:p-8 space-y-4">
          <h3 className="text-sm md:text-base font-black text-surface-850 flex items-center gap-1.5 border-b pb-2">
            <ShieldAlert className="h-4.5 w-4.5 text-orange-600" />
            2. Safety Notice
          </h3>

          <p className="text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
            To ensure transactions safety:
            <br />
            <strong>Pay only to official merchant UPI IDs</strong> displayed explicitly inside the payment modals of this platform. Our administrators will never direct-message you to send money to private phone numbers.
          </p>
        </Card>

        {/* Reporting Policy */}
        <Card className="border border-surface-200 p-6 md:p-8 space-y-4">
          <h3 className="text-sm md:text-base font-black text-surface-850 flex items-center gap-1.5 border-b pb-2">
            <AlertOctagon className="h-4.5 w-4.5 text-danger-600" />
            3. Reporting & Moderation Policy
          </h3>

          <p className="text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
            Aspirants can flag thread posts or comments violating guidelines. 
            Once reported, the safety threshold filter notifies administrators instantly. Thread owners can lock solved strategy threads. Spam profiles are muted for 24 hours or permanently banned based on flag logs.
          </p>
        </Card>

      </div>
    </Container>
  );
}
