import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Daily Current Affairs & GK News Cards | Aspirav",
  description: "Get daily compiled current affairs, national and international news summaries, economy reports, and sports achievements for competitive exam GK sections.",
  alternates: {
    canonical: "/current-affairs"
  }
};

export default function CurrentAffairsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
