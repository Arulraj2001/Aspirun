'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function CommunityRulesPage() {
  return (
    <Container size="md" className="py-8 md:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/community" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Forums
        </Link>
      </div>

      <Card className="border-2 border-brand-100 bg-white">
        <div className="space-y-6">
          <div className="flex gap-3 items-center">
            <span className="p-3 bg-brand-50 text-brand-650 rounded-2xl inline-flex">
              <ShieldAlert className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-surface-900 leading-snug">
                StudySetu Community Rules
              </h1>
              <p className="text-xs text-surface-450 font-bold uppercase mt-0.5">Strict safety and moderation code</p>
            </div>
          </div>

          <p className="text-xs md:text-sm text-surface-550 font-semibold leading-relaxed">
            StudySetu runs an admin-moderated serious peer environment. We enforce strict protocols. Review our 7 core guidelines below before asking doubts or posting solution replies.
          </p>

          {/* Rules lists */}
          <div className="space-y-4 pt-2">
            {[
              {
                id: 1,
                title: 'Respect Everyone',
                desc: 'Abusive language, personal attacks, discrimination, or hate speech will result in immediate and permanent account suspension.'
              },
              {
                id: 2,
                title: 'No Spam or Promotions',
                desc: 'Do not post advertising scripts, marketing materials, affiliate links, or links to external groups/channels.'
              },
              {
                id: 3,
                title: 'No Personal Contact Sharing',
                desc: 'Sharing WhatsApp groups, Telegram handles, email addresses, phone numbers, or social handles is strictly banned to preserve student safety.'
              },
              {
                id: 4,
                title: 'No Fake Exam News',
                desc: 'Do not spread rumors regarding exam dates, age limits, or vacancies. Refer only to official board notification URLs.'
              },
              {
                id: 5,
                title: 'No Paid/Pirated Material Selling',
                desc: 'Trading PDF books, paid courses, or notes files violates intellectual property rules and will lead to an immediate ban.'
              },
              {
                id: 6,
                title: 'Keep Discussions Exam-Related',
                desc: 'All questions, comments, and posts must correspond directly to preparation strategies, routine discussions, speed test performance, or syllabus questions.'
              },
              {
                id: 7,
                title: 'Admin/Moderator Decision is Final',
                desc: 'Announcements, thread lockouts, post removals, or user suspension actions carried out by StudySetu safety teams cannot be disputed.'
              }
            ].map((rule) => (
              <div key={rule.id} className="p-4 bg-surface-50 border border-surface-150 rounded-2xl flex gap-3">
                <span className="h-6 w-6 rounded-lg bg-brand-50 text-brand-650 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {rule.id}
                </span>
                <div>
                  <h3 className="text-xs md:text-sm font-black text-surface-850">{rule.title}</h3>
                  <p className="text-xs text-surface-550 leading-relaxed font-semibold mt-1">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-surface-150 flex justify-end">
            <Link href="/community">
              <Button size="sm" variant="primary">
                Return to Community Dashboard
              </Button>
            </Link>
          </div>

        </div>
      </Card>
    </Container>
  );
}
