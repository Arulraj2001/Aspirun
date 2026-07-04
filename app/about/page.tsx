import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Target, Users, BookOpen, Award, Globe, TrendingUp, CheckCircle2, Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Aspirav — India\'s Trusted Govt Exam Preparation Platform',
  description:
    'Learn about Aspirav — India\'s trusted daily study planner and peer doubt-clearing community for UPSC, SSC CGL, RRB NTPC, and IBPS PO aspirants. Our mission, vision, and the team behind your exam success.',
  keywords: [
    'about aspirav',
    'government exam platform India',
    'UPSC preparation platform',
    'study planner for government exams',
    'aspirav mission',
    'online exam prep India',
    'trusted government exam coaching',
  ],
  alternates: {
    canonical: 'https://www.aspirav.co.in/about',
  },
  openGraph: {
    title: 'About Aspirav — India\'s Govt Exam Preparation Platform',
    description:
      "Learn about Aspirav's mission to help 85,000+ aspirants crack UPSC, SSC, RRB, and Bank exams through structured daily study plans.",
    url: 'https://www.aspirav.co.in/about',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Aspirav',
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aspirav',
  url: 'https://www.aspirav.co.in',
  logo: 'https://www.aspirav.co.in/logo.png',
  description:
    "India's leading daily study planner and peer doubt-clearing community for government exam aspirants preparing for UPSC, SSC CGL, RRB NTPC, and IBPS PO.",
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@aspirav.co.in',
  },
};

const STATS = [
  { value: '85,000+', label: 'Active Aspirants', icon: Users, color: 'text-brand-600 bg-brand-50' },
  { value: '500+', label: 'Study Resources', icon: BookOpen, color: 'text-success-600 bg-success-50' },
  { value: '4 Exams', label: 'Fully Covered', icon: Award, color: 'text-orange-600 bg-orange-50' },
  { value: '100%', label: 'Free Core Access', icon: Heart, color: 'text-red-600 bg-red-50' },
];

const VALUES = [
  {
    icon: Target,
    title: 'Structured Learning',
    desc: 'We break down overwhelming syllabi into manageable daily targets, so you always know exactly what to study and when.',
  },
  {
    icon: Users,
    title: 'Peer Community',
    desc: 'A moderated doubt-clearing forum where students support each other, share strategies, and celebrate milestones together.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Trusted',
    desc: 'Zero spam, strict community guidelines, and transparent moderation ensure a focused study environment for all aspirants.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    desc: 'Track your study streaks, mock test scores, weak topics, and overall progress with personalized analytics dashboards.',
  },
  {
    icon: Globe,
    title: 'Bilingual Platform',
    desc: 'Content available in both Hindi and English, making Aspirav accessible to aspirants across every region of India.',
  },
  {
    icon: CheckCircle2,
    title: 'Exam-Specific Plans',
    desc: 'Each study plan is crafted specifically for a target exam — UPSC, SSC CGL, RRB NTPC, or IBPS PO — not generic advice.',
  },
];

