import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Disclaimer & Platform Terms | Aspirav",
  description: "Read the official disclaimer for Aspirav study platform. Understand our content licensing, mock test accuracies, and official sources affiliation status.",
  keywords: ["aspirav disclaimer", "study material accuracy", "upsc mock disclaimer"],
  alternates: {
    canonical: "/disclaimer"
  }
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
