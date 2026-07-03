'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockPlans, mockMockResults } from '@/data/mockData';
import { MockResult } from '@/types';
import {
  TrendingUp,
  Award,
  Calendar,
  AlertTriangle,
  Flame,
  CheckCircle
} from 'lucide-react';

export default function StudentProgressPage() {
  const [activePlanTitle, setActivePlanTitle] = useState('30-Day Laxmikanth Indian Polity Crash Course');
  const [currentDay, setCurrentDay] = useState(1);
  const [totalDays, setTotalDays] = useState(30);
  const [streakCount, setStreakCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [resultsList, setResultsList] = useState<MockResult[]>([]);

  useEffect(() => {
    // 1. Sync simulation values
    const planId = localStorage.getItem('active_plan_id') || 'plan-upsc-polity-30';
    const plan = mockPlans.find((p) => p.id === planId);

    const planDay = Number(localStorage.getItem(`simulated_current_day_${planId}`) || 1);
    const streak = Number(localStorage.getItem('simulated_streak') || 0);

    // Count tasks completed in local storage
    let tasksCompleted = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('task_progress_') && localStorage.getItem(key) === 'completed') {
        tasksCompleted++;
      }
    }

    // Sync mock scores
    const savedResults = localStorage.getItem('mockMockResults') || '[]';
    const parsed: MockResult[] = JSON.parse(savedResults);
    const merged = [...parsed];
    mockMockResults.forEach((r) => {
      if (!merged.some((item) => item.id === r.id || item.mockTestId === r.mockTestId)) {
        merged.push(r);
      }
    });

    setTimeout(() => {
      if (plan) {
        setActivePlanTitle(plan.title);
        setTotalDays(plan.durationDays);
      }
      setCurrentDay(planDay);
      setStreakCount(streak);
      setCompletedTasksCount(tasksCompleted);
      setResultsList(merged);
    }, 0);
  }, []);

  // Calculate overall day progress
  const completedDays = Math.max(0, currentDay - 1);
  const pendingDays = Math.max(0, totalDays - completedDays);
  const overallProgress = (completedDays / totalDays) * 100;

  // Weak topics mockup
  const weakTopics = [
    { name: 'Quantitative Aptitude — Remainder Theorem & Prime Factors', accuracy: 42, color: 'text-danger-600 bg-danger-50' },
    { name: 'Indian Polity — Historical Charter Acts (1773-1853)', accuracy: 50, color: 'text-danger-600 bg-danger-50' },
    { name: 'Logical Reasoning — Syllogisms & Venn Diagrams', accuracy: 55, color: 'text-warning-600 bg-warning-50' },
  ];

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title="Preparation Insights & Statistics"
        subtitle={`Track your exam readiness, active plan streaks, weak topics, and mock scores for: ${activePlanTitle}`}
      />

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Progress Card */}
        <Card className="border border-surface-200">
          <span className="p-2.5 bg-brand-50 text-brand-650 rounded-xl inline-flex mb-3.5 shadow-xs">
            <TrendingUp className="h-5 w-5" />
          </span>
          <p className="text-[10px] text-surface-450 uppercase font-black tracking-wider">Overall Plan Progress</p>
          <p className="text-2xl font-black text-surface-850 mt-1">{overallProgress.toFixed(0)}%</p>
          <div className="mt-4">
            <ProgressBar value={overallProgress} size="sm" color="brand" />
          </div>
        </Card>

        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-brand-900 to-indigo-950 text-white border-0 relative overflow-hidden">
          <span className="p-2.5 bg-brand-800 text-brand-200 rounded-xl inline-flex mb-3.5 shadow-xs">
            <Flame className="h-5 w-5 fill-brand-300 text-brand-300" />
          </span>
          <p className="text-[10px] text-brand-200 uppercase font-black tracking-wider">Active Streak</p>
          <p className="text-2xl font-black mt-1 flex items-baseline gap-1">
            {streakCount} <span className="text-xs font-semibold text-brand-200">Days</span>
          </p>
          <p className="text-[10px] text-brand-300 mt-4 font-semibold">Keep hitting daily targets to increase streak.</p>
        </Card>

        {/* Days Completed Card */}
        <Card className="border border-surface-200">
          <span className="p-2.5 bg-success-50 text-success-700 rounded-xl inline-flex mb-3.5 shadow-xs">
            <CheckCircle className="h-5 w-5" />
          </span>
          <p className="text-[10px] text-surface-450 uppercase font-black tracking-wider">Completed / Pending Days</p>
          <p className="text-2xl font-black text-surface-850 mt-1">{completedDays} / {pendingDays}</p>
          <p className="text-[10px] text-surface-500 mt-4 font-semibold">Plan Target Duration: {totalDays} Days</p>
        </Card>

        {/* Tasks Completed Card */}
        <Card className="border border-surface-200">
          <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl inline-flex mb-3.5 shadow-xs">
            <Calendar className="h-5 w-5" />
          </span>
          <p className="text-[10px] text-surface-450 uppercase font-black tracking-wider">Aggregated Tasks Finished</p>
          <p className="text-2xl font-black text-surface-850 mt-1">{completedTasksCount} Tasks</p>
          <p className="text-[10px] text-surface-500 mt-4 font-semibold">Across all roadmap study plans.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Weak Topics & Assessment stats */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weak Topics Panel */}
          <Card className="border border-surface-200">
            <h3 className="text-base font-extrabold text-surface-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger-600" />
              AI Weak Topics Analysis
            </h3>
            <p className="text-xs text-surface-500 font-semibold mb-5 leading-relaxed">
              These topics represent sections where your sectional mock scores fell below 60%. Study the associated materials to boost results.
            </p>

            <div className="space-y-3.5">
              {weakTopics.map((topic, idx) => (
                <div key={idx} className="flex justify-between items-center gap-4 p-3 rounded-xl border border-surface-150 bg-surface-50/50">
                  <span className="text-xs font-black text-surface-800 leading-snug">{topic.name}</span>
                  <span className="text-xs font-black text-danger-600 px-2 py-0.5 rounded-lg bg-danger-50 shrink-0">
                    Accuracy: {topic.accuracy}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-surface-100 flex justify-end">
              <Link href="/materials">
                <Button size="sm" variant="ghost" className="text-xs font-black">
                  Browse Linked Materials &rarr;
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Mock Results */}
          <Card className="border border-surface-200">
            <h3 className="text-base font-extrabold text-surface-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              Recent Mock Scores
            </h3>
            
            <div className="space-y-4">
              {resultsList.slice(0, 3).map((res) => (
                <div key={res.id} className="flex justify-between items-center gap-4 p-3.5 border border-surface-150 rounded-xl bg-white hover:border-surface-250 transition-colors">
                  <div>
                    <h5 className="text-xs md:text-sm font-black text-surface-850 leading-snug">{res.mockTestTitle}</h5>
                    <p className="text-[10px] text-surface-450 font-bold uppercase mt-1">Date Attempted: {new Date(res.dateAttempted).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs md:text-sm font-black text-brand-650">{res.score} / {res.totalMarks}</span>
                    <p className="text-[10px] text-success-600 font-extrabold mt-0.5">Accuracy: {res.accuracy}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-surface-100 flex justify-end">
              <Link href="/student/mock-results">
                <Button size="sm" variant="ghost" className="text-xs font-black">
                  View Comprehensive Results Summary &rarr;
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: Actions and settings */}
        <div className="space-y-6">
          <Card className="bg-brand-50/20 border border-brand-200">
            <h4 className="text-sm font-black text-brand-900 mb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-brand-600" />
              Daily Study Habit Plan
            </h4>
            <p className="text-xs text-surface-550 leading-relaxed font-semibold mb-5">
              Keep hitting daily checkpoints to unlock topper strategies and complete syllabus benchmarks systematically.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/student/tasks">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Go to Today&apos;s Checklist
                </Button>
              </Link>
              <Link href="/student/my-plan">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Review Plan Roadmap
                </Button>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </Container>
  );
}
