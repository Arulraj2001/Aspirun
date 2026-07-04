import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Toppers Strategies & Guidance Blogs | Aspirav",
  description: "Read step-by-step government exam preparation strategies, daily timetables, recommended booklets, and motivational stories from toppers.",
  alternates: {
    canonical: "/guidance"
  }
};

export default function GuidanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
