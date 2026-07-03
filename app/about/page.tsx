import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Target, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tight">
          About <span className="text-brand-500">Aspirav</span>
        </h1>
        <p className="text-sm md:text-base text-surface-550 max-w-xl mx-auto font-semibold">
          Bridging the gap between ambitious career aspirations and daily execution.
        </p>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8 space-y-6">
        <p className="text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
          Aspirav is India&apos;s leading platform designed specifically for government exam aspirants. We specialize in structuring daily target-based study plans for exams like UPSC CSE, SSC CGL, RRB NTPC, IBPS PO, and State Constable Recruitments.
        </p>

        <h3 className="text-sm md:text-base font-black text-surface-850">Our Vision</h3>
        <p className="text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
          For millions of aspirants, passing a government exam is a life-changing milestone. However, the volume of syllabus materials can feel overwhelming. Aspirav makes the journey manageable by breaking down complex exam requirements into clear, day-by-day task lists, practice sets, and mock assessments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-surface-50 border rounded-2xl flex gap-3">
            <Target className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs md:text-sm font-black text-surface-800">Daily Execution</h4>
              <p className="text-[11px] text-surface-450 mt-1 font-semibold">Step-by-step progress tracking from Day 1 to exam morning.</p>
            </div>
          </div>

          <div className="p-4 bg-surface-50 border rounded-2xl flex gap-3">
            <Users className="h-5 w-5 text-success-650 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs md:text-sm font-black text-surface-800">Secure Community</h4>
              <p className="text-[11px] text-surface-450 mt-1 font-semibold">Discuss strategy safely without spams, bots, or toxicity.</p>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}
