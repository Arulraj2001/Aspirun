import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Daily Study Planner for UPSC SSC RRB IBPS Preparation | Aspirav',
  description:
    'Create your personalized day-wise study plan for UPSC Civil Services, SSC CGL, RRB NTPC, and IBPS PO. Get structured syllabus roadmaps, daily checklists, and weekly revision schedules tailored to your target exam.',
  keywords: [
    'study planner for UPSC',
    'SSC CGL study plan 2025',
    'RRB NTPC daily study plan',
    'government exam study schedule',
    'aspirav study planner',
    'IBPS PO preparation plan',
    'daily study routine government exam',
    'competitive exam timetable',
    'UPSC preparation schedule',
    'free exam planner India',
    '90 day study plan SSC',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/study-planner',
  },
  openGraph: {
    title: 'Daily Study Planner for Govt Exam Prep — Aspirav',
    description:
      'Get a structured day-by-day study roadmap for UPSC, SSC CGL, RRB NTPC, and IBPS PO. Personalized syllabus tracker and daily checklists.',
    url: 'https://www.aspirav.co.in/study-planner',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function StudyPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
