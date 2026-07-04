import type { Metadata } from 'next';
import { mockExams } from '@/data/mockData';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ examSlug: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { examSlug } = await params;
  
  // Resolve exam profile
  const exam = mockExams.find((e) => e.slug === examSlug || e.id === examSlug);

  if (!exam) {
    return {
      title: "Exam Study Planners & Timetables | Aspirav",
      description: "Organize your government exam study checklists and track daily target completion milestones on Aspirav."
    };
  }

  return {
    title: `Syllabus Daily Study Planners for ${exam.name} | Aspirav`,
    description: `Access step-by-step checklists to complete the ${exam.name} syllabus. Start active daily streaks, review guidance blogs, and attempt mocks.`,
    alternates: {
      canonical: `/study-planner/${examSlug}`
    }
  };
}

export default function StudyPlannerExamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
