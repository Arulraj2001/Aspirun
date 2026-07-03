'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { mockExams } from '@/data/mockData';
import { Question, MockTest, Difficulty } from '@/types';
import { ArrowLeft, Save, Plus } from 'lucide-react';

export default function AdminCreateMockTestPage() {
  const router = useRouter();

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [examId, setExamId] = useState('exam-upsc');
  const [subject, setSubject] = useState('');
  const [testType, setTestType] = useState<'daily' | 'topic' | 'sectional' | 'mini' | 'full'>('sectional');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [totalMarks, setTotalMarks] = useState('100');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [language, setLanguage] = useState('English');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [negativeMarking, setNegativeMarking] = useState('0.25');

  // Question Selector State
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  useEffect(() => {
    // Load question bank to link questions
    const savedQs = localStorage.getItem('questions_db') || '[]';
    const parsedQs = JSON.parse(savedQs);
    setTimeout(() => {
      setAllQuestions(parsedQs);
    }, 0);
  }, []);

  const handleToggleQuestion = (qId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !subject.trim()) {
      alert('Please fill out the title and subject fields.');
      return;
    }

    const finalSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : title.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const saved = localStorage.getItem('mock_tests_db') || '[]';
    const currentTests: MockTest[] = JSON.parse(saved);

    const newTest: MockTest = {
      id: `mock-cust-${Date.now()}`,
      examId,
      title,
      durationMinutes: parseInt(durationMinutes) || 30,
      totalQuestions: selectedQuestions.length || 10,
      totalMarks: parseFloat(totalMarks) || 100,
      difficulty,
      subject,
      isFree,
      slug: finalSlug,
      testType,
      language,
      price: !isFree && price ? parseFloat(price) : undefined,
      status,
      negativeMarking: parseFloat(negativeMarking) || 0.25,
      questions: selectedQuestions
    };

    localStorage.setItem('mock_tests_db', JSON.stringify([...currentTests, newTest]));
    router.push('/admin/mock-tests');
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/admin/mock-tests" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Mock Tests
        </Link>
      </div>

      <SectionHeader
        title="Schedule New Mock Test"
        subtitle="Catalog speed quizzes, daily checkups, sectional mocks, or full-length paper simulators."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form Core Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Mock Metadata
              </h3>

              <div className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Mock Test Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., SSC CGL Tier 1 Quantitative Sectional Mock"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Custom Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g., ssc-maths-sectional"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500 text-surface-550"
                  />
                </div>

                {/* Subject Area */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Subject Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Quantitative Aptitude"
                    className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

              </div>
            </Card>

            {/* Questions Bank Attachment */}
            <Card className="border border-surface-200">
              <div className="flex justify-between items-center gap-2 border-b border-surface-100 pb-3 mb-4">
                <h3 className="text-sm font-black text-surface-850">
                  Select Question Bank Items ({selectedQuestions.length} selected)
                </h3>
                <Link href="/admin/questions/new">
                  <span className="text-[10px] font-black uppercase text-brand-650 flex items-center gap-1 cursor-pointer">
                    <Plus className="h-3.5 w-3.5" /> Create New Q
                  </span>
                </Link>
              </div>

              {allQuestions.length === 0 ? (
                <p className="text-xs text-surface-450 font-semibold py-4">
                  No questions in bank. Save some questions in the question bank dashboard first.
                </p>
              ) : (
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {allQuestions.map((q) => (
                    <label key={q.id} className="flex items-start gap-3 p-3 rounded-xl border border-surface-150 bg-surface-50/50 hover:bg-surface-50 cursor-pointer select-none transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(q.id)}
                        onChange={() => handleToggleQuestion(q.id)}
                        className="mt-0.5"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-surface-850 leading-snug line-clamp-1">{q.questionText}</h4>
                        <p className="text-[9px] text-surface-450 font-bold uppercase mt-1">
                          {q.subject} &bull; Difficulty: {q.difficulty} &bull; Correct: {q.correctOption}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </Card>

          </div>

          {/* Right Column: Publishing settings */}
          <div className="space-y-6">
            <Card className="border border-surface-200">
              <h3 className="text-sm font-black text-surface-850 mb-4 pb-2 border-b border-surface-100">
                Taxonomy & Controls
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

                {/* Format Type */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Mock Test Format
                  </label>
                  <Select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as 'daily' | 'topic' | 'sectional' | 'mini' | 'full')}
                    options={[
                      { value: 'sectional', label: 'Sectional Test' },
                      { value: 'daily', label: 'Daily Quiz' },
                      { value: 'topic', label: 'Topic Test' },
                      { value: 'mini', label: 'Mini Mock' },
                      { value: 'full', label: 'Full Length' },
                    ]}
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

                {/* Timing & Marks parameters */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-surface-700 uppercase tracking-wider mb-2">
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-surface-700 uppercase tracking-wider mb-2">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-surface-700 uppercase tracking-wider mb-2">
                      Negative
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={negativeMarking}
                      onChange={(e) => setNegativeMarking(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Pricing Toggles */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Access Level
                  </label>
                  <Select
                    value={isFree ? 'free' : 'premium'}
                    onChange={(e) => setIsFree(e.target.value === 'free')}
                    options={[
                      { value: 'free', label: 'Free Access' },
                      { value: 'premium', label: 'Premium Locked' },
                    ]}
                  />
                </div>

                {/* Price input */}
                {!isFree && (
                  <div>
                    <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                      Price (INR optional)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 49"
                      className="w-full px-4 py-2 text-xs md:text-sm font-semibold border border-surface-250 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}

                {/* Language */}
                <div>
                  <label className="block text-xs font-black text-surface-700 uppercase tracking-wider mb-2">
                    Paper Language
                  </label>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    options={[
                      { value: 'English', label: 'English Only' },
                      { value: 'Hindi', label: 'Bilingual (Hindi/English)' },
                    ]}
                  />
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
                    Save Mock Test
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
