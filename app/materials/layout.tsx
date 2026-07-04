import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Study Materials, PDF Notes & Practice Sets | Aspirav",
  description: "Download UPSC Laxmikanth summaries, SSC CGL quant cheat sheets, RRB NTPC formulas, and public bank officer PDFs on Aspirav.",
  alternates: {
    canonical: "/materials"
  }
};

export default function MaterialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
