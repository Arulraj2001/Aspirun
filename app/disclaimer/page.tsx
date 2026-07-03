import React from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

export default function DisclaimerPage() {
  return (
    <Container size="md" className="py-8 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-black text-surface-900 tracking-tight">
          Disclaimer
        </h1>
        <p className="text-xs text-surface-450 font-bold">Last Updated: July 2026</p>
      </div>

      <Card className="border border-surface-200 p-6 md:p-8 space-y-6 text-xs md:text-sm text-surface-650 leading-relaxed font-semibold">
        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">No Government Affiliation</h3>
          <p>
            Aspirav is an independent private educational portal. We are NOT associated, affiliated, endorsed by, or in any way officially connected with the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Board (RRB), Institute of Banking Personnel Selection (IBPS), or any state police recruitment board or state government.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">Accuracy of Syllabus Data</h3>
          <p>
            All study schedule plans, daily task checklists, subject guides, and mock tests are constructed as benchmark guides based on past notification syllabus guidelines. For official exam dates, details, and notification declarations, aspirants should reference government websites.
          </p>
        </div>

        <div>
          <h3 className="text-sm md:text-base font-black text-surface-850 mb-2">Study Outcome Results</h3>
          <p>
            Enrolling in study plans or attempting mock tests does not guarantee qualifying recruitment exams. Personal results vary depending on execution speed and individual learning dedication.
          </p>
        </div>

        <div className="pt-4 border-t text-[11px] text-surface-450">
          Official references: Union Public Service Commission (upsc.gov.in), Staff Selection Commission (ssc.gov.in).
        </div>
      </Card>
    </Container>
  );
}
