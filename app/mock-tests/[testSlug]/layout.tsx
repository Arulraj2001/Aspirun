import type { Metadata } from 'next';
import { mockMockTests } from '@/data/mockData';
import { supabaseServer } from '@/lib/supabase/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ testSlug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { testSlug } = await params;

  let test: any = null;

  // Try fetching from database first
  try {
    const { data, error } = await supabaseServer
      .from('mock_tests')
      .select('*')
      .or(`slug.eq."${testSlug}",id.eq."${testSlug}"`)
      .maybeSingle();

    if (data && !error) {
      test = {
        title: data.title,
        totalQuestions: data.total_questions,
        slug: data.slug,
        subject: 'Syllabus subjects', // Placeholder since subjects are relational
      };
    }
  } catch (err) {
    console.error('Error fetching mock test metadata from Supabase:', err);
  }

  // Fallback to mock data
  if (!test) {
    const found = mockMockTests.find((t) => t.slug === testSlug || t.id === testSlug);
    if (found) {
      test = {
        title: found.title,
        totalQuestions: found.totalQuestions,
        slug: found.slug,
        subject: found.subject,
      };
    }
  }

  if (!test) {
    return {
      title: "Mock Test Practice Paper | Aspirav",
      description: "Attempt free mock tests, speed quizzes, and sectional prep papers on Aspirav.",
      alternates: {
        canonical: `/mock-tests/${testSlug}`
      }
    };
  }

  return {
    title: `${test.title} - Online Mock Test | Aspirav`,
    description: `Practice ${test.title}. Features ${test.totalQuestions} questions covering ${test.subject}, formatted with dynamic explanations and real-time score tracking.`,
    alternates: {
      canonical: `/mock-tests/${test.slug}`
    }
  };
}

export default function MockTestDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
