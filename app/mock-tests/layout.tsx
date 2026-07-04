import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Mock Tests for UPSC SSC CGL RRB IBPS | Aspirav',
  description:
    'Attempt free full-length mock tests, sectional quizzes, and topic-wise practice tests for UPSC CSE, SSC CGL, RRB NTPC, and IBPS PO. Detailed solutions and performance analytics included.',
  keywords: [
    'free mock tests UPSC',
    'SSC CGL mock test 2025',
    'RRB NTPC practice test',
    'IBPS PO full test series',
    'government exam online test',
    'aspirav mock test',
    'free prelims test series',
    'online mock test India',
    'SSC CGL tier 1 mock',
    'UPSC prelims practice test',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/mock-tests',
  },
  openGraph: {
    title: 'Free Mock Tests & Practice Quizzes — Aspirav',
    description:
      'Attempt free full-length and sectional mock tests for UPSC, SSC, RRB, and IBPS exams with detailed analytics and explanations.',
    url: 'https://www.aspirav.co.in/mock-tests',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function MockTestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
