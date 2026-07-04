import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Study Plans & Pricing for Govt Exam Prep | Aspirav',
  description:
    'Explore Aspirav\'s affordable premium subscription plans for government exam preparation. Get full access to mock tests, PDF notes, daily study roadmaps, and priority doubt support for UPSC, SSC CGL, RRB NTPC, and IBPS PO.',
  keywords: [
    'aspirav premium plan',
    'government exam prep subscription',
    'UPSC preparation course price',
    'SSC CGL paid course India',
    'affordable exam coaching online',
    'study plan pricing India',
    'aspirav pricing',
    'government exam online course',
    'best value exam prep India',
    'IBPS PO paid course',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/pricing',
  },
  openGraph: {
    title: 'Premium Plans & Pricing — Aspirav',
    description:
      "Aspirav's affordable Pro plans give you full access to mock tests, notes, and personalized study roadmaps for government exam preparation.",
    url: 'https://www.aspirav.co.in/pricing',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
