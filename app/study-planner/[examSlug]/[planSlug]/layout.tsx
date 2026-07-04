import type { Metadata } from 'next';
import { mockPlans } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ examSlug: string; planSlug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { examSlug, planSlug } = await params;
  
  // Resolve study plan profile
  const plan = mockPlans.find((p) => p.slug === planSlug || p.id === planSlug);

  if (!plan) {
    return {
      title: "Daily Study Plan Checklist Calendar | Aspirav",
      description: "Start day-by-day organized syllabus tracking sheets to master government exams."
    };
  }

  return {
    title: `${plan.title} (${plan.durationDays} Days Schedule) | Aspirav`,
    description: `Enroll in the ${plan.durationDays}-day daily study planner for ${plan.title}. Includes structured task cards, PDFs, and daily practice MCQ sets.`,
    alternates: {
      canonical: `/study-planner/${examSlug}/${planSlug}`
    }
  };
}

export default function StudyPlanDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
