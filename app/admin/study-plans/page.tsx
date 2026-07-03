'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { mockPlans, mockExams } from '@/data/mockData';
import { StudyPlan, Exam } from '@/types';
import { Plus, Trash2, Edit, ArrowLeft, Save, BookMarked, Eye, EyeOff } from 'lucide-react';

interface ExtendedStudyPlan extends StudyPlan {
  isPublished?: boolean;
}

export default function AdminStudyPlansPage() {
  const [plans, setPlans] = useState<ExtendedStudyPlan[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states for Plan info
  const [title, setTitle] = useState('');
  const [examId, setExamId] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isFree, setIsFree] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    // 1. Load plans
    const savedPlans = localStorage.getItem('plans_db');
    let parsedPlans: ExtendedStudyPlan[] = [];
    if (savedPlans) {
      parsedPlans = JSON.parse(savedPlans);
    } else {
      parsedPlans = mockPlans.map((p) => ({ ...p, isPublished: true }));
      localStorage.setItem('plans_db', JSON.stringify(parsedPlans));
    }

    // 2. Load exams
    const savedExams = localStorage.getItem('exams_db');
    let parsedExams = [];
    if (savedExams) {
      parsedExams = JSON.parse(savedExams);
    } else {
      parsedExams = mockExams;
    }

    setTimeout(() => {
      setPlans(parsedPlans);
      setExams(parsedExams);
      if (parsedPlans.length > 0) {
        setSelectedPlanId(parsedPlans[0].id);
      }
      setLoading(false);
    }, 0);
  }, []);

  const activePlan = plans.find((p) => p.id === selectedPlanId);

  useEffect(() => {
    if (activePlan) {
      setTimeout(() => {
        setTitle(activePlan.title);
        setExamId(activePlan.examId);
        setDescription(activePlan.description);
        setDurationDays(activePlan.durationDays);
        setDifficulty(activePlan.difficulty);
        setIsFree(activePlan.isFree);
        setIsPublished(activePlan.isPublished !== false);
      }, 0);
    } else {
      setTimeout(() => {
        setTitle('');
        setExamId(exams.length > 0 ? exams[0].id : '');
        setDescription('');
        setDurationDays(30);
        setDifficulty('Medium');
        setIsFree(true);
        setIsPublished(true);
      }, 0);
    }
  }, [selectedPlanId, isEditing, exams, activePlan]);

  const handleAddPlan = () => {
    setSelectedPlanId(null);
    setIsEditing(true);
    setTitle('');
    setExamId(exams.length > 0 ? exams[0].id : '');
    setDescription('');
    setDurationDays(30);
    setDifficulty('Medium');
    setIsFree(true);
    setIsPublished(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !examId) return;

    let updated: ExtendedStudyPlan[] = [];
    if (selectedPlanId) {
      updated = plans.map((p) => {
        if (p.id === selectedPlanId) {
          return {
            ...p,
            title,
            examId,
            description,
            durationDays,
            difficulty,
            isFree,
            isPublished
          };
        }
        return p;
      });
      alert('Study plan saved.');
    } else {
      const newPlan: ExtendedStudyPlan = {
        id: `plan-cust-${Date.now()}`,
        examId,
        title,
        description,
        durationDays,
        enrolledCount: 0,
        rating: 5.0,
        difficulty,
        isFree,
        isPublished,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      updated = [...plans, newPlan];
      setSelectedPlanId(newPlan.id);
      alert('New study plan registered.');
    }

    localStorage.setItem('plans_db', JSON.stringify(updated));
    setPlans(updated);
    setIsEditing(false);
  };

  const handleDeletePlan = (id: string) => {
    if (!confirm('Are you sure you want to delete this study plan?')) return;
    const updated = plans.filter((p) => p.id !== id);
    localStorage.setItem('plans_db', JSON.stringify(updated));
    setPlans(updated);
    if (updated.length > 0) {
      setSelectedPlanId(updated[0].id);
    } else {
      setSelectedPlanId(null);
    }
    alert('Study plan roadmap deleted.');
  };

  const handleTogglePublish = (id: string) => {
    const updated = plans.map((p) => {
      if (p.id === id) {
        const nextState = p.isPublished === false;
        alert(`Plan ${nextState ? 'published' : 'unpublished'}.`);
        return { ...p, isPublished: nextState };
      }
      return p;
    });
    localStorage.setItem('plans_db', JSON.stringify(updated));
    setPlans(updated);
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back link */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-150 pb-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
            Study Planners Manager
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Build day-wise study roadmap checklists and link speed tests.
          </p>
        </div>

        <Button size="sm" onClick={handleAddPlan} icon={<Plus className="h-4.5 w-4.5" />}>
          Create Study Plan
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold animate-pulse">Syncing planners catalogs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: catalog list */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-black uppercase text-surface-450 tracking-wider">
              Study Planners ({plans.length})
            </h3>

            <div className="space-y-3">
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlanId(p.id);
                    setIsEditing(false);
                  }}
                  className={`w-full text-left p-4 border rounded-2xl flex justify-between items-center transition-all cursor-pointer ${
                    selectedPlanId === p.id
                      ? 'border-brand-500 bg-brand-50/15 shadow-sm'
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-black uppercase text-surface-500 bg-surface-100 px-1.5 py-0.2 rounded">
                        {p.difficulty}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                        p.isPublished !== false ? 'bg-success-50 text-success-700 border-success-200' : 'bg-surface-100 text-surface-500 border-surface-250'
                      }`}>
                        {p.isPublished !== false ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="text-xs md:text-sm font-black text-surface-850 leading-snug line-clamp-2">
                      {p.title}
                    </h4>
                  </div>
                  <BookMarked className={`h-4.5 w-4.5 shrink-0 ${selectedPlanId === p.id ? 'text-brand-650' : 'text-surface-300'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: editor or day tasks details view */}
          <div className="lg:col-span-2 space-y-6">
            
            {isEditing || !activePlan ? (
              <Card className="border border-surface-200">
                <h3 className="text-xs md:text-sm font-black uppercase text-surface-850 tracking-wider mb-4">
                  {selectedPlanId ? 'Modify Plan Info' : 'Create Study Planner'}
                </h3>

                <form onSubmit={handleSavePlan} className="space-y-4">
                  <Input
                    label="Plan Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. UPSC CSE 30-Day Polity Master Plan"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Linked Govt Exam"
                      value={examId}
                      onChange={(e) => setExamId(e.target.value)}
                      options={exams.map((e) => ({ value: e.id, label: e.name }))}
                    />
                    <Input
                      label="Duration (Days)"
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value) || 30)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      label="Difficulty Tier"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                      options={[
                        { value: 'Easy', label: 'Easy' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'Hard', label: 'Hard' }
                      ]}
                    />
                    <Select
                      label="Billing Type"
                      value={isFree ? 'true' : 'false'}
                      onChange={(e) => setIsFree(e.target.value === 'true')}
                      options={[
                        { value: 'true', label: 'Free Access' },
                        { value: 'false', label: 'Premium (UPI Lock)' }
                      ]}
                    />
                    <Select
                      label="Status"
                      value={isPublished ? 'true' : 'false'}
                      onChange={(e) => setIsPublished(e.target.value === 'true')}
                      options={[
                        { value: 'true', label: 'Published / Active' },
                        { value: 'false', label: 'Draft' }
                      ]}
                    />
                  </div>

                  <Textarea
                    label="Plan Description Overview"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain what study goals this roadmap accomplishes..."
                    rows={4}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" icon={<Save className="h-4.5 w-4.5" />}>
                      Save Planner
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <div className="space-y-6">
                
                {/* Info Card */}
                <Card className="border border-surface-200">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                          {exams.find((e) => e.id === activePlan.examId)?.code || 'Govt Exam'}
                        </span>
                        <span className="text-[9px] font-black uppercase text-surface-550 bg-surface-50 px-2 py-0.5 rounded">
                          {activePlan.difficulty}
                        </span>
                        <span className="text-[9px] font-black uppercase text-success-700 bg-success-50 px-2 py-0.5 rounded">
                          {activePlan.isFree ? 'Free' : 'Premium'}
                        </span>
                      </div>
                      <h2 className="text-base md:text-lg font-black text-surface-900 leading-snug">{activePlan.title}</h2>
                      <p className="text-xs text-surface-500 font-bold uppercase mt-1">Duration: {activePlan.durationDays} Days &bull; Rating: {activePlan.rating}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleTogglePublish(activePlan.id)} icon={activePlan.isPublished !== false ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}>
                        {activePlan.isPublished !== false ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit Info
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeletePlan(activePlan.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Day Tasks Configurator Alert placeholder */}
                <Card className="border border-surface-200 bg-surface-50/50">
                  <h3 className="text-xs font-black uppercase tracking-wider text-surface-850 mb-3 border-b pb-2">
                    Daily Curriculum Scheduler
                  </h3>
                  <p className="text-xs text-surface-550 leading-relaxed font-semibold">
                    The detailed checklists and day tasks for this planner can be configured by visiting the Day Tasks catalog manager.
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Link href="/admin/tasks">
                      <Button size="sm" icon={<Plus className="h-4 w-4" />}>
                        Configure Day Tasks
                      </Button>
                    </Link>
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
