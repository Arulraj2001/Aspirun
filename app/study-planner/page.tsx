'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ExamBadge } from '@/components/ui/ExamBadge';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoginPrompt } from '@/components/ui/LoginPrompt';
import { useAuth } from '@/lib/hooks/useAuth';
import { mockPlans, mockExams } from '@/data/mockData';
import { Calendar, Compass, Search, Filter, RefreshCw, GraduationCap } from 'lucide-react';
import { LoadingState } from '@/components/ui/LoadingState';

function PlannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialExamSlug = searchParams?.get('exam') || 'all';
  const { isLoggedIn } = useAuth();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [examSlug, setExamSlug] = useState(initialExamSlug);
  const [level, setLevel] = useState('all');
  const [duration, setDuration] = useState('all');
  const [pricing, setPricing] = useState('all');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Sync active plan enrolment
    const savedActivePlan = localStorage.getItem('active_plan_id');
    setTimeout(() => {
      setActivePlanId(savedActivePlan);
    }, 0);
  }, []);

  // Update examSlug state if searchParams change
  useEffect(() => {
    const targetExam = searchParams?.get('exam');
    if (targetExam) {
      setTimeout(() => {
        setExamSlug(targetExam);
      }, 0);
    }
  }, [searchParams]);

  // Handle plan enrollment action
  const handleStartPlan = (planId: string, e: React.MouseEvent) => {
    e.preventDefault();

    const newPlan = mockPlans.find((p) => p.id === planId);
    const savedActivePlanId = localStorage.getItem('active_plan_id');
    const oldPlan = mockPlans.find((p) => p.id === savedActivePlanId);

    if (oldPlan && newPlan && oldPlan.examId === newPlan.examId && oldPlan.id !== newPlan.id) {
      const confirmSwitch = window.confirm(
        `You already have an active study plan ("${oldPlan.title}") for this exam. Do you want to switch to "${newPlan.title}"? Your old progress will be preserved but paused.`
      );
      if (!confirmSwitch) return;
    }

    localStorage.setItem('active_plan_id', planId);
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    router.push('/student/dashboard');
  };

  // Filter study plans based on options
  const filteredPlans = mockPlans.filter((plan) => {
    // 1. Text Search matching title or description
    if (searchTerm.trim() && !plan.title.toLowerCase().includes(searchTerm.toLowerCase()) && !plan.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // 2. Exam Filtering
    if (examSlug !== 'all') {
      const associatedExam = mockExams.find((e) => e.slug === examSlug);
      if (plan.examId !== associatedExam?.id) return false;
    }

    // 3. Difficulty Level Filtering
    if (level !== 'all' && plan.difficulty.toLowerCase() !== level.toLowerCase()) {
      return false;
    }

    // 4. Duration Filtering
    if (duration !== 'all') {
      if (duration === 'short' && plan.durationDays >= 45) return false;
      if (duration === 'medium' && (plan.durationDays < 45 || plan.durationDays > 75)) return false;
      if (duration === 'long' && plan.durationDays <= 75) return false;
    }

    // 5. Pricing Filtering
    if (pricing !== 'all') {
      if (pricing === 'free' && !plan.isFree) return false;
      if (pricing === 'premium' && plan.isFree) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setExamSlug('all');
    setLevel('all');
    setDuration('all');
    setPricing('all');
    router.push('/study-planner');
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title="Exam-Wise Study Planners"
        subtitle="Select a structured daily study plan to follow systematic syllabus completion and daily revision targets."
      />

      {/* Search & Filters Controls Card */}
      <Card className="border border-surface-200 bg-surface-50/50 p-5 mb-8">
        <div className="flex flex-col gap-4">
          {/* Top Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-surface-450 pointer-events-none">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search study plans by keywords..."
              className="w-full pl-11 pr-4 py-3 bg-white text-sm border border-surface-250 rounded-2xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-xs text-surface-850 placeholder:text-surface-400 transition-all"
            />
          </div>

          {/* Dynamic Select Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Select
              label="Target Exam"
              value={examSlug}
              onChange={(e) => setExamSlug(e.target.value)}
              options={[
                { value: 'all', label: 'All Exams' },
                ...mockExams.map((exam) => ({ value: exam.slug, label: exam.name })),
              ]}
            />
            <Select
              label="Difficulty Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              options={[
                { value: 'all', label: 'All Levels' },
                { value: 'easy', label: 'Easy / Foundation' },
                { value: 'medium', label: 'Medium / Intermediate' },
                { value: 'hard', label: 'Hard / Advanced' },
              ]}
            />
            <Select
              label="Plan Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              options={[
                { value: 'all', label: 'Any Duration' },
                { value: 'short', label: 'Short (< 45 Days)' },
                { value: 'medium', label: 'Medium (45 - 75 Days)' },
                { value: 'long', label: 'Long (> 75 Days)' },
              ]}
            />
            <Select
              label="Pricing Model"
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              options={[
                { value: 'all', label: 'All Models' },
                { value: 'free', label: 'Free Plans Only' },
                { value: 'premium', label: 'Premium Unlocks' },
              ]}
            />
          </div>

          {/* Reset Filters Option */}
          {(searchTerm || examSlug !== 'all' || level !== 'all' || duration !== 'all' || pricing !== 'all') && (
            <div className="flex justify-end border-t border-surface-150 pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs font-black text-danger-600 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Catalog Render */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-surface-200 shadow-sm">
          <Filter className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-900">No matching study plans</h4>
          <p className="text-xs text-surface-450 font-semibold mt-1 max-w-sm mx-auto">We couldn&apos;t find any planners fitting your custom parameters. Clear search or check other exams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            const associatedExam = mockExams.find((e) => e.id === plan.examId);
            const isEnrolled = activePlanId === plan.id;
            
            return (
              <Link 
                key={plan.id}
                href={`/study-planner/${associatedExam?.slug || 'general'}/${plan.slug}`}
                className="group flex flex-col"
              >
                <Card hoverable className="flex-1 flex flex-col justify-between border border-surface-200 group-hover:border-brand-300 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {associatedExam && (
                        <span className="flex items-center gap-1">
                          <ExamBadge code={associatedExam.code} />
                          <span className="text-[10px] text-surface-400 font-bold hover:underline select-none" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExamSlug(associatedExam.slug);
                          }}>
                            View Exam &rarr;
                          </span>
                        </span>
                      )}
                      <DifficultyBadge difficulty={plan.difficulty} />
                    </div>

                    <h3 className="text-base md:text-lg font-black text-surface-900 leading-snug group-hover:text-brand-650 transition-colors mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-surface-550 leading-relaxed font-semibold mb-5 line-clamp-2">
                      {plan.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 border-t border-b border-surface-100 py-3.5 mb-5 text-center bg-surface-50/50 rounded-xl text-xs font-bold text-surface-500">
                      <div>
                        <p className="text-[9px] text-surface-450 uppercase mb-0.5">Duration</p>
                        <p className="text-sm font-extrabold text-surface-800 flex items-center justify-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-brand-600" /> {plan.durationDays} Days
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-surface-450 uppercase mb-0.5">Milestone Scope</p>
                        <p className="text-sm font-extrabold text-surface-800 flex items-center justify-center gap-1">
                          <Compass className="h-3.5 w-3.5 text-success-600" /> {plan.tasksCount || 90} Tasks
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-xs font-bold text-surface-500">
                      <span>Mock Tests Linked</span>
                      <span className="text-surface-850">{plan.mocksCount || 10} Tests</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-surface-100 pt-4 mt-2">
                      <StatusBadge status={plan.isFree ? 'free' : 'premium'} />
                      {isEnrolled ? (
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/student/dashboard');
                          }}
                          className="w-auto cursor-pointer block"
                        >
                          <Button size="sm" variant="success" icon={<GraduationCap className="h-4.5 w-4.5" />}>
                            Continue Plan
                          </Button>
                        </span>
                      ) : (
                        <Button
                          onClick={(e) => handleStartPlan(plan.id, e)}
                          size="sm"
                          variant={plan.isFree ? 'primary' : 'secondary'}
                        >
                          Start Plan
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}

export default function StudyPlannerPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading study planners..." />}>
      <PlannerContent />
    </Suspense>
  );
}
