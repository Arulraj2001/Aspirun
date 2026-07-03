'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { mockPlans } from '@/data/mockData';
import { StudyPlan } from '@/types';
import {
  Compass,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  CheckCircle,
  Play,
  Lock,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function StudentMyPlan() {
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    // 1. Sync simulation values
    const planId = localStorage.getItem('active_plan_id') || 'plan-upsc-polity-30';
    const plan = mockPlans.find((p) => p.id === planId);

    const planDay = Number(localStorage.getItem(`simulated_current_day_${planId}`) || 1);
    const planStatus = localStorage.getItem(`simulated_plan_status_${planId}`) || 'active';

    setTimeout(() => {
      setIsPaused(planStatus === 'paused');
      setCurrentDay(planDay);
      if (plan) {
        setActivePlan(plan);
      }
    }, 0);
  }, []);

  const handleToggleStatus = () => {
    if (!activePlan) return;
    const nextStatus = isPaused ? 'active' : 'paused';
    localStorage.setItem(`simulated_plan_status_${activePlan.id}`, nextStatus);
    setIsPaused(!isPaused);
  };

  if (!activePlan) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Syncing plan roadmap...</h3>
      </Container>
    );
  }

  // Segment days into weeks (each week has 7 days)
  const totalDays = activePlan.durationDays || 30;
  const totalWeeks = Math.ceil(totalDays / 7);
  const weeks = Array.from({ length: totalWeeks }, (_, wIdx) => {
    const startDay = wIdx * 7 + 1;
    const endDay = Math.min((wIdx + 1) * 7, totalDays);
    const daysList = [];
    
    for (let d = startDay; d <= endDay; d++) {
      daysList.push({
        dayNumber: d,
        isCompleted: d < currentDay,
        isActive: d === currentDay,
        isPending: d > currentDay
      });
    }

    return {
      weekNumber: wIdx + 1,
      startDay,
      endDay,
      days: daysList
    };
  });

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title="My Study Syllabus Roadmap"
        subtitle="Review your progress goals segmented into weekly target boards."
        action={
          <Link href="/study-planner">
            <Button variant="outline" size="sm" icon={<Compass className="h-4.5 w-4.5" />}>
              Switch Study Plan
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Plan Summary Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-surface-200 bg-white">
            <div className="flex justify-between items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                Active Planner
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                isPaused 
                  ? 'bg-orange-50 text-orange-700 border-orange-100' 
                  : 'bg-success-50 text-success-700 border-success-100'
              }`}>
                {isPaused ? 'Paused' : 'Active'}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-black text-surface-900 leading-snug">
              {activePlan.title}
            </h3>
            
            <p className="text-xs text-surface-550 leading-relaxed font-semibold mt-2 mb-6">
              {activePlan.description}
            </p>

            <div className="space-y-3 mb-6">
              <Link href="/student/tasks" className="block w-full">
                <Button variant="primary" className="w-full justify-center flex items-center gap-1.5" icon={<ArrowRight className="h-4.5 w-4.5" />} iconPosition="right">
                  Continue Today&apos;s Checklist
                </Button>
              </Link>

              <Button
                onClick={handleToggleStatus}
                variant="outline"
                className="w-full justify-center flex items-center gap-1.5"
                icon={isPaused ? <PlayCircle className="h-4.5 w-4.5" /> : <PauseCircle className="h-4.5 w-4.5" />}
              >
                {isPaused ? 'Resume Plan Targets' : 'Pause Study Plan'}
              </Button>
            </div>

            <div className="border-t border-surface-150 pt-4 flex flex-col gap-3 text-xs font-bold text-surface-650">
              <div className="flex justify-between items-center">
                <span>Duration</span>
                <span className="text-surface-850">{activePlan.durationDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Difficulty</span>
                <DifficultyBadge difficulty={activePlan.difficulty} />
              </div>
              <div className="flex justify-between items-center">
                <span>Active Targets Day</span>
                <span className="text-brand-600 font-extrabold">Day {currentDay}</span>
              </div>
            </div>
          </Card>

          {isPaused && (
            <Card className="border border-orange-150 bg-orange-50/50">
              <div className="flex gap-2.5">
                <AlertCircle className="h-5 w-5 text-orange-650 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-orange-850 leading-relaxed">
                  Your planner is paused. Resume to record study sessions and check off targets.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Week-Wise Timeline Grid */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="flex justify-between items-center gap-2">
            <h2 className="text-base md:text-lg font-black text-surface-850 uppercase tracking-wider">
              Syllabus Weekly Boards
            </h2>
            <span className="text-xs text-surface-450 font-semibold">{totalWeeks} Weeks total</span>
          </div>

          <div className="space-y-6">
            {weeks.map((week) => (
              <Card key={week.weekNumber} className="border border-surface-200 bg-white">
                <div className="flex items-center gap-2 border-b border-surface-100 pb-3 mb-4">
                  <Calendar className="h-4.5 w-4.5 text-brand-600" />
                  <h3 className="text-xs md:text-sm font-black text-surface-900">
                    Week {week.weekNumber}: Day {week.startDay} - Day {week.endDay}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {week.days.map((day) => {
                    let cardClass = 'border-surface-200 bg-surface-50 text-surface-450';
                    let icon = <Lock className="h-3.5 w-3.5 text-surface-300" />;

                    if (day.isCompleted) {
                      cardClass = 'border-success-200 bg-success-50/30 text-success-700 font-extrabold';
                      icon = <CheckCircle className="h-4 w-4 text-success-600" />;
                    } else if (day.isActive) {
                      cardClass = 'border-brand-300 bg-brand-50/20 text-brand-700 ring-2 ring-brand-500 font-black';
                      icon = <Play className="h-3.5 w-3.5 text-brand-650 fill-brand-650" />;
                    }

                    return (
                      <div
                        key={day.dayNumber}
                        className={`p-3 border rounded-xl flex flex-col justify-between items-center text-center gap-2.5 transition-all text-xs ${cardClass}`}
                      >
                        <p className="font-extrabold uppercase text-[9px] text-surface-400">Day {day.dayNumber}</p>
                        <span>{icon}</span>
                        {day.isActive ? (
                          <Link href="/student/tasks">
                            <span className="text-[10px] text-brand-650 font-black hover:underline cursor-pointer">Open</span>
                          </Link>
                        ) : (
                          <span className="text-[9px] font-bold text-surface-400">
                            {day.isCompleted ? 'Done' : 'Locked'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </Container>
  );
}
