import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Payment Terms & Verification Policy | Aspirav",
  description: "Learn about the manual UPI verification workflow, payment request logs, transaction ID guidelines, and Pro subscription activation criteria on Aspirav.",
  keywords: ["payment policy", "manual upi verification", "payment requests", "pro activation billing"],
  alternates: {
    canonical: "/payment-policy"
  }
};

export default function PaymentPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
