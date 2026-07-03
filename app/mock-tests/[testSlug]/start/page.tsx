'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockMockTests } from '@/data/mockData';
import { MockTest, Question, MockResult } from '@/types';
import {
  Clock,
  Menu,
  ChevronLeft,
  ChevronRight,
  Send,
  Bookmark
} from 'lucide-react';

interface PageProps {
  params: Promise<{ testSlug: string }>;
}

export default function MockTestAttemptPage({ params }: PageProps) {
  const router = useRouter();
  const { testSlug } = use(params);

  const [test, setTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Track selected answers: { questionId: selectedOption }
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  // Track palette states: { questionId: 'answered' | 'review' | 'visited' | 'unvisited' }
  const [paletteStates, setPaletteStates] = useState<Record<string, string>>({});

  // Timer: remaining seconds
  const [secondsLeft, setSecondsLeft] = useState(1800); // default 30 mins
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // 1. Sync Mock Tests and retrieve matching test profile
    let savedTests = localStorage.getItem('mock_tests_db');
    if (!savedTests) {
      localStorage.setItem('mock_tests_db', JSON.stringify(mockMockTests));
      savedTests = JSON.stringify(mockMockTests);
    }
    const tests: MockTest[] = JSON.parse(savedTests);
    const item = tests.find((t) => t.slug === testSlug || t.id === testSlug);

    // 2. Sync Questions DB or seed defaults
    let savedQs = localStorage.getItem('questions_db');
    if (!savedQs) {
      const defaultQuestions: Question[] = [
        {
          id: 'q-pol-1',
          examId: 'exam-upsc',
          subject: 'Indian Polity',
          topic: 'Constitutional Framing',
          questionText: 'Who was the chairman of the Drafting Committee of the Indian Constitution?',
          optionA: 'Dr. B.R. Ambedkar',
          optionB: 'Dr. Rajendra Prasad',
          optionC: 'Jawaharlal Nehru',
          optionD: 'Sardar Vallabhbhai Patel',
          correctOption: 'A',
          explanation: 'Dr. B.R. Ambedkar was appointed the chairman of the Drafting Committee on August 29, 1947.',
          difficulty: 'Easy',
          marks: 2,
          negativeMarks: 0.5,
          status: 'published'
        },
        {
          id: 'q-pol-2',
          examId: 'exam-upsc',
          subject: 'Indian Polity',
          topic: 'Emergency Provisions',
          questionText: 'Under which Article of the Constitution can the President declare a National Emergency?',
          optionA: 'Article 352',
          optionB: 'Article 356',
          optionC: 'Article 360',
          optionD: 'Article 368',
          correctOption: 'A',
          explanation: 'Article 352 states that the President can declare a National Emergency due to war, external aggression, or armed rebellion.',
          difficulty: 'Easy',
          marks: 2,
          negativeMarks: 0.5,
          status: 'published'
        },
        {
          id: 'q-pol-3',
          examId: 'exam-upsc',
          subject: 'Indian Polity',
          topic: 'Fundamental Rights',
          questionText: 'The concept of "Fundamental Rights" in the Indian Constitution is borrowed from which nation?',
          optionA: 'United States of America',
          optionB: 'United Kingdom',
          optionC: 'Ireland',
          optionD: 'USSR',
          correctOption: 'A',
          explanation: 'Fundamental Rights in Part III of the Indian Constitution are inspired by the Bill of Rights in the US Constitution.',
          difficulty: 'Easy',
          marks: 2,
          negativeMarks: 0.5,
          status: 'published'
        },
        {
          id: 'q-math-1',
          examId: 'exam-ssc',
          subject: 'Quantitative Aptitude',
          topic: 'Number Systems',
          questionText: 'What is the remainder of 2^99 divided by 33?',
          optionA: '17',
          optionB: '16',
          optionC: '1',
          optionD: '32',
          correctOption: 'A',
          explanation: 'By writing 2^99 as (2^5)^19 * 2^4 = 32^19 * 16. Dividing by 33 yields remainder (-1)^19 * 16 = -16 = 17.',
          difficulty: 'Medium',
          marks: 2,
          negativeMarks: 0.5,
          status: 'published'
        },
        {
          id: 'q-math-2',
          examId: 'exam-ssc',
          subject: 'Quantitative Aptitude',
          topic: 'Simple Interest',
          questionText: 'If a sum of money doubles itself in 5 years at simple interest, in how many years will it become four times?',
          optionA: '15 years',
          optionB: '10 years',
          optionC: '20 years',
          optionD: '12 years',
          correctOption: 'A',
          explanation: 'Doubles in 5 years means Simple Interest is equal to principal. For 4 times, Simple Interest must be 3 times principal, taking 15 years.',
          difficulty: 'Medium',
          marks: 2,
          negativeMarks: 0.5,
          status: 'published'
        }
      ];
      localStorage.setItem('questions_db', JSON.stringify(defaultQuestions));
      savedQs = JSON.stringify(defaultQuestions);
    }
    const allQuestions: Question[] = JSON.parse(savedQs);

    setTimeout(() => {
      if (item) {
        setTest(item);
        setSecondsLeft(item.durationMinutes * 60);

        // Filter questions related to this test's subject or custom mapping
        let testQs = allQuestions.filter(
          (q) => q.subject.toLowerCase() === item.subject.toLowerCase()
        );
        if (testQs.length === 0) {
          testQs = allQuestions; // fallback
        }
        setQuestions(testQs);

        // Initialize palette states
        const initialStates: Record<string, string> = {};
        testQs.forEach((q, idx) => {
          initialStates[q.id] = idx === 0 ? 'visited' : 'unvisited';
        });
        setPaletteStates(initialStates);
      }
      setLoading(false);
    }, 0);
  }, [testSlug]);

  // Timer Countdown loop
  useEffect(() => {
    if (loading || !test) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, test]);

  // Answer Toggles
  const handleSelectOption = (option: 'A' | 'B' | 'C' | 'D') => {
    if (questions.length === 0) return;
    const q = questions[currentIdx];
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  };

  const handleSaveAndNext = () => {
    if (questions.length === 0) return;
    const q = questions[currentIdx];
    const isAnswered = answers[q.id];

    setPaletteStates((prev) => ({
      ...prev,
      [q.id]: isAnswered ? 'answered' : 'visited',
    }));

    if (currentIdx < questions.length - 1) {
      const nextId = questions[currentIdx + 1].id;
      setPaletteStates((prev) => ({
        ...prev,
        [nextId]: prev[nextId] === 'unvisited' ? 'visited' : prev[nextId],
      }));
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleClearResponse = () => {
    if (questions.length === 0) return;
    const q = questions[currentIdx];
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[q.id];
      return updated;
    });
    setPaletteStates((prev) => ({
      ...prev,
      [q.id]: 'visited',
    }));
  };

  const handleMarkForReview = () => {
    if (questions.length === 0) return;
    const q = questions[currentIdx];
    setPaletteStates((prev) => ({
      ...prev,
      [q.id]: 'review',
    }));
    if (currentIdx < questions.length - 1) {
      const nextId = questions[currentIdx + 1].id;
      setPaletteStates((prev) => ({
        ...prev,
        [nextId]: prev[nextId] === 'unvisited' ? 'visited' : prev[nextId],
      }));
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Submit test and calculate marks
  function handleSubmitTest(isAutoSubmit = false) {
    if (!isAutoSubmit) {
      const confirmSubmit = window.confirm('Are you sure you want to submit your test response sheet?');
      if (!confirmSubmit) return;
    }

    if (!test) return;

    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q) => {
      const chosen = answers[q.id];
      if (chosen) {
        if (chosen === q.correctOption) {
          score += q.marks;
          correctCount++;
        } else {
          score -= q.negativeMarks;
          incorrectCount++;
        }
      }
    });

    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
    const attemptId = `att-${Date.now()}`;

    // Format new MockResult log
    const newResult: MockResult = {
      id: attemptId,
      mockTestId: test.id,
      mockTestTitle: test.title,
      score: Math.max(0, parseFloat(score.toFixed(2))),
      totalMarks: test.totalMarks,
      accuracy,
      percentile: 92.5, // Mock baseline
      timeTakenMinutes: Math.round((test.durationMinutes * 60 - secondsLeft) / 60) || 1,
      dateAttempted: new Date().toISOString(),
      rank: '215/3400'
    };

    // Save result to localStorage
    const savedResults = localStorage.getItem('mockMockResults') || '[]';
    const updatedResults = [newResult, ...JSON.parse(savedResults)];
    localStorage.setItem('mockMockResults', JSON.stringify(updatedResults));

    // Save answer sheet for review screen
    localStorage.setItem(`attempt_answers_${attemptId}`, JSON.stringify(answers));

    alert(isAutoSubmit ? 'Time expired! Your exam was submitted automatically.' : 'Test submitted successfully.');
    router.push(`/mock-tests/result/${attemptId}`);
  }

  // Format timer text
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (loading || !test || questions.length === 0) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Preparing secure assessment environment...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Structuring questions and timer modules.</p>
      </Container>
    );
  }

  const currentQuestion = questions[currentIdx];
  const chosenOption = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-between">
      
      {/* Header bar */}
      <header className="bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h2 className="text-xs md:text-sm font-black text-surface-850 truncate max-w-sm">{test.title}</h2>
          <p className="text-[10px] text-surface-450 font-bold uppercase mt-0.5">Question {currentIdx + 1} of {questions.length}</p>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Countdown timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-100 rounded-xl text-brand-700 font-extrabold text-xs md:text-sm">
            <Clock className="h-4.5 w-4.5" /> {formatTime(secondsLeft)}
          </div>
          
          <Button onClick={() => handleSubmitTest(false)} size="sm" icon={<Send className="h-4 w-4" />}>
            Submit Test
          </Button>

          {/* Mobile drawer button toggle */}
          <button onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)} className="lg:hidden p-2 bg-surface-100 rounded-xl hover:bg-surface-200">
            <Menu className="h-5 w-5 text-surface-700" />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Left Column: Interactive Question panel */}
        <div className="flex-1 p-6 space-y-6">
          <Card className="border border-surface-200 bg-white min-h-[300px] flex flex-col justify-between">
            
            {/* Question Text */}
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-2 border-b border-surface-150 pb-3">
                <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded">
                  Q.{currentIdx + 1} ({currentQuestion.difficulty})
                </span>
                <span className="text-[10px] text-surface-450 font-bold uppercase">
                  Marks: +{currentQuestion.marks} | Negative: -{currentQuestion.negativeMarks}
                </span>
              </div>
              
              <h3 className="text-xs md:text-sm font-black text-surface-850 leading-relaxed">
                {currentQuestion.questionText}
              </h3>
            </div>

            {/* Answer Options Radio toggles */}
            <div className="space-y-3.5 mt-8">
              {[
                { key: 'A', value: currentQuestion.optionA },
                { key: 'B', value: currentQuestion.optionB },
                { key: 'C', value: currentQuestion.optionC },
                { key: 'D', value: currentQuestion.optionD },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key as 'A' | 'B' | 'C' | 'D')}
                  className={`w-full flex items-center text-left gap-3.5 p-3.5 border rounded-xl font-semibold text-xs md:text-sm transition-all cursor-pointer ${
                    chosenOption === opt.key
                      ? 'border-brand-500 bg-brand-50/20 text-brand-900 ring-1 ring-brand-500'
                      : 'border-surface-250 hover:bg-surface-50 text-surface-650'
                  }`}
                >
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    chosenOption === opt.key ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-500'
                  }`}>
                    {opt.key}
                  </span>
                  <span>{opt.value}</span>
                </button>
              ))}
            </div>

          </Card>

          {/* Action Controller controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-surface-200 rounded-2xl shadow-xs">
            <div className="flex gap-2">
              <Button
                onClick={handlePrevious}
                disabled={currentIdx === 0}
                variant="outline"
                size="sm"
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleClearResponse}
                variant="ghost"
                size="sm"
                className="text-xs font-black text-danger-600 hover:bg-danger-50"
              >
                Clear Response
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleMarkForReview} variant="secondary" size="sm" icon={<Bookmark className="h-4 w-4" />}>
                Mark for Review
              </Button>

              <Button onClick={handleSaveAndNext} size="sm" icon={<ChevronRight className="h-4 w-4" />} iconPosition="right">
                Save & Next
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette (Collapsible Drawer on mobile) */}
        <aside className={`w-full lg:w-80 bg-white border-l border-surface-200 p-6 flex flex-col justify-between sticky lg:h-[calc(100vh-73px)] lg:top-[73px] transition-transform ${
          isMobilePaletteOpen ? 'fixed inset-0 z-50 transform translate-x-0' : 'hidden lg:flex'
        }`}>
          <div className="space-y-6">
            
            {/* Header for drawer */}
            <div className="flex justify-between items-center pb-3 border-b border-surface-150">
              <h3 className="text-sm font-black text-surface-850 uppercase tracking-wider">Question Palette</h3>
              {isMobilePaletteOpen && (
                <button onClick={() => setIsMobilePaletteOpen(false)} className="text-xs font-black text-brand-650">
                  Close Drawer
                </button>
              )}
            </div>

            {/* Grid layout indices */}
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                const state = paletteStates[q.id] || 'unvisited';
                let colorClass = 'bg-surface-100 text-surface-550 border border-surface-200'; // unvisited
                
                if (state === 'visited') {
                  colorClass = 'bg-danger-50 text-danger-600 border border-danger-150'; // skipped/visited
                } else if (state === 'answered') {
                  colorClass = 'bg-success-50 text-success-700 border border-success-200'; // answered
                } else if (state === 'review') {
                  colorClass = 'bg-purple-50 text-purple-650 border border-purple-200'; // marked review
                }

                if (idx === currentIdx) {
                  colorClass += ' ring-2 ring-brand-500 ring-offset-1';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setIsMobilePaletteOpen(false);
                    }}
                    className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${colorClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Key code legend */}
          <div className="mt-8 pt-4 border-t border-surface-150 space-y-2.5 text-[10px] font-extrabold uppercase text-surface-500">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-surface-100 border border-surface-200 rounded-sm inline-block"></span>
              <span>Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-danger-50 border border-danger-150 rounded-sm inline-block"></span>
              <span>Visited & Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-success-50 border border-success-200 rounded-sm inline-block"></span>
              <span>Answered Targets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-purple-50 border border-purple-200 rounded-sm inline-block"></span>
              <span>Marked for Review</span>
            </div>
          </div>

        </aside>
      </main>

    </div>
  );
}
