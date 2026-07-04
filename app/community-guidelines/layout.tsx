import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Community Guidelines & Forum Conduct | Aspirav",
  description: "Review safety regulations, peer conduct expectations, study room etiquette, and content moderation rules for the Aspirav peer doubts-clearing forum.",
  keywords: ["community guidelines", "forum safety rules", "study setu community rules", "moderation criteria"],
  alternates: {
    canonical: "/community-guidelines"
  }
};

export default function CommunityGuidelinesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
