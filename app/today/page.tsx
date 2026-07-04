'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockTasks, mockPlans, mockMaterials, mockMockTests } from '@/data/mockData';
import { Task, TaskStatus } from '@/types';
import {
  CheckCircle2,
  Circle,
  FileText,
  Video,
  PlayCircle,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function TodayTasksPage() {
  const router = useRouter();
  // Active state parameters
  const [activePlanId, setActivePlanId] = useState('plan-upsc-polity-30');
  const [activePlanTitle, setActivePlanTitle] = useState('30-Day Laxmikanth Indian Polity Crash Course');
  const [currentDay, setCurrentDay] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isGuest, setIsGuest] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    // 1. Sync simulation session
    const role = localStorage.getItem('simulated_role') || 'guest';
    const planId = localStorage.getItem('active_plan_id') || 'plan-upsc-polity-30';
    const plan = mockPlans.find((p) => p.id === planId);

    const planDay = Number(localStorage.getItem(`simulated_current_day_${planId}`) || 1);
    const streak = Number(localStorage.getItem('simulated_streak') || 0);

    // 2. Fetch or generate tasks for this day
    const dayTasks = mockTasks.filter((t) => t.planId === planId && t.dayNumber === planDay);
    
    let finalTasks: Task[] = [];
    if (dayTasks.length > 0) {
      finalTasks = dayTasks;
    } else {
      // Dynamic fallback task generator to support limitless progress testing
      finalTasks = [
        {
          id: `task-dyn-${planId}-${planDay}-1`,
          planId: planId,
          dayNumber: planDay,
          title: `Read Day ${planDay} detailed notes and acts`,
          description: `Study the primary core structures mapped for Day ${planDay}. Summarize essential highlights.`,
          category: 'General Studies',
          status: 'pending',
          estimatedMinutes: 45,
        },
        {
          id: `task-dyn-${planId}-${planDay}-2`,
          planId: planId,
          dayNumber: planDay,
          title: `Solve 20 practice questions on Day ${planDay} syllabus`,
          description: `Attempt section speed exercises to verify your understanding of rules and logic.`,
          category: 'GK',
          status: 'pending',
          estimatedMinutes: 30,
        },
        {
          id: `task-dyn-${planId}-${planDay}-3`,
          planId: planId,
          dayNumber: planDay,
          title: `Revise weak milestones and highlight keywords`,
          description: `Do a short 15-minute quick flashcard cycle on Day ${planDay} definitions.`,
          category: 'General Studies',
          status: 'pending',
          estimatedMinutes: 15,
        }
      ];
    }

    // 3. Restore completed statuses from local storage
    const restoredTasks = finalTasks.map((t) => {
      const savedStatus = localStorage.getItem(`task_progress_${t.id}`);
      return savedStatus ? { ...t, status: savedStatus as TaskStatus } : t;
    });

    setTimeout(() => {
      setIsGuest(role === 'guest');
      setActivePlanId(planId);
      setStreakCount(streak);
      if (plan) {
        setActivePlanTitle(plan.title);
      }
      setCurrentDay(planDay);
      setTasks(restoredTasks);
    }, 0);
  }, [activePlanId, currentDay]);

  const checkGuestAction = () => {
    if (isGuest) {
      alert('Please login to track your daily progress, complete tasks, and access study resources.');
      router.push(`/login?message=Please%20login%20to%20continue.&redirect=${encodeURIComponent(window.location.pathname)}`);
      return true;
    }
    return false;
  };

  const toggleTaskStatus = (id: string) => {
    if (checkGuestAction()) return;
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
          // Save in localStorage
          localStorage.setItem(`task_progress_${id}`, nextStatus);
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // Calculate day progress statistics
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const totalEstimatedMinutes = tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);

  // Mark Day Complete logic
  const handleMarkDayComplete = () => {
    if (checkGuestAction()) return;

    // 1. Increment current day index
    const nextDay = currentDay + 1;
    localStorage.setItem(`simulated_current_day_${activePlanId}`, String(nextDay));

    // 2. Increment active streak count
    const nextStreak = streakCount + 1;
    localStorage.setItem('simulated_streak', String(nextStreak));

    // 3. Trigger celebration UI state
    setShowCelebration(true);
    setStreakCount(nextStreak);
    setCurrentDay(nextDay);
  };

  const handleNextDayLoad = () => {
    setShowCelebration(false);
  };

  const todayDateString = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Guest Alert banner */}
      {isGuest && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs md:text-sm font-semibold text-orange-850">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-650 shrink-0" />
            <span>You are previewing as a Guest. Join Aspirav to track targets permanently.</span>
          </div>
          <Link href="/register">
            <Button size="sm" variant="success">Choose Study Plan</Button>
          </Link>
        </div>
      )}

      {/* Celebration Modal Block */}
      {showCelebration && (
        <Card className="mb-8 border border-success-200 bg-success-50/10 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-4">
            <span className="p-3 bg-success-50 text-success-700 rounded-2xl inline-flex shadow-xs animate-bounce mt-1">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base md:text-lg font-black text-success-900">
                🎉 Day {currentDay - 1} Completed Successfully!
              </h3>
              <p className="text-xs text-success-700 mt-1">
                Your study streak is now <span className="font-extrabold">{streakCount} Days</span>. Consistency builds habits.
              </p>
            </div>
          </div>
          <Button onClick={handleNextDayLoad} variant="success" size="sm" icon={<ChevronRight className="h-4.5 w-4.5" />} iconPosition="right">
            Load Day {currentDay} Checklist
          </Button>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] text-surface-450 font-black uppercase tracking-widest">{todayDateString}</span>
          <h1 className="text-xl md:text-3.5xl font-black text-surface-900 tracking-tight leading-snug">
            Today&apos;s Study Targets
          </h1>
          <p className="text-xs md:text-sm text-surface-550 leading-relaxed font-semibold mt-1 max-w-xl truncate">
            Active Plan: {activePlanTitle}
          </p>
        </div>

        {/* Dashboard quick links */}
        <div className="flex gap-2">
          <Link href="/student/progress">
            <Button variant="ghost" size="sm" className="font-extrabold flex items-center gap-1.5 text-xs">
              <TrendingUp className="h-4.5 w-4.5" /> Progress Logs
            </Button>
          </Link>
          <Link href="/student/my-plan">
            <Button variant="ghost" size="sm" className="font-extrabold flex items-center gap-1.5 text-xs">
              <FileText className="h-4.5 w-4.5" /> Full Roadmap
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Day Checklist targets list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider">
              Day {currentDay} Checklist
            </h3>
            <span className="text-xs font-semibold text-surface-500 flex items-center gap-1">
              <Clock className="h-4 w-4" /> Total Est: {totalEstimatedMinutes} mins
            </span>
          </div>

          {tasks.map((task) => {
            const material = mockMaterials.find((m) => m.id === task.materialId);
            const mockTest = mockMockTests.find((t) => t.id === task.mockTestId);
            
            return (
              <Card key={task.id} className="relative hover:border-surface-300 transition-colors border border-surface-200">
                <div className="flex items-start gap-4">
                  {/* Checkbox selector */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-1 cursor-pointer focus:outline-none text-surface-300 hover:text-brand-500 transition-colors shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6 text-success-600 fill-success-50" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 px-1.5 py-0.2 rounded">
                        {task.category}
                      </span>
                      <StatusBadge status={task.status} />
                    </div>

                    <h4 className={`text-xs md:text-sm font-black text-surface-850 ${task.status === 'completed' ? 'line-through text-surface-450' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] md:text-xs text-surface-500 font-semibold mt-1 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Resources attached */}
                    {(material || mockTest) && (
                      <div className="mt-4 p-3 bg-surface-50 rounded-xl border border-surface-200 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          {material?.category === 'PDF' && <FileText className="h-4.5 w-4.5 text-red-500 shrink-0" />}
                          {material?.category === 'Video' && <Video className="h-4.5 w-4.5 text-blue-500 shrink-0" />}
                          {mockTest && <PlayCircle className="h-4.5 w-4.5 text-brand-500 shrink-0" />}
                          <span className="text-xs font-bold text-surface-700 truncate max-w-[200px]">
                            {material?.title || mockTest?.title}
                          </span>
                        </div>
                        
                        {material && (
                          <Link href="/materials" onClick={(e) => { if (checkGuestAction()) e.preventDefault(); }}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs font-black">
                              Open Notes
                            </Button>
                          </Link>
                        )}
                        {mockTest && (
                          <Link href="/mock-tests" onClick={(e) => { if (checkGuestAction()) e.preventDefault(); }}>
                            <Button variant="primary" size="sm" className="h-8 text-xs font-black">
                              Start Quiz
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Daily checkpoints stats & controls */}
        <div className="space-y-6">
          <Card className="border border-surface-200">
            <h3 className="text-base font-extrabold text-surface-900 mb-3">Day Progress</h3>
            <ProgressBar value={progressPercent} showLabel color={progressPercent === 100 ? 'success' : 'brand'} />
            
            <div className="mt-4 pt-4 border-t border-surface-150 flex items-center justify-between text-xs font-bold text-surface-500">
              <span>Completed Targets</span>
              <span className="text-surface-850 font-extrabold">{completedCount} of {tasks.length}</span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={handleMarkDayComplete}
                disabled={progressPercent < 100}
                variant="primary"
                className="w-full justify-center"
              >
                Mark Day Complete
              </Button>
              <Link href="/community" onClick={(e) => { if (checkGuestAction()) e.preventDefault(); }}>
                <Button
                  variant="ghost"
                  className="w-full justify-center text-xs font-black flex items-center gap-1 text-surface-650"
                  icon={<MessageSquare className="h-4.5 w-4.5" />}
                >
                  Ask Doubt in Forum
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-brand-900 to-indigo-950 text-white border-0 relative overflow-hidden">
            <h3 className="text-sm font-black uppercase text-brand-200 tracking-wider mb-2">Daily Streak Tracker</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-white">{streakCount}</span>
              <div>
                <p className="text-xs font-extrabold text-brand-100">Active Study Streak</p>
                <p className="text-[10px] font-semibold text-brand-200">Complete all daily targets to earn streak rewards.</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </Container>
  );
}
