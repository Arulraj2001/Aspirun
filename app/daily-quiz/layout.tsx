import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Daily Quiz for UPSC SSC RRB IBPS 2025 | Aspirav',
  description:
    'Attempt Aspirav\'s free daily quiz with 10 questions covering current affairs, general knowledge, reasoning, and quantitative aptitude for UPSC, SSC CGL, RRB NTPC, and IBPS PO preparation. New questions every day.',
  keywords: [
    'free daily quiz UPSC',
    'daily quiz SSC CGL 2025',
    'GK quiz for government exam',
    'current affairs quiz today',
    'aspirav daily quiz',
    'online quiz for bank exam',
    'RRB NTPC daily quiz',
    'daily mcq quiz India',
    'competitive exam quiz online',
    'government exam practice questions',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/daily-quiz',
  },
  openGraph: {
    title: "Today's Free Daily Quiz for Govt Exams — Aspirav",
    description:
      'New 10-question daily quiz every day covering current affairs, GK, reasoning, and quant for UPSC, SSC, RRB, and Bank exams.',
    url: 'https://www.aspirav.co.in/daily-quiz',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function DailyQuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
