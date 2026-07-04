import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Aspirav",
  description: "Official cancellation and refund policy for Aspirav Pro subscriptions, UPI billing requests, manual verification terms, and customer resolution timings.",
  keywords: ["refund policy", "aspirav refunds", "billing refund", "pro upgrade cancellation"],
  alternates: {
    canonical: "/refund-policy"
  }
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
