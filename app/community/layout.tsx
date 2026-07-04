import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Community — Doubt Clearing Forum for Govt Exam Aspirants | Aspirav',
  description:
    'Join India\'s most trusted doubt-clearing community for government exam aspirants. Ask questions, share strategies, get answers from toppers, and discuss UPSC, SSC CGL, RRB NTPC, and IBPS PO preparation.',
  keywords: [
    'UPSC doubt clearing community',
    'SSC CGL student forum',
    'government exam doubt forum',
    'aspirant community India',
    'UPSC discussion forum',
    'RRB NTPC student community',
    'aspirav community',
    'exam preparation forum',
    'ask doubt UPSC',
    'SSC doubt solving online',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/community',
  },
  openGraph: {
    title: 'Aspirant Community & Doubt Board — Aspirav',
    description:
      "India's peer learning community for UPSC, SSC, RRB, and IBPS aspirants. Ask doubts, share strategies, and learn from toppers.",
    url: 'https://www.aspirav.co.in/community',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
