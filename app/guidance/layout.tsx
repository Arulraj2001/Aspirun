import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toppers Strategy & Guidance Blogs for Govt Exams | Aspirav',
  description:
    'Read expert guidance blogs, topper strategies, daily study routines, and proven exam tips for UPSC, SSC CGL, RRB NTPC, and IBPS PO by Aspirav. Trusted advice from top scorers and mentors to help you crack government exams faster.',
  keywords: [
    'UPSC guidance blogs',
    'SSC CGL topper strategy',
    'government exam tips',
    'study routine for government exams',
    'IAS preparation guide',
    'exam study plan blogs',
    'how to crack UPSC',
    'SSC preparation tips India',
    'aspirav guidance',
    'government exam strategy 2025',
    'RRB NTPC preparation tips',
    'IBPS PO study guide',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/guidance',
  },
  openGraph: {
    title: 'Exam Guidance & Toppers Strategy — Aspirav',
    description:
      "Expert blogs on UPSC, SSC, RRB, and IBPS preparation strategies, study routines, and time management techniques by India's top aspirants.",
    url: 'https://www.aspirav.co.in/guidance',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function GuidanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
