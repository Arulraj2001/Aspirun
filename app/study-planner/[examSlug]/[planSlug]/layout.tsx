import type { Metadata } from 'next';
import { mockPlans } from '@/data/mockData';
import { supabaseServer } from '@/lib/supabase/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ examSlug: string; planSlug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { examSlug, planSlug } = await params;

  let plan: any = null;

  // Try fetching from database first
  try {
    const { data, error } = await supabaseServer
      .from('study_plans')
      .select('*')
      .or(`slug.eq."${planSlug}",id.eq."${planSlug}"`)
      .maybeSingle();

    if (data && !error) {
      plan = {
        title: data.title,
        durationDays: data.duration_days,
        slug: data.slug,
      };
    }
  } catch (err) {
    console.error('Error fetching study plan metadata from Supabase:', err);
  }

  // Fallback to mock data
  if (!plan) {
    const found = mockPlans.find((p) => p.slug === planSlug || p.id === planSlug);
    if (found) {
      plan = {
        title: found.title,
        durationDays: found.durationDays,
        slug: found.slug,
      };
    }
  }

  if (!plan) {
    return {
      title: "Daily Study Plan Checklist Calendar | Aspirav",
      description: "Start day-by-day organized syllabus tracking sheets to master government exams.",
      alternates: {
        canonical: `/study-planner/${examSlug}/${planSlug}`
      }
    };
  }

  return {
    title: `${plan.title} (${plan.durationDays} Days Schedule) | Aspirav`,
    description: `Enroll in the ${plan.durationDays}-day daily study planner for ${plan.title}. Includes structured task cards, PDFs, and daily practice MCQ sets.`,
    alternates: {
      canonical: `/study-planner/${examSlug}/${plan.slug}`
    }
  };
}

export default function StudyPlanDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
