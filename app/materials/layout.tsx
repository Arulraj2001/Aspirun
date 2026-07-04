import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Study Materials, PDF Notes & Practice Sets for Govt Exams | Aspirav',
  description:
    'Download free study materials, PDF notes, formula sheets, and practice sets for UPSC, SSC CGL, RRB NTPC, and IBPS PO on Aspirav. Access Laxmikanth summaries, quant cheat sheets, and more.',
  keywords: [
    'free study materials government exam',
    'UPSC PDF notes download',
    'SSC CGL study material',
    'RRB NTPC notes PDF',
    'IBPS PO study material',
    'government exam PDF 2025',
    'Laxmikanth PDF summary',
    'aspirav study materials',
    'free competitive exam notes',
    'SSC quant formula sheet',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/materials',
  },
  openGraph: {
    title: 'Free Study Materials & PDF Notes — Aspirav',
    description:
      'Download free PDF notes, formula sheets, and practice sets for UPSC, SSC CGL, RRB, and IBPS PO exams. Hundreds of free materials available.',
    url: 'https://www.aspirav.co.in/materials',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function MaterialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
