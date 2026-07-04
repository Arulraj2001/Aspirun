'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockExams, mockMockTests } from '@/data/mockData';
import { MockTest } from '@/types';
import { FileQuestion, Clock, Award, PlayCircle, Search, AlertCircle } from 'lucide-react';

export default function MockTestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [examId, setExamId] = useState('all');
  const [subject, setSubject] = useState('all');
  const [type, setType] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [pricing, setPricing] = useState('all');

  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [selectedMock, setSelectedMock] = useState<MockTest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Sync mock tests list with localStorage db
    let saved = localStorage.getItem('mock_tests_db');
    if (!saved) {
      localStorage.setItem('mock_tests_db', JSON.stringify(mockMockTests));
      saved = JSON.stringify(mockMockTests);
    }
    const data: MockTest[] = JSON.parse(saved);
    setTimeout(() => {
      setMockTests(data.filter((m) => m.status !== 'draft'));
    }, 0);
  }, []);

  const handleOpenInstructions = (mock: MockTest) => {
    setSelectedMock(mock);
    setIsModalOpen(true);
  };

  const handleStartMock = () => {
    if (!selectedMock) return;
    const role = localStorage.getItem('simulated_role') || 'guest';
    if (role === 'guest') {
      alert('Please login to continue.');
      return;
    }
    setIsModalOpen(false);
    // Redirect to attempt start route
    const testSlug = selectedMock.slug || selectedMock.id;
    window.location.href = `/mock-tests/${testSlug}/start`;
  };

  // Filters logic
  const filteredMocks = mockTests.filter((mock) => {
    // 1. Text Search matching title or subject
    if (searchTerm.trim() && !mock.title.toLowerCase().includes(searchTerm.toLowerCase()) && !mock.subject.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // 2. Filter by Exam Category
    if (examId !== 'all' && mock.examId !== examId) {
      return false;
    }
    // 3. Filter by Subject
    if (subject !== 'all' && mock.subject.toLowerCase() !== subject.toLowerCase()) {
      return false;
    }
    // 4. Filter by Test Type
    if (type !== 'all' && mock.testType !== type) {
      return false;
    }
    // 5. Filter by Difficulty
    if (difficulty !== 'all' && mock.difficulty !== difficulty) {
      return false;
    }
    // 6. Filter by Pricing
    if (pricing !== 'all') {
      const isFreeMatch = pricing === 'free' ? mock.isFree : !mock.isFree;
      if (!isFreeMatch) return false;
    }
    return true;
  });

  const uniqueSubjects = Array.from(new Set(mockTests.map((m) => m.subject)));

  return (
    <Container size="xl" className="py-8 md:py-12">
      <SectionHeader
        title="Mock Tests & Sectional Quizzes"
        subtitle="Practice high-quality mock questions patterned after latest paper designs to enhance your speed and accuracy."
      />

      {/* Toolbar filters grid */}
      <Card className="border border-surface-200 mb-8 bg-surface-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-surface-450" />
            <input
              type="text"
              placeholder="Search mock tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-surface-250 rounded-xl text-xs md:text-sm font-semibold bg-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Exam Category */}
          <Select
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            options={[
              { value: 'all', label: 'All Exams' },
              ...mockExams.map((e) => ({ value: e.id, label: e.name })),
            ]}
          />

          {/* Subject Category */}
          <Select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            options={[
              { value: 'all', label: 'All Subjects' },
              ...uniqueSubjects.map((sub) => ({ value: sub, label: sub })),
            ]}
          />

          {/* Test Type dropdown */}
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'daily', label: 'Daily Quiz' },
              { value: 'topic', label: 'Topic Test' },
              { value: 'sectional', label: 'Sectional Test' },
              { value: 'mini', label: 'Mini Mock' },
              { value: 'full', label: 'Full Length' },
            ]}
          />

          {/* Difficulty Dropdown */}
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: 'all', label: 'All Levels' },
              { value: 'Easy', label: 'Easy Level' },
              { value: 'Medium', label: 'Medium Level' },
              { value: 'Hard', label: 'Hard Level' },
            ]}
          />

          {/* Free/Premium Pricing */}
          <Select
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            options={[
              { value: 'all', label: 'Free & Premium' },
              { value: 'free', label: 'Free Tests' },
              { value: 'premium', label: 'Premium Tests' },
            ]}
          />

        </div>
      </Card>

      {/* Grid view listing */}
      {filteredMocks.length === 0 ? (
        <Card className="text-center py-12 border border-surface-200 bg-surface-50/20">
          <AlertCircle className="h-10 w-10 text-surface-300 mx-auto mb-3" />
          <h4 className="text-sm font-extrabold text-surface-850">No Tests Found</h4>
          <p className="text-xs text-surface-450 mt-1 font-semibold">Try adjusting your filters or search keywords.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {filteredMocks.map((mock) => {
            const associatedExam = mockExams.find((e) => e.id === mock.examId);
            return (
              <Card key={mock.id} className="border border-surface-200 flex flex-col justify-between hover:border-surface-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
                      {associatedExam?.code || 'Govt Exam'}
                    </span>
                    <DifficultyBadge difficulty={mock.difficulty} />
                  </div>

                  <h3 className="text-sm md:text-base font-black text-surface-900 leading-snug line-clamp-2 mb-3">
                    {mock.title}
                  </h3>
                  
                  <p className="text-[11px] text-surface-500 font-bold uppercase mb-4">
                    Subject Area: {mock.subject}
                  </p>

                  <div className="grid grid-cols-3 gap-2 border-t border-b border-surface-150 py-3 mb-5 text-center text-xs font-semibold text-surface-650 bg-surface-50 rounded-xl">
                    <div>
                      <span className="flex items-center justify-center gap-1 text-[9px] text-surface-450 uppercase mb-0.5 font-bold">
                        <FileQuestion className="h-3.5 w-3.5" /> Qs
                      </span>
                      <span className="font-extrabold text-surface-800">{mock.totalQuestions}</span>
                    </div>
                    <div>
                      <span className="flex items-center justify-center gap-1 text-[9px] text-surface-450 uppercase mb-0.5 font-bold">
                        <Clock className="h-3.5 w-3.5" /> Mins
                      </span>
                      <span className="font-extrabold text-surface-800">{mock.durationMinutes}</span>
                    </div>
                    <div>
                      <span className="flex items-center justify-center gap-1 text-[9px] text-surface-450 uppercase mb-0.5 font-bold">
                        <Award className="h-3.5 w-3.5" /> Marks
                      </span>
                      <span className="font-extrabold text-surface-800">{mock.totalMarks}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <StatusBadge status={mock.isFree ? 'free' : 'locked'} />
                  <Button
                    onClick={() => handleOpenInstructions(mock)}
                    size="sm"
                    variant={mock.isFree ? 'primary' : 'secondary'}
                    icon={<PlayCircle className="h-4.5 w-4.5" />}
                  >
                    {mock.isFree ? 'Attempt Test' : 'Unlock Test'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Instructions Modal Panel */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Mock Test Instructions"
        footer={
          <div className="flex gap-2.5 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStartMock}>
              Start Assessment
            </Button>
          </div>
        }
      >
        {selectedMock && (
          <div className="space-y-4">
            <h4 className="text-sm md:text-base font-black text-surface-900 leading-snug">{selectedMock.title}</h4>
            <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 grid grid-cols-3 gap-2 text-center text-xs font-bold text-surface-700">
              <div>
                <p className="text-[10px] text-surface-450 uppercase mb-0.5 font-bold">Duration</p>
                <p className="font-extrabold text-base text-brand-600">{selectedMock.durationMinutes} Mins</p>
              </div>
              <div>
                <p className="text-[10px] text-surface-450 uppercase mb-0.5 font-bold">Total Questions</p>
                <p className="font-extrabold text-base text-brand-600">{selectedMock.totalQuestions}</p>
              </div>
              <div>
                <p className="text-[10px] text-surface-450 uppercase mb-0.5 font-bold">Maximum Marks</p>
                <p className="font-extrabold text-base text-brand-600">{selectedMock.totalMarks}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs md:text-sm text-surface-600 font-semibold leading-relaxed">
              <h5 className="font-extrabold text-surface-850">Please read standard instructions carefully:</h5>
              <ul className="list-disc pl-5 space-y-1.5 font-semibold text-surface-550">
                <li>This test consists of objective multiple-choice questions.</li>
                <li>There is standard negative marking of 1/4th of the allotted mark for incorrect answers.</li>
                <li>Once started, the timer cannot be paused. Ensure you have stable internet connection.</li>
                <li>Do not reload the browser window or navigate away as it will auto-submit the exam.</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  );
}
