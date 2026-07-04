import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mock Tests & Sectional Quizzes | Aspirav",
  description: "Practice high-quality mock tests, daily quizzes, and sectional prep papers for UPSC CSE, SSC CGL, and IBPS PO. Analyze speed and review detailed explanations.",
  alternates: {
    canonical: "/mock-tests"
  }
};

export default function MockTestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
