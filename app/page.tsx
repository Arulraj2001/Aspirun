'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { ExamBadge } from '@/components/ui/ExamBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  mockPlans,
  mockExams,
  mockMockTests,
  mockMaterials,
  mockBlogs,
} from '@/data/mockData';
import {
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
  ShieldCheck,
  Compass,
  CheckSquare,
  FileText,
  BookOpen,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  PlayCircle,
  Download,
} from 'lucide-react';

interface SampleTask {
  id: string;
  title: string;
  category: string;
  type: string;
  completed: boolean;
}

export default function Home() {
  const router = useRouter();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Sample tasks state
  const [sampleTasks, setSampleTasks] = useState<SampleTask[]>([
    { id: 'st-1', title: 'Read Number System notes', category: 'Quant', type: 'Read', completed: false },
    { id: 'st-2', title: 'Solve 30 practice questions', category: 'Quant', type: 'Practice', completed: false },
    { id: 'st-3', title: 'Attempt sectional reasoning quiz', category: 'Reasoning', type: 'Quiz', completed: false },
    { id: 'st-4', title: 'Revise 10 current affairs MCQs', category: 'GK & CA', type: 'Revision', completed: false },
  ]);

  // Handle sample task click
  const toggleSampleTask = (id: string) => {
    setSampleTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const sampleCompletedCount = sampleTasks.filter((t) => t.completed).length;
  const sampleProgress = (sampleCompletedCount / sampleTasks.length) * 100;

  // Handle plan selection redirection
  const handleStartPlan = (planId: string) => {
    localStorage.setItem('active_plan_id', planId);
    localStorage.setItem('simulated_role', 'student');
    router.push('/student/dashboard');
  };

  // Perform search calculations
  const searchResults = (() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const examsMatch = mockExams
      .filter((e) => e.name.toLowerCase().includes(query) || e.code.toLowerCase().includes(query))
      .map((e) => ({ type: 'Exam', title: `[${e.code}] ${e.name}`, href: `/study-planner?exam=${e.slug}` }));

    const plansMatch = mockPlans
      .filter((p) => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
      .map((p) => ({ type: 'Study Plan', title: p.title, href: `/study-planner` }));

    const materialsMatch = mockMaterials
      .filter((m) => m.title.toLowerCase().includes(query) || m.subject.toLowerCase().includes(query))
      .map((m) => ({ type: 'Material', title: `[${m.category}] ${m.title}`, href: `/materials` }));

    const mocksMatch = mockMockTests
      .filter((t) => t.title.toLowerCase().includes(query) || t.subject.toLowerCase().includes(query))
      .map((t) => ({ type: 'Mock Test', title: t.title, href: `/mock-tests` }));

    return [...examsMatch, ...plansMatch, ...materialsMatch, ...mocksMatch].slice(0, 5);
  })();

  // Filter popular plans matching requirements
  const popularPlans = mockPlans.filter((p) =>
    ['plan-ssc-cgl-90', 'plan-rrb-group-d-60', 'plan-police-45', 'plan-bank-clerk-75'].includes(p.id)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white py-16 md:py-24 border-b border-surface-200">
        <Container size="xl" className="relative z-10 flex flex-col items-center text-center">
          
          {/* Tagline Badge */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-brand-100 text-brand-700 uppercase tracking-widest mb-6 border border-brand-200">
            <Sparkles className="h-3.5 w-3.5 fill-brand-200 text-brand-700" />
            Empowering govt exam aspirants
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-surface-900 tracking-tight leading-[1.1] max-w-4xl mb-6">
            Prepare for Govt Exams <br className="hidden sm:inline" />
            With a <span className="text-brand-500">Daily Study Plan</span>
          </h1>

          <p className="text-sm md:text-lg text-surface-550 max-w-2xl font-semibold mb-8 leading-relaxed">
            Know exactly what to study today, complete tasks, attempt mocks, track progress, and discuss safely with serious students.
          </p>

          {/* 2. Interactive Search Bar & Dropdown */}
          <div className="w-full max-w-xl relative mb-10">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-surface-450 pointer-events-none">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Search exam, plan, material, mock test..."
                className="w-full pl-11 pr-4 py-3.5 bg-white text-sm md:text-base border border-surface-250 rounded-2xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-md text-surface-850 placeholder:text-surface-400 transition-all"
              />
            </div>

            {/* Dropdown Overlay */}
            {isFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-surface-200 rounded-2xl shadow-xl z-50 p-2 text-left flex flex-col gap-1 max-h-[300px] overflow-y-auto animate-in fade-in duration-100">
                <p className="text-[10px] text-surface-400 font-extrabold uppercase px-3 py-1.5 border-b border-surface-100">Search Matches</p>
                {searchResults.length === 0 ? (
                  <p className="text-xs text-surface-500 font-bold px-3 py-4 text-center">No exact matches found. Try &quot;SSC&quot;, &quot;Polity&quot;, or &quot;Mock&quot;.</p>
                ) : (
                  searchResults.map((res, idx) => (
                    <Link
                      key={idx}
                      href={res.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors"
                    >
                      <div>
                        <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 px-1.5 py-0.5 rounded mr-2">
                          {res.type}
                        </span>
                        <span className="text-xs font-semibold text-surface-800">{res.title}</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Link href="/study-planner" className="w-full sm:w-auto">
              <Button size="md" className="w-full justify-center" icon={<ArrowRight className="h-4.5 w-4.5" />} iconPosition="right">
                Start Free Study Plan
              </Button>
            </Link>
            <Link href="/mock-tests" className="w-full sm:w-auto">
              <Button size="md" variant="outline" className="w-full justify-center">
                View Mock Tests
              </Button>
            </Link>
            <Link href="/community" className="w-full sm:w-auto">
              <Button size="md" variant="secondary" className="w-full justify-center">
                Join Community
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Trust Badges Section */}
      <section className="py-8 bg-surface-50 border-b border-surface-205">
        <Container size="xl">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { label: 'Daily Tasks', icon: CheckSquare, color: 'text-brand-500' },
              { label: 'Progress Tracking', icon: TrendingUp, color: 'text-success-600' },
              { label: 'Mock Tests', icon: Award, color: 'text-orange-500' },
              { label: 'Safe Community', icon: ShieldCheck, color: 'text-indigo-500' },
              { label: 'Admin Moderated Discussions', icon: ShieldAlert, color: 'text-danger-600' },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-surface-200 rounded-xl shadow-xs">
                  <Icon className={`h-4.5 w-4.5 ${badge.color}`} />
                  <span className="text-xs font-black text-surface-800 uppercase tracking-tight">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Quick Access Cards */}
      <section className="py-16 bg-white border-b border-surface-200">
        <Container size="xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">Quick Portal Access</h2>
            <p className="mt-2 text-xs md:text-sm text-surface-500 font-semibold">Jump directly to your desired module to keep studying.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Study Plans', href: '/study-planner', icon: Compass, bg: 'bg-brand-50 hover:bg-brand-100', color: 'text-brand-650' },
              { label: 'Today’s Tasks', href: '/today', icon: CheckSquare, bg: 'bg-success-50 hover:bg-success-100', color: 'text-success-700' },
              { label: 'Mock Tests', href: '/mock-tests', icon: Award, bg: 'bg-orange-50 hover:bg-orange-100', color: 'text-orange-650' },
              { label: 'Materials', href: '/materials', icon: FileText, bg: 'bg-red-50 hover:bg-red-100', color: 'text-red-650' },
              { label: 'Community', href: '/community', icon: MessageSquare, bg: 'bg-indigo-50 hover:bg-indigo-100', color: 'text-indigo-650' },
              { label: 'Guidance', href: '/guidance', icon: BookOpen, bg: 'bg-amber-50 hover:bg-amber-100', color: 'text-amber-650' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link key={idx} href={item.href} className="group">
                  <Card className={`h-full flex flex-col items-center justify-center text-center p-4 border border-surface-200 transition-transform group-hover:-translate-y-1 duration-200 cursor-pointer ${item.bg}`}>
                    <span className={`p-2.5 bg-white rounded-xl mb-3 ${item.color} shadow-xs`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs md:text-sm font-black text-surface-850">{item.label}</span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Popular Study Plans */}
      <section className="py-16 bg-surface-50 border-b border-surface-200">
        <Container size="xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">Popular Study Plans</h2>
            <p className="mt-2 text-xs md:text-sm text-surface-500 font-semibold">Structured roadmap templates followed by thousands of successful candidates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPlans.map((plan) => {
              const associatedExam = mockExams.find((e) => e.id === plan.examId);
              return (
                <Card key={plan.id} hoverable className="flex flex-col justify-between h-full bg-white border border-surface-200">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {associatedExam && <ExamBadge code={associatedExam.code} />}
                      <DifficultyBadge difficulty={plan.difficulty} />
                    </div>

                    <h3 className="text-base font-extrabold text-surface-900 leading-snug mb-2.5">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-surface-500 leading-relaxed font-semibold mb-5 line-clamp-2">
                      {plan.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 border-t border-b border-surface-100 py-3.5 mb-5 text-center text-xs font-bold bg-surface-50/50 rounded-xl">
                      <div>
                        <p className="text-[9px] text-surface-450 uppercase mb-0.5">Tasks</p>
                        <p className="text-sm font-extrabold text-surface-800">{plan.tasksCount || 90}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-surface-450 uppercase mb-0.5">Mock Tests</p>
                        <p className="text-sm font-extrabold text-surface-800">{plan.mocksCount || 10}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-xs font-bold text-surface-500">
                      <span>Duration</span>
                      <span className="text-surface-800">{plan.durationDays} Days</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-surface-500 pb-2">
                      <span>Aspirants Enrolled</span>
                      <span className="text-brand-600 font-extrabold">{plan.enrolledCount.toLocaleString()}</span>
                    </div>
                    <Button onClick={() => handleStartPlan(plan.id)} variant="primary" size="sm" className="w-full justify-center">
                      Start Plan
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Today’s Sample Tasks Checklist */}
      <section className="py-16 bg-white border-b border-surface-200">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h2 className="text-xl md:text-3.5xl font-black text-surface-900 tracking-tight leading-snug mb-4">
                Interactive Daily Target Simulation
              </h2>
              <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold mb-6">
                Govt preparation succeeds through consistent daily loops. Complete tasks, read static materials, and check off objectives to see the progress indicators scale. Try ticking off the sample Day 1 checklist to see it work!
              </p>
              
              <div className="p-5 bg-surface-50 border border-surface-200 rounded-2xl max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 bg-brand-500 rounded-xl text-white">
                    <CheckSquare className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="text-sm font-extrabold text-surface-900">Polity Day 1 Checklist</h4>
                    <p className="text-[10px] text-surface-450 font-bold">4 micro targets to hit today</p>
                  </div>
                </div>

                <ProgressBar value={sampleProgress} showLabel color={sampleProgress === 100 ? 'success' : 'brand'} className="mb-5" />

                <div className="flex justify-between items-center text-xs font-bold text-surface-500 border-t border-surface-150 pt-4">
                  <span>Check off simulated targets</span>
                  <span>{sampleCompletedCount} of {sampleTasks.length} Done</span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {sampleTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleSampleTask(task.id)}
                  className={`flex items-start gap-4 p-4 border rounded-2xl bg-white shadow-xs cursor-pointer transition-all duration-200 select-none ${
                    task.completed
                      ? 'border-success-200 bg-success-50/10'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <span className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="h-5.5 w-5.5 text-success-600 fill-success-50" />
                    ) : (
                      <span className="block h-5.5 w-5.5 rounded-full border-2 border-surface-300" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 px-1.5 py-0.2 rounded">
                        {task.category}
                      </span>
                      <Badge variant="outline" size="sm" className="text-[9px]">
                        {task.type}
                      </Badge>
                    </div>
                    <h4 className={`text-xs md:text-sm font-black text-surface-850 ${task.completed ? 'line-through text-surface-400' : ''}`}>
                      {task.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* 7. Free Mock Tests */}
      <section className="py-16 bg-surface-50 border-b border-surface-200">
        <Container size="xl">
          <SectionHeader
            title="Free Exam Mock Tests"
            subtitle="Attempt latest pattern sectional and full assessments to check speed ranks."
            action={
              <Link href="/mock-tests">
                <Button variant="ghost" size="sm" className="font-extrabold flex items-center gap-1">
                  View All Mocks <ChevronRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockMockTests.slice(0, 3).map((mock) => {
              const exam = mockExams.find((e) => e.id === mock.examId);
              return (
                <Card key={mock.id} className="flex flex-col justify-between bg-white border border-surface-200">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      {exam && <ExamBadge code={exam.code} />}
                      <DifficultyBadge difficulty={mock.difficulty} />
                    </div>
                    <h4 className="text-sm md:text-base font-extrabold text-surface-900 leading-snug mb-3">
                      {mock.title}
                    </h4>
                    <p className="text-[10px] text-surface-450 font-bold uppercase mb-4">Subject: {mock.subject}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-surface-100 pt-4 mt-2">
                    <span className="text-xs font-bold text-success-600">Free Practice</span>
                    <Link href="/mock-tests">
                      <Button size="sm" variant="secondary" icon={<PlayCircle className="h-4.5 w-4.5" />}>
                        Attempt Test
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 8. Study Materials */}
      <section className="py-16 bg-white border-b border-surface-200">
        <Container size="xl">
          <SectionHeader
            title="Syllabus Handouts & PDF Notes"
            subtitle="High-yield compilers curated specifically for UPSC, SSC, and Banking exams."
            action={
              <Link href="/materials">
                <Button variant="ghost" size="sm" className="font-extrabold flex items-center gap-1">
                  Browse Materials <ChevronRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockMaterials.slice(0, 3).map((material) => {
              const exam = mockExams.find((e) => e.id === material.examId);
              return (
                <Card key={material.id} className="flex flex-col justify-between border border-surface-200">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      {exam && <ExamBadge code={exam.code} />}
                      <span className="text-[10px] font-black uppercase bg-surface-100 text-surface-700 px-2 py-0.5 rounded">
                        {material.category}
                      </span>
                    </div>
                    <h4 className="text-xs md:text-sm font-extrabold text-surface-850 leading-snug mb-2">
                      {material.title}
                    </h4>
                    <p className="text-[10px] text-surface-500 font-semibold mb-4">Subject: {material.subject} &bull; Size: {material.sizeOrDuration}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-surface-100 pt-4 mt-2">
                    <StatusBadge status="free" />
                    <Link href="/materials">
                      <Button size="sm" variant="outline" icon={<Download className="h-4 w-4" />}>
                        Get PDF
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 9. Safe Student Community Pitch */}
      <section className="py-16 bg-surface-50 border-b border-surface-200">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative p-6 bg-white border border-surface-200 rounded-3xl shadow-md">
              <span className="absolute top-4 right-4 bg-danger-50 text-danger-700 border border-danger-100 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> Moderation Active
              </span>
              <h3 className="text-base md:text-lg font-black text-surface-900 border-b border-surface-100 pb-3.5 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success-600 shrink-0" />
                Community Safety Dashboard
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="p-1 bg-danger-50 text-danger-650 rounded-lg h-fit border border-danger-100">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-surface-850">No Commercial Adverts or Spam</h5>
                    <p className="text-[10px] md:text-xs text-surface-500 font-semibold leading-relaxed mt-0.5">Advertising channels or study pages leads to immediate hardware mute.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="p-1 bg-danger-50 text-danger-650 rounded-lg h-fit border border-danger-100">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-surface-850">No Fake Result / Exam news</h5>
                    <p className="text-[10px] md:text-xs text-surface-500 font-semibold leading-relaxed mt-0.5">Posting mock result lists or unofficial cutoffs is strictly banned.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="p-1 bg-danger-50 text-danger-650 rounded-lg h-fit border border-danger-100">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-surface-850">Instant Report & Moderation Auditing</h5>
                    <p className="text-[10px] md:text-xs text-surface-500 font-semibold leading-relaxed mt-0.5">Any student can report threads, flagged to the admin audit desk instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-danger-50 text-danger-700 border border-danger-100 uppercase mb-4">
                Strict Safe Zone
              </span>
              <h2 className="text-2xl md:text-3.5xl font-black text-surface-900 tracking-tight leading-snug mb-6">
                Safe Peer Doubt Discuss Forums
              </h2>
              <p className="text-xs md:text-sm text-surface-550 font-semibold leading-relaxed mb-6">
                Aspirav has built a zero-tolerance educational board. Aspirants must register and pass safety thresholds to participate. Ask doubts, answer sums, and solve equations with real-time peer groups.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/community">
                  <Button variant="primary" size="sm">
                    Enter Discussion Board
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="sm">
                    Read Community Guidelines
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 10. Guidance Blogs Section */}
      <section className="py-16 bg-white border-b border-surface-200">
        <Container size="xl">
          <SectionHeader
            title="Guidance & Strategy Guides"
            subtitle="Topper strategies, daily schedules, and recommended book roadmaps."
            action={
              <Link href="/guidance">
                <Button variant="ghost" size="sm" className="font-extrabold flex items-center gap-1">
                  Read Mentor Guides <ChevronRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockBlogs.slice(0, 2).map((blog) => (
              <Card key={blog.id} hoverable className="flex flex-col justify-between border border-surface-200 bg-surface-50/10">
                <div>
                  <div className="flex items-center gap-2 mb-3.5">
                    <Badge variant="info" size="sm">{blog.category}</Badge>
                    <span className="text-xs font-semibold text-surface-450">{blog.readTime}</span>
                  </div>
                  <h4 className="text-base md:text-lg font-black text-surface-900 leading-snug mb-2 hover:text-brand-600 transition-colors">
                    {blog.title}
                  </h4>
                  <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold mb-5 line-clamp-2">
                    {blog.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-surface-100 pt-4 mt-3">
                  <span className="text-xs font-bold text-surface-700">By {blog.author}</span>
                  <Link href="/guidance">
                    <Button variant="ghost" size="sm" className="text-brand-600 font-extrabold">
                      Read Strategy &rarr;
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 11. Why Choose Us (USP Summary) */}
      <section className="py-16 bg-surface-50">
        <Container size="xl">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">Built For Consistent Study</h2>
            <p className="mt-2 text-xs md:text-sm text-surface-500 font-semibold">How Aspirav compares to standard test-series portals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-surface-200 bg-white">
              <span className="p-3 bg-brand-50 rounded-2xl text-brand-650 block w-fit mb-4">
                <Compass className="h-6 w-6" />
              </span>
              <h4 className="text-base font-extrabold text-surface-900 mb-2">1. Day-by-Day Syllabus Milestones</h4>
              <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold">
                No list overload. We take massive UPSC & SSC syllabus parameters and split them day-by-day. You open the portal and know exactly what to study now.
              </p>
            </Card>

            <Card className="border border-surface-200 bg-white">
              <span className="p-3 bg-success-50 rounded-2xl text-success-700 block w-fit mb-4">
                <CheckSquare className="h-6 w-6" />
              </span>
              <h4 className="text-base font-extrabold text-surface-900 mb-2">2. Checklists Linked to Resources</h4>
              <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold">
                Your tasks are directly integrated. Tapping a task unlocks the specific PDF notes, video session, or MCQ practice test required to complete it.
              </p>
            </Card>

            <Card className="border border-surface-200 bg-white">
              <span className="p-3 bg-danger-50 rounded-2xl text-danger-750 block w-fit mb-4">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h4 className="text-base font-extrabold text-surface-900 mb-2">3. Zero-Distraction Forums</h4>
              <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold">
                No advertisements, cutoff predictions, or spam threads. Dedicated academic moderators keep questions strictly educational.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
