'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { mockExams } from '@/data/mockData';
import { Question, Difficulty } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminCreateQuestionPage() {
  const router = useRouter();

  // Form Fields State
  const [examId, setExamId] = useState('exam-upsc');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionTextHindi, setQuestionTextHindi] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [explanationHindi, setExplanationHindi] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [marks, setMarks] = useState('2');
  const [negativeMarks, setNegativeMarks] = useState('0.5');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !questionText.trim() || !optionA.trim() || !optionB.trim()) {
      alert('Please fill out all mandatory fields (Subject, Question Text, Option A and Option B).');
      return;
    }

    // Load active questions DB
    const saved = localStorage.getItem('questions_db') || '[]';
    const currentQuestions: Question[] = JSON.parse(saved);

    const newQuestion: Question = {
      id: `q-cust-${Date.now()}`,
      examId,
      subject,
      topic: topic.trim() ? topic.trim() : undefined,
      questionText,
      questionTextHindi: questionTextHindi.trim() ? questionTextHindi.trim() : undefined,
      optionA,
      optionB,
      optionC: optionC.trim() ? optionC.trim() : 'N/A',
      optionD: optionD.trim() ? optionD.trim() : 'N/A',
      correctOption,
      explanation: explanation.trim() ? explanation.trim() : undefined,
      explanationHindi: explanationHindi.trim() ? explanationHindi.trim() : undefined,
      difficulty,
      marks: parseFloat(marks) || 2,
      negativeMarks: parseFloat(negativeMarks) || 0.5,
      status
    };

    localStorage.setItem('questions_db', JSON.stringify([...currentQuestions, newQuestion]));
    router.push('/admin/questions');
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/admin/questions" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Questions List
        </Link>
      </div>

      <SectionHeader
        title="Add New Question"
        subtitle="Catalog revision questions to pop sectional tests or daily quizzes."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Core Question fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Question Details
              </h3>

              <div className="space-y-4">
                
                {/* Subject and Topic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Subject Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Indian Polity"
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Topic Milestone
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Fundamental Rights"
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* English Question Text */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Question Text (English) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter the question statement in English..."
                    className="w-full px-4 py-3 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Hindi Question Text */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Question Text (Hindi - Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={questionTextHindi}
                    onChange={(e) => setQuestionTextHindi(e.target.value)}
                    placeholder="Enter the question statement in Hindi..."
                    className="w-full px-4 py-3 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500 text-surface-550"
                  />
                </div>

              </div>
            </Card>

            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Answer Choices
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Option A *
                  </label>
                  <input
                    type="text"
                    required
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="Option A text"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Option B *
                  </label>
                  <input
                    type="text"
                    required
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="Option B text"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Option C
                  </label>
                  <input
                    type="text"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    placeholder="Option C text"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500 text-surface-550"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Option D
                  </label>
                  <input
                    type="text"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    placeholder="Option D text"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500 text-surface-550"
                  />
                </div>
              </div>
            </Card>

            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Solution Explanations
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Written Explanation (English)
                  </label>
                  <textarea
                    rows={4}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Provide step-by-step logic details in English..."
                    className="w-full px-4 py-3 text-xs md:text-sm font-medium border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Written Explanation (Hindi)
                  </label>
                  <textarea
                    rows={4}
                    value={explanationHindi}
                    onChange={(e) => setExplanationHindi(e.target.value)}
                    placeholder="Provide step-by-step logic details in Hindi..."
                    className="w-full px-4 py-3 text-xs md:text-sm font-medium border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500 text-surface-550"
                  />
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column: Taxonomy parameters */}
          <div className="space-y-6">
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Taxonomy & Marks
              </h3>

              <div className="space-y-4">
                
                {/* Target Exam Category */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Target Exam Category
                  </label>
                  <Select
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                    options={mockExams.map((e) => ({ value: e.id, label: e.name }))}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Difficulty Level
                  </label>
                  <Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    options={[
                      { value: 'Easy', label: 'Easy' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Hard', label: 'Hard' },
                    ]}
                  />
                </div>

                {/* Correct Option */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Correct Option *
                  </label>
                  <Select
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value as 'A' | 'B' | 'C' | 'D')}
                    options={[
                      { value: 'A', label: 'Option A' },
                      { value: 'B', label: 'Option B' },
                      { value: 'C', label: 'Option C' },
                      { value: 'D', label: 'Option D' },
                    ]}
                  />
                </div>

                {/* Marks / Neg Marks */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Marks +
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Negative -
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={negativeMarks}
                      onChange={(e) => setNegativeMarks(e.target.value)}
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Publishing Status
                  </label>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    options={[
                      { value: 'published', label: 'Published (Active)' },
                      { value: 'draft', label: 'Draft (Internal)' },
                    ]}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" size="md" className="w-full justify-center" icon={<Save className="h-4.5 w-4.5" />}>
                    Save Question
                  </Button>
                </div>

              </div>
            </Card>
          </div>

        </div>
      </form>
    </Container>
  );
}
