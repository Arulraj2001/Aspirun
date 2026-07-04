'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { mockPlans, mockTasks } from '@/data/mockData';
import { StudyPlan, Task, MockResult, StudyMaterial, MockTest, CommunityPost, Question } from '@/types';
import {
  Trophy,
  CheckCircle,
  Flame,
  Target,
  ChevronRight,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Award,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function StudentDashboard() {
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [tasksCount, setTasksCount] = useState({ completed: 0, total: 0 });
  const [streak, setStreak] = useState(5);
  const [avgScore, setAvgScore] = useState('78.4%');
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [recMaterials, setRecMaterials] = useState<StudyMaterial[]>([]);
  const [recTests, setRecTests] = useState<MockTest[]>([]);
  const [recentResults, setRecentResults] = useState<MockResult[]>([]);
  const [followedThreads, setFollowedThreads] = useState<CommunityPost[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<{ name: string; ends_at: string } | null>(null);
  const [studentName, setStudentName] = useState('Aspirant');

  useEffect(() => {
    const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    // 1. Load active study plan
    const planId = localStorage.getItem('active_plan_id') || null;
    const plan = planId ? mockPlans.find((p) => p.id === planId) : null;

    // 2. Load daily checklist
    let parsedTasks: Task[] = [];
    let todayList: Task[] = [];
    let calculatedTasks = { completed: 0, total: 0 };
    let activeDay = 1;

    if (planId) {
      const savedTasks = localStorage.getItem(`tasks_db_${planId}`);
      if (savedTasks) {
        parsedTasks = JSON.parse(savedTasks);
      } else {
        parsedTasks = mockTasks.filter((t) => t.planId === planId);
      }

      activeDay = parseInt(localStorage.getItem(`current_day_${planId}`) || '1');
      todayList = parsedTasks.filter((t) => t.dayNumber === activeDay);

      const completedTasks = parsedTasks.filter((t) => t.status === 'completed').length;
      calculatedTasks = {
        completed: completedTasks,
        total: parsedTasks.length
      };
    }

    // 3. Load mock score logs
    const savedResults = localStorage.getItem('mockMockResults') || '[]';
    const parsedResults: MockResult[] = JSON.parse(savedResults);
    
    // Average scores
    let averagePercentage = '78.4%';
    if (parsedResults.length > 0) {
      const sum = parsedResults.reduce((acc, curr) => acc + curr.accuracy, 0);
      averagePercentage = `${Math.round(sum / parsedResults.length)}%`;
    }

    // 4. Extract weak topics (topics with wrong/skipped responses)
    const savedQuestions = localStorage.getItem('questions_db') || '[]';
    const allQuestions: Question[] = JSON.parse(savedQuestions);
    
    const weakListSet = new Set<string>();
    parsedResults.forEach((res) => {
      const answersSaved = localStorage.getItem(`attempt_answers_${res.id}`) || '{}';
      const answers = JSON.parse(answersSaved);
      
      // Look up questions for this test subject
      const testQs = allQuestions.filter((q) => q.subject.toLowerCase() === (res.mockTestTitle.includes('GS') ? 'polity' : 'general studies'));
      testQs.forEach((q) => {
        const choice = answers[q.id];
        if (!choice || choice !== q.correctOption) {
          if (q.topic) weakListSet.add(q.topic);
        }
      });
    });

    const weakArray = Array.from(weakListSet).slice(0, 3);
    if (weakArray.length === 0) {
      // default mock weak topics
      weakArray.push('Fundamental Rights', 'Preamble', 'Emergency Provisions');
    }

    // 5. Query materials recommendations
    const savedMat = localStorage.getItem('materials_db') || '[]';
    const parsedMat: StudyMaterial[] = JSON.parse(savedMat);
    const matchedMat = parsedMat.filter((m) => weakArray.some((topic) => m.subject.toLowerCase().includes(topic.toLowerCase()) || m.title.toLowerCase().includes(topic.toLowerCase()))).slice(0, 2);

    // 6. Query speed test recommendations
    const savedTests = localStorage.getItem('mock_tests_db') || '[]';
    const parsedTests: MockTest[] = JSON.parse(savedTests);
    const matchedTests = parsedTests.slice(0, 2);

    // 7. Load community followed thread alerts
    const savedThreads = localStorage.getItem('community_threads_db') || '[]';
    const parsedThreads: CommunityPost[] = JSON.parse(savedThreads);
    const user = 'Siddharth Mishra';
    const followed = parsedThreads.filter((t) => t.followers?.includes(user) || t.authorName === user).slice(0, 2);

    setTimeout(() => {
      if (plan) setActivePlan(plan);
      setTodayTasks(todayList);
      setTasksCount(calculatedTasks);
      setRecentResults(parsedResults.slice(0, 2));
      setWeakTopics(weakArray);
      setRecMaterials(matchedMat.length > 0 ? matchedMat : parsedMat.slice(0, 2));
      setRecTests(matchedTests);
      setAvgScore(averagePercentage);
      setFollowedThreads(followed.length > 0 ? followed : parsedThreads.slice(0, 2));
      
      // Streak count sync
      const streakSaved = planId ? (localStorage.getItem('study_streak_count') || '5') : '0';
      setStreak(parseInt(streakSaved));
    }, 0);

    const checkSubscription = async () => {
      if (isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: sub } = await supabase
              .from('student_subscriptions')
              .select('*, subscription_plans(name)')
              .eq('user_id', session.user.id)
              .eq('status', 'active')
              .gt('ends_at', new Date().toISOString())
              .maybeSingle();

            if (sub) {
              const planName = (sub.subscription_plans as any)?.name || 'Pro Pass';
              setActiveSubscription({
                name: planName,
                ends_at: sub.ends_at
              });
            }
          }
        } catch (err) {
          console.error("Failed to load student active subscription:", err);
        }
      } else {
        const savedSub = localStorage.getItem('simulated_subscription');
        if (savedSub) {
          const sub = JSON.parse(savedSub);
          if (sub.status === 'active' && new Date(sub.ends_at) > new Date()) {
            setActiveSubscription({
              name: sub.name,
              ends_at: sub.ends_at
            });
          }
        }
      }
    };
    checkSubscription();

    const loadProfileName = async () => {
      if (isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', session.user.id)
              .single();
            if (data?.full_name) {
              setStudentName(data.full_name);
            } else {
              const googleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
              if (googleName) {
                setStudentName(googleName);
              } else {
                setStudentName(session.user.email?.split('@')[0] || 'Aspirant');
              }
            }
          }
        } catch (err) {
          console.error("Failed to load profile name:", err);
        }
      } else {
        const saved = localStorage.getItem('simulated_profile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.fullName) {
              setStudentName(parsed.fullName);
            }
          } catch {}
        }
      }
    };
    loadProfileName();
  }, []);

  const progressPercent = tasksCount.total > 0 ? (tasksCount.completed / tasksCount.total) * 100 : 0;

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Welcome Hero Panel */}
      <div className="bg-gradient-to-r from-brand-900 to-indigo-950 text-white rounded-3xl p-6 md:p-10 border border-brand-800 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6 scale-150">
          <Trophy className="h-64 w-64 text-white" />
        </div>
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-brand-500/35 border border-brand-400 text-brand-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Student Dashboard
            </span>
            {activeSubscription ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-brand-500 text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-inner animate-pulse">
                <Sparkles className="h-3 w-3 text-brand-200" /> Active: {activeSubscription.name} ({Math.max(0, Math.ceil((new Date(activeSubscription.ends_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} Days Left)
              </span>
            ) : (
              <Link href="/pricing">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-surface-850 hover:bg-surface-750 text-brand-300 text-[9px] font-black uppercase tracking-wider rounded-full transition-colors border border-surface-700">
                  Upgrade to Pro Pass <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight pt-1">
            Welcome back, {studentName}!
          </h1>
          <p className="text-xs md:text-sm text-brand-100 font-semibold leading-relaxed">
            {activePlan ? "Your daily target milestones are mapped. Finish today's tasks checklist to maintain your streak cycle." : "You have no active study plan. Select a study plan from the Syllabus Roadmaps to begin your preparation!"}
          </p>
          <div className="pt-4 flex flex-wrap gap-3">
            {activePlan ? (
              <>
                <Link href="/student/tasks">
                  <Button size="sm" variant="secondary" className="font-black px-6 shadow">
                    Resume Today&apos;s Tasks
                  </Button>
                </Link>
                <Link href="/student/my-plan">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 font-bold border border-white/20 px-6">
                    View Week Roadmaps
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/study-planner">
                <Button size="sm" variant="secondary" className="font-black px-6 shadow">
                  Browse Syllabus Roadmaps
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats indicators grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Study Streak"
          value={`${streak} Days`}
          icon={<Flame className="h-5 w-5 text-orange-650" />}
          description="Consistent active days"
        />
        <StatCard
          title="Tasks Completed"
          value={`${tasksCount.completed} / ${tasksCount.total}`}
          icon={<CheckCircle className="h-5 w-5 text-success-650" />}
          description="Total plan targets completed"
        />
        <StatCard
          title="Average Quiz Score"
          value={avgScore}
          icon={<Award className="h-5 w-5 text-brand-650" />}
          description="Average mock accuracy"
        />
        <StatCard
          title="Overall Progress"
          value={`${Math.round(progressPercent)}%`}
          icon={<Target className="h-5 w-5 text-blue-500" />}
          description="Active syllabus coverage"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Today's targets, active plan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's targets checklist widget */}
          <Card className="border border-surface-200">
            <div className="flex justify-between items-center gap-4 mb-4 border-b border-surface-100 pb-3">
              <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-5 w-5 text-brand-500" />
                Today&apos;s Target Checklist
              </h3>
              <Link href="/student/tasks">
                <span className="text-xs font-black text-brand-650 hover:underline flex items-center gap-1">
                  All Tasks <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            </div>

            {todayTasks.length === 0 ? (
              <p className="text-xs text-surface-450 italic py-4">No tasks configured for today. Resume your plan to initialize checklists.</p>
            ) : (
              <div className="space-y-3">
                {todayTasks.map((t) => (
                  <div key={t.id} className="flex justify-between items-center gap-4 p-3 bg-surface-50 rounded-xl border border-surface-200">
                    <div>
                      <h4 className="text-xs md:text-sm font-black text-surface-800">{t.title}</h4>
                      <p className="text-[10px] text-surface-450 font-bold mt-0.5">{t.estimatedMinutes} mins &bull; {t.category}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      t.status === 'completed' 
                        ? 'bg-success-50 text-success-700 border border-success-100' 
                        : 'bg-surface-200 text-surface-600'
                    }`}>
                      {t.status === 'completed' ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active study plan roadmap card */}
          {activePlan && (
            <Card className="border border-surface-200">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                    Active Study Syllabus
                  </span>
                  <h3 className="text-base md:text-lg font-black text-surface-900 mt-2 leading-snug">
                    {activePlan.title}
                  </h3>
                </div>
                <Link href="/student/my-plan">
                  <Button variant="outline" size="sm" className="h-8 text-xs font-black">
                    Continue Plan
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-surface-500 font-semibold mb-6">
                {activePlan.description}
              </p>

              <div className="p-4 bg-surface-50 rounded-2xl border border-surface-150 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-surface-600">
                  <span>Syllabus Completed</span>
                  <span className="text-brand-600 font-black">{Math.round(progressPercent)}%</span>
                </div>
                <ProgressBar value={progressPercent} color="brand" />
              </div>
            </Card>
          )}

          {!activePlan && (
            <Card className="border border-surface-200 bg-surface-50 text-center p-8 rounded-3xl flex flex-col items-center gap-3">
              <span className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                <BookOpen className="h-6 w-6" />
              </span>
              <h4 className="text-sm md:text-base font-black text-surface-850">Ready to start your exam prep?</h4>
              <p className="text-xs text-surface-500 font-semibold max-w-sm">
                Aspirav creates daily study roadmaps, checklists, and sectional quizzes tailored to your exam syllabus. Choose your exam to begin!
              </p>
              <Link href="/study-planner" className="mt-2">
                <Button size="sm" variant="primary" className="font-black px-6">
                  Select Study Plan
                </Button>
              </Link>
            </Card>
          )}

          {/* Recent results scorecard */}
          <Card className="border border-surface-200">
            <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider mb-4 border-b pb-3">
              Recent Mock Results
            </h3>

            {recentResults.length === 0 ? (
              <p className="text-xs text-surface-450 italic py-4">No speed tests attempted yet.</p>
            ) : (
              <div className="space-y-4">
                {recentResults.map((res) => (
                  <div key={res.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-surface-50 rounded-2xl border border-surface-150">
                    <div>
                      <h4 className="text-xs md:text-sm font-black text-surface-800">{res.mockTestTitle}</h4>
                      <p className="text-[9px] text-surface-450 font-bold uppercase mt-1">Attempt Date: {new Date(res.dateAttempted).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs font-black text-brand-650 bg-white border px-2 py-0.5 rounded">
                        Score: {res.score}/{res.totalMarks}
                      </span>
                      <Link href={`/mock-tests/result/${res.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] uppercase font-black">
                          Analysis
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

        {/* Right column: Weak topics, recommendations, followed threads */}
        <div className="space-y-6">
          
          {/* Weak Topics Isolated */}
          <Card className="border border-surface-200 bg-danger-50/15">
            <h3 className="text-sm font-black text-surface-850 mb-3 flex items-center gap-1.5">
              <AlertCircle className="h-4.5 w-4.5 text-danger-650" />
              Isolated Weak topics
            </h3>
            <p className="text-[10px] text-surface-450 font-bold leading-relaxed mb-4">
              Concepts flagged due to wrong quiz responses. Prioritize study targets.
            </p>

            <div className="flex flex-wrap gap-2">
              {weakTopics.map((topic, i) => (
                <span key={i} className="text-[10px] font-bold text-danger-700 bg-danger-50 border border-danger-100 px-2 py-0.5 rounded-lg">
                  {topic}
                </span>
              ))}
            </div>
          </Card>

          {/* Recommended Materials */}
          {recMaterials.length > 0 && (
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 flex items-center gap-1.5">
                <BookOpen className="h-4.5 w-4.5 text-brand-650" />
                Recommended Study Guides
              </h3>

              <div className="space-y-3">
                {recMaterials.map((mat) => (
                  <div key={mat.id} className="p-3 bg-surface-50 border rounded-xl flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border px-1.5 py-0.2 rounded self-start">
                      {mat.category}
                    </span>
                    <h4 className="text-xs font-black text-surface-850 line-clamp-1 leading-snug">{mat.title}</h4>
                    <Link href={`/materials/${mat.slug || mat.id}`} className="mt-1">
                      <span className="text-[10px] font-black text-brand-650 hover:underline flex items-center gap-0.5">
                        Read notes <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommended Mock Tests */}
          {recTests.length > 0 && (
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-orange-500" />
                Recommended Speed Tests
              </h3>

              <div className="space-y-3.5">
                {recTests.map((t) => (
                  <div key={t.id} className="flex justify-between items-center gap-4 border-b last:border-0 pb-2.5 last:pb-0">
                    <div>
                      <h4 className="text-xs font-black text-surface-800 line-clamp-1">{t.title}</h4>
                      <p className="text-[9px] text-surface-450 font-bold uppercase mt-0.5">{t.totalQuestions} Qs &bull; {t.durationMinutes} mins</p>
                    </div>
                    <Link href={`/mock-tests/${t.slug || t.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0">
                        <ChevronRight className="h-4.5 w-4.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Followed Threads alerts */}
          <Card className="border border-surface-200">
            <h3 className="text-sm font-black text-surface-850 mb-4 flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-brand-650" />
              Followed Threads Alerts
            </h3>

            <div className="space-y-3">
              {followedThreads.map((thread) => (
                <div key={thread.id} className="p-2.5 bg-surface-50 border rounded-xl flex flex-col gap-1.5 hover:border-surface-300 transition-colors">
                  <h4 className="text-xs font-black text-surface-850 line-clamp-1 leading-snug">
                    {thread.title}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] font-bold text-surface-450">
                    <span>Replies: {thread.repliesCount}</span>
                    <Link href={`/community/thread/${thread.id}`} className="text-brand-650 hover:underline font-black">
                      View thread
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </Container>
  );
}
