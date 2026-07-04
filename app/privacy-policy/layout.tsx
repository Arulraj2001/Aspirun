import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection | Aspirav",
  description: "Learn how Aspirav collects, safeguards, and processes student profile details, test scores, study progress checklists, and billing records.",
  keywords: ["privacy policy", "data protection", "student profile privacy", "aspirav privacy code"],
  alternates: {
    canonical: "/privacy-policy"
  }
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
