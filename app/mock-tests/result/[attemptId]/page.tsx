'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Question, MockResult, StudyMaterial, MockTest } from '@/types';
import {
  ArrowLeft,
  AlertCircle,
  BookOpen,
  Award,
  Clock,
  Percent,
  MessageSquare,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface PageProps {
  params: Promise<{ attemptId: string }>;
}

export default function MockResultAnalyticsPage({ params }: PageProps) {
  const router = useRouter();
  const { attemptId } = use(params);

  const [result, setResult] = useState<MockResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [allTests, setAllTests] = useState<MockTest[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    // 1. Sync Mock Results and find matching attempt logs
    const savedResults = localStorage.getItem('mockMockResults') || '[]';
    const results: MockResult[] = JSON.parse(savedResults);
    
    // Fallback: If not in local storage, check if it's one of the seed IDs or make one
    let item = results.find((r) => r.id === attemptId);
    if (!item && attemptId.startsWith('mock-res-')) {
      // Map seed results to dynamic mocks
      item = {
        id: attemptId,
        mockTestId: 'mock-upsc-pre-gs1',
        mockTestTitle: 'UPSC Civil Services Prelims GS Paper 1',
        score: 132.5,
        totalMarks: 200,
        accuracy: 82,
        percentile: 96.8,
        timeTakenMinutes: 105,
        dateAttempted: new Date().toISOString(),
        rank: '45/12400'
      };
    }

    // 2. Load selected answers sheet
    const savedAnswers = localStorage.getItem(`attempt_answers_${attemptId}`) || '{}';
    const parsedAnswers = JSON.parse(savedAnswers);

    // 3. Load question bank
    const savedQs = localStorage.getItem('questions_db') || '[]';
    const allQuestions: Question[] = JSON.parse(savedQs);

    // 4. Load materials bank for recommendations
    const savedMat = localStorage.getItem('materials_db') || '[]';
    const parsedMat = JSON.parse(savedMat);

    // 5. Load tests list
    const savedTests = localStorage.getItem('mock_tests_db') || '[]';
    const parsedTests = JSON.parse(savedTests);

    setTimeout(() => {
      if (item) {
        setResult(item);
        setAnswers(parsedAnswers);
        
        // Find test to filter subjects
        const testMatch = parsedTests.find((t: MockTest) => t.id === item.mockTestId);
        let testQs = allQuestions.filter(
          (q) => q.subject.toLowerCase() === (testMatch?.subject || '').toLowerCase()
        );
        if (testQs.length === 0) {
          testQs = allQuestions; // fallback
        }
        
        setQuestions(testQs);
        setMaterials(parsedMat);
        setAllTests(parsedTests);
      }
      setLoading(false);
    }, 0);
  }, [attemptId]);

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Compiling scorecard dashboard...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Analyzing subject logs and weak topic recommendations.</p>
      </Container>
    );
  }

  if (!result || questions.length === 0) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Scorecard Not Found</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">We couldn&apos;t load the analysis metrics for attempt: &quot;{attemptId}&quot;.</p>
        <Link href="/mock-tests">
          <Button>Back to Mock Tests</Button>
        </Link>
      </Container>
    );
  }

  // Calculate detailed counts
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  questions.forEach((q) => {
    const userChoice = answers[q.id];
    if (!userChoice) {
      skippedCount++;
    } else if (userChoice === q.correctOption) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  // Subject performance details mapping
  const subjectPerformance: Record<string, { total: number; correct: number; incorrect: number; marks: number; score: number }> = {};
  
  questions.forEach((q) => {
    const sub = q.subject || 'General Studies';
    if (!subjectPerformance[sub]) {
      subjectPerformance[sub] = { total: 0, correct: 0, incorrect: 0, marks: 0, score: 0 };
    }
    const userChoice = answers[q.id];
    subjectPerformance[sub].total++;
    subjectPerformance[sub].marks += q.marks;

    if (userChoice) {
      if (userChoice === q.correctOption) {
        subjectPerformance[sub].correct++;
        subjectPerformance[sub].score += q.marks;
      } else {
        subjectPerformance[sub].incorrect++;
        subjectPerformance[sub].score -= q.negativeMarks;
      }
    }
  });

  // Weak topics isolation (topics with incorrect or skipped responses)
  const weakTopics = Array.from(
    new Set(
      questions
        .filter((q) => {
          const choice = answers[q.id];
          return !choice || choice !== q.correctOption;
        })
        .map((q) => q.topic)
        .filter(Boolean)
    )
  );

  // Recommendations: Materials
  const recommendedMaterials = materials
    .filter((mat) => {
      // Recommend materials related to the target exam category or weak subject areas
      return mat.examId === result.mockTestId || weakTopics.some((topic) => mat.subject.toLowerCase().includes(topic?.toLowerCase() || ''));
    })
    .slice(0, 3);

  // Recommendations: Topic Mocks
  const recommendedTests = allTests
    .filter((t) => t.id !== result.mockTestId && t.subject === questions[0]?.subject)
    .slice(0, 2);

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back to list */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/student/mock-results" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to History Logs
        </Link>
        <span className="text-[10px] text-surface-450 font-bold">Attempt ID: {attemptId}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-xl md:text-3.5xl font-black text-surface-900 leading-snug">
          Performance Analytics Report
        </h1>
        <p className="text-xs text-surface-500 font-semibold mt-1">
          Review metrics, subject accuracy indicators, weak concepts, and study recommendations.
        </p>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Final Score"
          value={`${result.score} / ${result.totalMarks}`}
          icon={<Award className="h-5 w-5 text-brand-650" />}
          description="Net obtained marks"
        />
        <StatCard
          title="Accuracy Ratio"
          value={`${result.accuracy}%`}
          icon={<Percent className="h-5 w-5 text-success-650" />}
          description="Percentage of correct choices"
        />
        <StatCard
          title="Time Expended"
          value={`${result.timeTakenMinutes} Mins`}
          icon={<Clock className="h-5 w-5 text-orange-500" />}
          description="Total test time logged"
        />
        <StatCard
          title="Peer Percentile"
          value={`${result.percentile}%`}
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
          description="Relative rank standings"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Solution review, Performance grid */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Question response stats sheet */}
          <Card className="border border-surface-200">
            <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100 uppercase tracking-wider">
              Attempt Response Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3.5 bg-success-50/50 border border-success-100 rounded-2xl">
                <span className="text-base md:text-xl font-black text-success-700">{correctCount}</span>
                <p className="text-[10px] text-success-600 font-bold uppercase mt-1">Correct answers</p>
              </div>
              <div className="p-3.5 bg-danger-50/50 border border-danger-100 rounded-2xl">
                <span className="text-base md:text-xl font-black text-danger-600">{wrongCount}</span>
                <p className="text-[10px] text-danger-500 font-bold uppercase mt-1">Wrong responses</p>
              </div>
              <div className="p-3.5 bg-surface-50 border border-surface-150 rounded-2xl">
                <span className="text-base md:text-xl font-black text-surface-500">{skippedCount}</span>
                <p className="text-[10px] text-surface-450 font-bold uppercase mt-1">Skipped answers</p>
              </div>
            </div>
          </Card>

          {/* Subject Analysis Grid */}
          <Card className="border border-surface-200">
            <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100 uppercase tracking-wider">
              Sectional Performance Summary
            </h3>

            <div className="space-y-4">
              {Object.entries(subjectPerformance).map(([subjectName, stats]) => {
                const subAccuracy = stats.correct + stats.incorrect > 0 
                  ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) 
                  : 0;

                return (
                  <div key={subjectName} className="p-4 bg-surface-50 rounded-2xl border border-surface-150 space-y-2">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="text-xs md:text-sm font-black text-surface-850">{subjectName}</h4>
                      <span className="text-xs font-black text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                        Accuracy: {subAccuracy}%
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-surface-500 pt-2 border-t border-surface-100">
                      <div>
                        <p className="text-surface-400 font-bold uppercase">Total Qs</p>
                        <p className="font-extrabold text-surface-800 text-xs mt-0.5">{stats.total}</p>
                      </div>
                      <div>
                        <p className="text-success-600 font-bold uppercase">Correct</p>
                        <p className="font-extrabold text-success-700 text-xs mt-0.5">{stats.correct}</p>
                      </div>
                      <div>
                        <p className="text-danger-500 font-bold uppercase">Incorrect</p>
                        <p className="font-extrabold text-danger-600 text-xs mt-0.5">{stats.incorrect}</p>
                      </div>
                      <div>
                        <p className="text-brand-600 font-bold uppercase">Net Score</p>
                        <p className="font-extrabold text-brand-700 text-xs mt-0.5">{stats.score.toFixed(2)} / {stats.marks}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Solutions Review Sheets */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-surface-850 uppercase tracking-wider">
              Detailed Question Review
            </h3>

            {questions.map((q, idx) => {
              const choice = answers[q.id];
              const isCorrect = choice === q.correctOption;
              const isSkipped = !choice;

              return (
                <Card key={q.id} className="border border-surface-200 bg-white space-y-4">
                  <div className="flex justify-between items-center gap-2 border-b border-surface-150 pb-2.5">
                    <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
                      Question {idx + 1} &bull; {q.difficulty}
                    </span>

                    {isSkipped ? (
                      <span className="text-[10px] font-black text-surface-450 bg-surface-100 px-2 py-0.5 rounded border border-surface-150">
                        Skipped (0 Marks)
                      </span>
                    ) : isCorrect ? (
                      <span className="text-[10px] font-black text-success-700 bg-success-50 px-2 py-0.5 rounded border border-success-100">
                        Correct (+{q.marks} Marks)
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-danger-600 bg-danger-50 px-2 py-0.5 rounded border border-danger-150">
                        Incorrect (-{q.negativeMarks} Marks)
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs md:text-sm font-black text-surface-850 leading-relaxed">
                    {q.questionText}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                    {[
                      { key: 'A', value: q.optionA },
                      { key: 'B', value: q.optionB },
                      { key: 'C', value: q.optionC },
                      { key: 'D', value: q.optionD },
                    ].map((opt) => {
                      const isOptionCorrect = q.correctOption === opt.key;
                      const isOptionSelected = choice === opt.key;
                      
                      let optClass = 'border-surface-200 text-surface-650 bg-white';
                      if (isOptionCorrect) {
                        optClass = 'border-success-500 bg-success-50/20 text-success-900 font-extrabold ring-1 ring-success-500';
                      } else if (isOptionSelected) {
                        optClass = 'border-danger-500 bg-danger-50/20 text-danger-900 font-extrabold ring-1 ring-danger-500';
                      }

                      return (
                        <div
                          key={opt.key}
                          className={`flex items-center gap-3 p-3 border rounded-xl text-xs md:text-sm transition-all ${optClass}`}
                        >
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                            isOptionCorrect 
                              ? 'bg-success-600 text-white' 
                              : isOptionSelected 
                              ? 'bg-danger-600 text-white' 
                              : 'bg-surface-100 text-surface-500'
                          }`}>
                            {opt.key}
                          </span>
                          <span>{opt.value}</span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-4 pt-4 border-t border-surface-150 bg-surface-50 p-3 rounded-xl">
                      <h5 className="text-[10px] font-black uppercase text-brand-650 tracking-wider">Solution Explanation:</h5>
                      <p className="text-xs text-surface-550 leading-relaxed font-semibold mt-1">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

        </div>

        {/* Right Column: Weak Topics & Recommendations */}
        <div className="space-y-6">
          
          {/* Weak Topics */}
          <Card className="border border-surface-200">
            <h3 className="text-sm font-black text-surface-850 mb-3 flex items-center gap-1.5">
              <AlertCircle className="h-4.5 w-4.5 text-danger-500" />
              Weak Topics Isolated
            </h3>
            <p className="text-[11px] text-surface-450 mb-4 font-semibold">
              These concepts resulted in wrong or skipped answers. We recommend prioritizing revisions in these modules.
            </p>

            {weakTopics.length === 0 ? (
              <p className="text-xs text-success-700 bg-success-50 border border-success-100 p-3 rounded-xl font-bold">
                Perfect! No weak topics detected in this assessment session.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((topic, i) => (
                  <span key={i} className="text-[10px] font-bold text-danger-700 bg-danger-50 border border-danger-100 px-2.5 py-1 rounded-xl">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Recommended Materials */}
          {recommendedMaterials.length > 0 && (
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 flex items-center gap-1.5">
                <BookOpen className="h-4.5 w-4.5 text-brand-650" />
                Recommended Study Guides
              </h3>
              <div className="space-y-3">
                {recommendedMaterials.map((mat) => (
                  <div key={mat.id} className="p-3 bg-surface-50 rounded-xl border border-surface-150 flex flex-col gap-2">
                    <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded self-start">
                      {mat.category}
                    </span>
                    <h4 className="text-xs font-black text-surface-850 leading-snug line-clamp-1">{mat.title}</h4>
                    <Link href={`/materials/${mat.slug || mat.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black justify-center w-full">
                        Read Revision notes
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recommended Practice Tests */}
          {recommendedTests.length > 0 && (
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-orange-500" />
                Recommended Speed Tests
              </h3>
              <div className="space-y-3">
                {recommendedTests.map((testItem) => (
                  <div key={testItem.id} className="flex justify-between items-center gap-4 p-2.5 rounded-xl border border-surface-150 hover:border-surface-200 transition-colors">
                    <div>
                      <h5 className="text-[11px] font-black text-surface-800 line-clamp-1">{testItem.title}</h5>
                      <p className="text-[9px] text-surface-450 font-bold uppercase mt-0.5">{testItem.totalQuestions} Questions &bull; {testItem.durationMinutes} Mins</p>
                    </div>
                    <Link href={`/mock-tests/${testItem.slug || testItem.id}`} className="shrink-0">
                      <span className="p-1 bg-surface-100 hover:bg-brand-50 hover:text-brand-650 rounded-lg inline-flex cursor-pointer transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Forum doubt redirection CTA */}
          <Card className="border border-surface-200 bg-surface-50/50 text-center py-6 px-4">
            <span className="p-3 bg-brand-50 text-brand-650 rounded-full inline-flex mb-3.5">
              <MessageSquare className="h-5.5 w-5.5" />
            </span>
            <h4 className="text-xs md:text-sm font-black text-surface-850">Cleared details still confusing?</h4>
            <p className="text-[11px] text-surface-450 font-semibold mt-1 mb-4 leading-relaxed">
              Post your doubt card in the peer community channels to discuss answers with serious aspirants.
            </p>
            <Link href="/community">
              <Button variant="ghost" size="sm" className="w-full justify-center">
                Create Forum Doubt Card
              </Button>
            </Link>
          </Card>

        </div>

      </div>
    </Container>
  );
}
