'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { mockExams } from '@/data/mockData';
import { Exam } from '@/types';
import { Plus, Trash2, Edit, ArrowLeft, Save, Layers } from 'lucide-react';

interface ExtendedExam extends Exam {
  subjects?: Record<string, string[]>; // e.g. { "Polity": ["Preamble", "Fundamental Rights"] }
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<ExtendedExam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states for Exam Info
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');

  // Form states for Subjects/Topics
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newTopicName, setNewTopicName] = useState<Record<string, string>>({}); // subject -> topic text input

  useEffect(() => {
    const saved = localStorage.getItem('exams_db');
    let parsed: ExtendedExam[] = [];
    if (saved) {
      parsed = JSON.parse(saved);
    } else {
      // Seed default exams with some subjects
      parsed = mockExams.map((e) => ({
        ...e,
        subjects: e.id === 'exam-upsc' 
          ? ({ 'Polity & Constitution': ['Constitutional Framework', 'Fundamental Rights', 'DPSP'], 'History': ['Ancient India', 'Modern History'] } as Record<string, string[]>)
          : ({ 'Quantitative Aptitude': ['Arithmetic', 'Algebra', 'Geometry'], 'English': ['Grammar', 'Reading Comprehension'] } as Record<string, string[]>)
      }));
      localStorage.setItem('exams_db', JSON.stringify(parsed));
    }
    setTimeout(() => {
      setExams(parsed);
      if (parsed.length > 0) {
        setSelectedExamId(parsed[0].id);
      }
      setLoading(false);
    }, 0);
  }, []);

  const activeExam = exams.find((e) => e.id === selectedExamId);

  useEffect(() => {
    if (activeExam) {
      setTimeout(() => {
        setName(activeExam.name);
        setCode(activeExam.code);
        setDescription(activeExam.description);
        setSlug(activeExam.slug);
      }, 0);
    } else {
      setTimeout(() => {
        setName('');
        setCode('');
        setDescription('');
        setSlug('');
      }, 0);
    }
  }, [selectedExamId, isEditing, activeExam]);

  const handleAddExam = () => {
    setSelectedExamId(null);
    setIsEditing(true);
    setName('');
    setCode('');
    setDescription('');
    setSlug('');
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !slug.trim()) return;

    let updated: ExtendedExam[] = [];
    if (selectedExamId) {
      // Edit mode
      updated = exams.map((exam) => {
        if (exam.id === selectedExamId) {
          return { ...exam, name, code, description, slug };
        }
        return exam;
      });
      alert('Exam details saved successfully.');
    } else {
      // Create mode
      const newExam: ExtendedExam = {
        id: `exam-cust-${Date.now()}`,
        name,
        code,
        description,
        slug,
        activePlansCount: 0,
        subjects: {}
      };
      updated = [...exams, newExam];
      setSelectedExamId(newExam.id);
      alert('New Govt Exam created successfully.');
    }

    localStorage.setItem('exams_db', JSON.stringify(updated));
    setExams(updated);
    setIsEditing(false);
  };

  const handleDeleteExam = (id: string) => {
    if (!confirm('Are you sure you want to delete this exam? All associated subject profiles will be deleted.')) return;
    const updated = exams.filter((e) => e.id !== id);
    localStorage.setItem('exams_db', JSON.stringify(updated));
    setExams(updated);
    if (updated.length > 0) {
      setSelectedExamId(updated[0].id);
    } else {
      setSelectedExamId(null);
    }
    alert('Exam profile deleted.');
  };

  // Subjects / Topics management
  const handleAddSubject = () => {
    if (!activeExam || !newSubjectName.trim()) return;
    const updatedSubjects = { ...(activeExam.subjects || {}) };
    if (updatedSubjects[newSubjectName.trim()]) {
      alert('Subject already exists.');
      return;
    }
    updatedSubjects[newSubjectName.trim()] = [];

    const updatedExams = exams.map((exam) => {
      if (exam.id === activeExam.id) {
        return { ...exam, subjects: updatedSubjects };
      }
      return exam;
    });

    localStorage.setItem('exams_db', JSON.stringify(updatedExams));
    setExams(updatedExams);
    setNewSubjectName('');
  };

  const handleDeleteSubject = (subjName: string) => {
    if (!activeExam || !confirm(`Remove subject "${subjName}" and all its subtopics?`)) return;
    const updatedSubjects = { ...(activeExam.subjects || {}) };
    delete updatedSubjects[subjName];

    const updatedExams = exams.map((exam) => {
      if (exam.id === activeExam.id) {
        return { ...exam, subjects: updatedSubjects };
      }
      return exam;
    });

    localStorage.setItem('exams_db', JSON.stringify(updatedExams));
    setExams(updatedExams);
  };

  const handleAddTopic = (subjName: string) => {
    const topicVal = newTopicName[subjName];
    if (!activeExam || !topicVal || !topicVal.trim()) return;

    const updatedSubjects = { ...(activeExam.subjects || {}) };
    const list = [...(updatedSubjects[subjName] || [])];
    if (list.includes(topicVal.trim())) {
      alert('Topic already configured.');
      return;
    }
    list.push(topicVal.trim());
    updatedSubjects[subjName] = list;

    const updatedExams = exams.map((exam) => {
      if (exam.id === activeExam.id) {
        return { ...exam, subjects: updatedSubjects };
      }
      return exam;
    });

    localStorage.setItem('exams_db', JSON.stringify(updatedExams));
    setExams(updatedExams);
    setNewTopicName((prev) => ({ ...prev, [subjName]: '' }));
  };

  const handleDeleteTopic = (subjName: string, topicIdx: number) => {
    if (!activeExam) return;
    const updatedSubjects = { ...(activeExam.subjects || {}) };
    const list = [...(updatedSubjects[subjName] || [])];
    list.splice(topicIdx, 1);
    updatedSubjects[subjName] = list;

    const updatedExams = exams.map((exam) => {
      if (exam.id === activeExam.id) {
        return { ...exam, subjects: updatedSubjects };
      }
      return exam;
    });

    localStorage.setItem('exams_db', JSON.stringify(updatedExams));
    setExams(updatedExams);
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Govt Exams Manager
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Configure target recruitment tests, syllabus subjects, and chapters structures.
          </p>
        </div>

        <Button size="sm" onClick={handleAddExam} icon={<Plus className="h-4.5 w-4.5" />}>
          Register Govt Exam
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold">Syncing exam matrices...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: List of Exams */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-black uppercase text-surface-450 tracking-wider">
              Registered Exams ({exams.length})
            </h3>

            <div className="space-y-3">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExamId(exam.id);
                    setIsEditing(false);
                  }}
                  className={`w-full text-left p-4 border rounded-2xl flex justify-between items-center transition-all cursor-pointer ${
                    selectedExamId === exam.id
                      ? 'border-brand-500 bg-brand-50/15 shadow-sm'
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded">
                      {exam.code}
                    </span>
                    <h4 className="text-xs md:text-sm font-black text-surface-850 mt-2 leading-tight">
                      {exam.name}
                    </h4>
                  </div>
                  <Layers className={`h-4.5 w-4.5 ${selectedExamId === exam.id ? 'text-brand-650' : 'text-surface-300'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Detailed form or subjects builder */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Exam info editor / viewer */}
            {isEditing || !activeExam ? (
              <Card className="border border-surface-200">
                <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4">
                  {selectedExamId ? 'Modify Exam Profile' : 'Register New Govt Exam'}
                </h3>

                <form onSubmit={handleSaveExam} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Exam Official Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. UPSC Civil Services"
                      required
                    />
                    <Input
                      label="Abbreviation / Code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. UPSC-CSE"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="URL Path Slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. upsc-cse"
                      required
                    />
                    <div className="flex items-end justify-end gap-3 pt-6">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" icon={<Save className="h-4.5 w-4.5" />}>
                        Save Details
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    label="Exam Brief Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide overview details..."
                    rows={3}
                  />
                </form>
              </Card>
            ) : (
              <div className="space-y-6">
                
                {/* Profile Card */}
                <Card className="border border-surface-200">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                        {activeExam.code}
                      </span>
                      <h2 className="text-lg md:text-xl font-black text-surface-900 mt-2">{activeExam.name}</h2>
                      <p className="text-xs text-surface-500 font-semibold mt-1 max-w-2xl">{activeExam.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit Profile
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteExam(activeExam.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Subjects & Topics Manager */}
                <Card className="border border-surface-200">
                  <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4 border-b pb-2">
                    Syllabus Chapters Builder
                  </h3>

                  {/* Add Subject form */}
                  <div className="flex gap-3 mb-6">
                    <Input
                      placeholder="e.g. General Economy or Reasoning"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="primary" onClick={handleAddSubject} className="h-[40px] mt-6 shrink-0">
                      Add Subject
                    </Button>
                  </div>

                  {/* List of Subjects & Topics */}
                  <div className="space-y-6">
                    {!activeExam.subjects || Object.keys(activeExam.subjects).length === 0 ? (
                      <p className="text-xs text-surface-450 italic py-4">No subjects currently configured for this exam profile.</p>
                    ) : (
                      Object.entries(activeExam.subjects).map(([subj, topics]) => (
                        <div key={subj} className="p-4 bg-surface-50 border rounded-2xl space-y-4">
                          <div className="flex justify-between items-center border-b pb-2">
                            <h4 className="text-xs md:text-sm font-black text-surface-850">{subj}</h4>
                            <button
                              onClick={() => handleDeleteSubject(subj)}
                              className="text-[10px] text-danger-650 hover:underline font-black flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove Subject
                            </button>
                          </div>

                          {/* Topics List */}
                          <div className="flex flex-wrap gap-2">
                            {topics.map((topic, tIdx) => (
                              <span key={tIdx} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-surface-700 bg-white border border-surface-250 px-2.5 py-1 rounded-xl shadow-xs">
                                {topic}
                                <button
                                  onClick={() => handleDeleteTopic(subj, tIdx)}
                                  className="text-surface-400 hover:text-danger-650 font-black ml-0.5 cursor-pointer"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>

                          {/* Add Topic form */}
                          <div className="flex gap-2 pt-2">
                            <Input
                              placeholder="e.g. Fundamental Rights or Trigonometry"
                              value={newTopicName[subj] || ''}
                              onChange={(e) => setNewTopicName({ ...newTopicName, [subj]: e.target.value })}
                              className="flex-1 text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-[36px] mt-6 bg-white text-surface-700 hover:bg-surface-50 shrink-0"
                              onClick={() => handleAddTopic(subj)}
                            >
                              Add Chapter
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

              </div>
            )}

          </div>

        </div>
      )}
    </Container>
  );
}
