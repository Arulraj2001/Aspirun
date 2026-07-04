import type { Metadata } from 'next';
import { mockMockTests } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ testSlug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { testSlug } = await params;
  
  // Resolve mock test profile
  const test = mockMockTests.find((t) => t.slug === testSlug || t.id === testSlug);

  if (!test) {
    return {
      title: "Mock Test Practice Paper | Aspirav",
      description: "Attempt free mock tests, speed quizzes, and sectional prep papers on Aspirav."
    };
  }

  return {
    title: `${test.title} - Online Mock Test | Aspirav`,
    description: `Practice ${test.title}. Features ${test.totalQuestions} questions covering ${test.subject}, formatted with dynamic explanations and real-time score tracking.`,
    alternates: {
      canonical: `/mock-tests/${testSlug}`
    }
  };
}

export default function MockTestDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
