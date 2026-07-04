import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Aspirav Support & Helpline",
  description: "Have questions about your daily study targets, mock test attempts, or billing transactions? Contact the Aspirav support team or access our billing helpline.",
  keywords: ["contact aspirav", "aspirav support", "aspirav whatsapp helpline", "study planner support"],
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