const EXAMS = [
  {
    exam: 'UPSC Civil Services (IAS/IPS)',
    coverage: 'Full syllabus roadmap, NCERT summaries, answer writing practice, current affairs digests, and Mains strategy blogs.',
  },
  {
    exam: 'SSC CGL — Grade B & C Officers',
    coverage: 'Tier 1 & Tier 2 mock tests, quant formula sheets, English grammar notes, and GK capsule revision materials.',
  },
  {
    exam: 'RRB NTPC — Railway Non-Technical',
    coverage: 'CBT 1 & CBT 2 practice tests, reasoning puzzles, science & technology notes, and previous year papers.',
  },
  {
    exam: 'IBPS PO — Public Sector Banks',
    coverage: 'Prelims and Mains mock tests, banking awareness notes, data interpretation sets, and interview preparation guides.',
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <Container size="lg" className="py-10 md:py-16 space-y-14">

        {/* Hero */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-black uppercase tracking-wide rounded-full">
            About Aspirav
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-surface-900 tracking-tight leading-tight">
            Transforming How India
            <br />
            <span className="text-brand-500">Prepares for Exams</span>
          </h1>
          <p className="text-sm md:text-base text-surface-550 max-w-2xl mx-auto font-semibold leading-relaxed">
            Aspirav is India&apos;s leading exam-focused daily study planner and peer learning community.
            We help 85,000+ government exam aspirants build structured preparation routines, clear doubts,
            and track their progress — one day at a time.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 bg-white rounded-2xl border border-surface-200 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-black text-surface-900">{stat.value}</p>
                <p className="text-[11px] font-bold text-surface-450 uppercase tracking-wide">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Our Story */}
        <Card className="border border-surface-200 bg-white shadow-sm p-6 md:p-10 space-y-5">
          <h2 className="text-xl md:text-2xl font-black text-surface-900">Our Story</h2>
          <div className="space-y-4 text-sm text-surface-650 font-semibold leading-relaxed">
            <p>
              Aspirav was founded with one clear mission: to make structured government exam preparation
              accessible to every aspirant in India, regardless of their background or location. We
              recognized that millions of students face the same challenges — overwhelming syllabi, lack
              of a clear daily routine, difficulty finding reliable study materials, and no mentor to
              guide them through the process.
            </p>
            <p>
              Our platform bridges the gap between ambition and execution. Instead of browsing through
              hundreds of YouTube videos or purchasing expensive coaching programs, aspirants on Aspirav
              get a clear, day-by-day study plan tailored to their specific target exam. Every morning,
              they know exactly what chapters to cover, which practice sets to attempt, and which topics
              need revision.
            </p>
            <p>
              We believe that consistent daily effort, guided by a structured plan, is the most reliable
              path to cracking any government exam. This is why our study plans are designed around
              realistic daily targets — typically 4–6 hours of focused study — rather than overwhelming
              marathon sessions that aspirants cannot sustain.
            </p>
            <p>
              Our community forum, moderated by experienced mentors, provides a safe space for aspirants
              to ask doubts, share strategies, and motivate each other. We believe that peer learning
              accelerates preparation, and the community dimension makes Aspirav more than just another
              study platform — it is a support system for every aspirant&apos;s journey.
            </p>
          </div>
        </Card>

        {/* What We Cover */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-surface-900">Exams We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EXAMS.map((exam) => (
              <div
                key={exam.exam}
                className="p-5 bg-white rounded-2xl border border-surface-200 shadow-sm space-y-2 hover:border-brand-200 hover:shadow-md transition-all"
              >
                <h3 className="text-sm font-black text-surface-900">{exam.exam}</h3>
                <p className="text-xs text-surface-550 font-semibold leading-relaxed">{exam.coverage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-surface-900">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="p-5 bg-white rounded-2xl border border-surface-200 shadow-sm space-y-3 hover:shadow-md hover:border-brand-200 transition-all"
                >
                  <div className="p-2.5 w-fit bg-brand-50 text-brand-600 rounded-xl">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black text-surface-900">{value.title}</h3>
                  <p className="text-xs text-surface-550 font-semibold leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-brand-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-black leading-tight">
            Our Mission
          </h2>
          <p className="text-brand-100/80 text-sm font-semibold max-w-2xl mx-auto leading-relaxed">
            To democratize quality government exam preparation for every aspirant in India — making
            structured study plans, practice tests, and mentorship accessible regardless of geography,
            financial background, or access to coaching institutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-black text-sm rounded-xl transition-colors shadow-lg shadow-brand-500/20"
            >
              Join Free Today
            </Link>
            <Link
              href="/study-planner"
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black text-sm rounded-xl border border-white/20 transition-colors"
            >
              Explore Study Plans
            </Link>
          </div>
        </div>

      </Container>
    </>
  );
}
