import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import AlertProvider from "@/components/providers/AlertProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aspirav | Exam-wise Daily Study Planner & Doubts Board",
    template: "%s | Aspirav"
  },
  description: "India's leading exam-wise daily study planner and peer doubts-clearing community for UPSC, SSC CGL, RRB NTPC, and IBPS PO government exam aspirants. Master your goals day by day.",
  keywords: ["Aspirav", "Study Planner", "Exam preparation", "UPSC daily targets", "SSC CGL planner", "Government exam quiz", "Doubt solving community", "Toppers strategy blogs", "Syllabus tracking sheets"],
  metadataBase: new URL("https://www.aspirav.co.in"),
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.aspirav.co.in",
    siteName: "Aspirav",
    title: "Aspirav - Exam-wise Daily Study Planner",
    description: "Daily target-based study planner and secure community for UPSC, SSC, Bank, and Railway aspirants."
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-surface-900" style={{ backgroundColor: 'var(--page-bg)' }}>
        <Header />
        {/* pb-20 on mobile ensures bottom nav does not block page content */}
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <AlertProvider />
      </body>
    </html>
  );
}
