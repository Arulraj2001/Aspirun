import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service & Usage Agreement | Aspirav",
  description: "Read the user agreement and platform usage rules for Aspirav students. Details concerning roadmap sharing, mock test integrity, and pro billing rules.",
  keywords: ["terms of service", "aspirav terms", "student usage rules", "billing terms agreement"],
  alternates: {
    canonical: "/terms"
  }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
