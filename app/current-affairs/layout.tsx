import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Current Affairs for UPSC SSC RRB 2025 | Aspirav',
  description:
    'Get today\'s daily current affairs, national and international news digests, economy updates, science & technology news, and sports highlights for UPSC, SSC CGL, RRB NTPC, and IBPS PO preparation.',
  keywords: [
    'daily current affairs 2025',
    'current affairs for UPSC',
    'today current affairs SSC',
    'GK news for government exam',
    'current affairs RRB NTPC',
    'national news for competitive exam',
    'current affairs quiz India',
    'aspirav current affairs',
    'daily GK digest',
    'economy news for bank exam',
    'international affairs for UPSC',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/current-affairs',
  },
  openGraph: {
    title: 'Daily Current Affairs & GK News — Aspirav',
    description:
      "Today's current affairs news digest for UPSC, SSC, RRB, and Bank exams. National, international, economy, and sports updates.",
    url: 'https://www.aspirav.co.in/current-affairs',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

export default function CurrentAffairsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
