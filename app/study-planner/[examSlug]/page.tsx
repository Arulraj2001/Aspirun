'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockExams, mockPlans, mockMaterials, mockMockTests } from '@/data/mockData';
import { BookOpen, FileText, PlayCircle, MessageSquare, Award, CheckCircle, GraduationCap } from 'lucide-react';

interface PageProps {
  params: Promise<{ examSlug: string }>;
}

export default function ExamSpecificPage({ params }: PageProps) {
  const router = useRouter();
  const { examSlug } = use(params);

  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useEffect(() => {
    const val = localStorage.getItem('active_plan_id');
    setTimeout(() => {
      setActivePlanId(val);
    }, 0);
  }, []);

  // Fetch target exam matching slug
  const exam = mockExams.find((e) => e.slug === examSlug);

  if (!exam) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Exam Profile Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We couldn&apos;t find an entry matching &quot;{examSlug}&quot;.</p>
        <Link href="/study-planner">
          <Button>Back to Planners</Button>
        </Link>
      </Container>
    );
  }

  // Filter child models
  const availablePlans = mockPlans.filter((p) => p.examId === exam.id);
  const relatedMaterials = mockMaterials.filter((m) => m.examId === exam.id);
  const relatedMocks = mockMockTests.filter((t) => t.examId === exam.id);

  const handleStartPlan = (planId: string) => {
    localStorage.setItem('active_plan_id', planId);
    localStorage.setItem('simulated_role', 'student');
    router.push('/student/dashboard');
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title={`${exam.name} Center`}
        subtitle={`Exams credentials, syllabus coverage maps, daily planners, and community resources.`}
      />

      {/* 1. Exam Overview Metrics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2 border border-surface-200 bg-white">
          <h3 className="text-base md:text-lg font-black text-surface-900 border-b border-surface-100 pb-3 mb-4">
            Exam Overview & Eligibility
          </h3>
          <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold mb-6">
            {exam.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-black text-surface-850 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-4.5 w-4.5 text-brand-650" />
                Eligibility Criteria
              </h4>
              <p className="text-xs text-surface-500 font-semibold leading-relaxed">
                {exam.eligibility || 'Graduation degree pass from recognized university.'}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-surface-850 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-orange-500" />
                Exam Pattern
              </h4>
              <p className="text-xs text-surface-500 font-semibold leading-relaxed">
                {exam.exam_pattern || 'Multiple-choice Computer Based Test (CBT) divided in tiers.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-surface-100 flex justify-between items-center">
            <span className="text-xs font-bold text-surface-450">Official portal references:</span>
            {exam.official_url && (
              <a href={exam.official_url} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-brand-650 hover:underline">
                Visit Official Website &rarr;
              </a>
            )}
          </div>
        </Card>

        {/* Syllabus / Topics Card */}
        <Card className="border border-surface-200 bg-surface-50/20">
          <h3 className="text-base font-black text-surface-900 border-b border-surface-100 pb-3 mb-4">
            Syllabus Topics Covered
          </h3>
          <div className="space-y-4">
            {exam.syllabus ? (
              exam.syllabus.split(',').map((topic, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="h-5 w-5 bg-brand-50 rounded-full border border-brand-100 flex items-center justify-center text-brand-650 shrink-0 font-extrabold text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-surface-800 uppercase tracking-tight">{topic.trim()}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-surface-450">Syllabus details pending.</p>
            )}
          </div>
        </Card>
      </div>

      {/* 2. Available Study Plans */}
      <div className="mb-12">
        <h3 className="text-lg md:text-xl font-black text-surface-900 mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-500" />
          Structured Daily Planners
        </h3>

        {availablePlans.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-surface-200">
            <p className="text-xs text-surface-500 font-bold">No study plans created for this exam category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlans.map((plan) => {
              const isEnrolled = activePlanId === plan.id;
              return (
                <Link key={plan.id} href={`/study-planner/${examSlug}/${plan.slug}`} className="group flex flex-col">
                  <Card hoverable className="flex-1 flex flex-col justify-between border border-surface-200 group-hover:border-brand-300 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <DifficultyBadge difficulty={plan.difficulty} />
                        <StatusBadge status={plan.isFree ? 'free' : 'premium'} />
                      </div>
                      <h4 className="text-base font-extrabold text-surface-900 group-hover:text-brand-600 transition-colors mb-2">
                        {plan.title}
                      </h4>
                      <p className="text-xs text-surface-500 leading-relaxed line-clamp-2 font-semibold mb-4">
                        {plan.description}
                      </p>
                    </div>

                    <div className="border-t border-surface-100 pt-4 mt-2 flex justify-between items-center">
                      <span className="text-xs font-bold text-surface-500">{plan.durationDays} Days Duration</span>
                      {isEnrolled ? (
                        <Link href="/student/dashboard" className="w-auto">
                          <Button size="sm" variant="success" icon={<GraduationCap className="h-4.5 w-4.5" />}>
                            Continue
                          </Button>
                        </Link>
                      ) : (
                        <Button onClick={(e) => {
                          e.preventDefault();
                          handleStartPlan(plan.id);
                        }} size="sm">
                          Start Plan
                        </Button>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Related Materials and Mock Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Materials */}
        <Card className="border border-surface-200">
          <h3 className="text-base font-black text-surface-900 border-b border-surface-100 pb-3 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            Syllabus Handouts & PDF Notes
          </h3>
          {relatedMaterials.length === 0 ? (
            <p className="text-xs text-surface-450 py-4 font-semibold text-center">No reference notes loaded for this exam.</p>
          ) : (
            <div className="space-y-4">
              {relatedMaterials.slice(0, 4).map((material) => (
                <div key={material.id} className="flex justify-between items-center gap-4 p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                  <div>
                    <h5 className="text-xs font-extrabold text-surface-850 leading-snug">{material.title}</h5>
                    <p className="text-[10px] text-surface-450 mt-0.5">{material.category} &bull; {material.sizeOrDuration}</p>
                  </div>
                  <Link href="/materials">
                    <Button size="sm" variant="outline">Get PDF</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Mock Tests */}
        <Card className="border border-surface-200">
          <h3 className="text-base font-black text-surface-900 border-b border-surface-100 pb-3 mb-4 flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-orange-500" />
            Free Assessments & Quizzes
          </h3>
          {relatedMocks.length === 0 ? (
            <p className="text-xs text-surface-450 py-4 font-semibold text-center">No assessments cataloged for this exam.</p>
          ) : (
            <div className="space-y-4">
              {relatedMocks.slice(0, 4).map((mock) => (
                <div key={mock.id} className="flex justify-between items-center gap-4 p-3 bg-surface-50 rounded-xl border border-surface-200/60">
                  <div>
                    <h5 className="text-xs font-extrabold text-surface-850 leading-snug">{mock.title}</h5>
                    <p className="text-[10px] text-surface-450 mt-0.5">{mock.durationMinutes} Mins &bull; {mock.totalQuestions} Questions</p>
                  </div>
                  <Link href="/mock-tests">
                    <Button size="sm" variant="secondary">Attempt</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 4. Safe Community Discussion CTA */}
      <Card className="border border-surface-200 bg-brand-50/20 text-center py-8">
        <span className="p-3 bg-brand-500 text-white rounded-full inline-flex mb-4">
          <MessageSquare className="h-6 w-6" />
        </span>
        <h3 className="text-base md:text-lg font-black text-surface-900 max-w-lg mx-auto">
          Have Doubts Regarding {exam.name}?
        </h3>
        <p className="text-xs text-surface-550 leading-relaxed font-semibold max-w-md mx-auto mt-1 mb-6">
          Engage in strict, zero-distraction preparation debates with serious students and moderators.
        </p>
        <Link href="/community">
          <Button variant="primary">
            Open Peer Discussion Forum
          </Button>
        </Link>
      </Card>
    </Container>
  );
}
