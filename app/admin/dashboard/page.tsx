'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { mockPlans, mockCommunityPosts, mockMaterials, mockMockTests, mockBlogs, mockCurrentAffairs } from '@/data/mockData';
import { CommunityPost } from '@/types';
import {
  Users,
  FileText,
  AlertTriangle,
  Lock,
  ShieldAlert,
  Award,
  BookOpen,
  Globe,
  HelpCircle,
  CreditCard,
  Settings,
  PlusCircle
} from 'lucide-react';

interface PaymentSettings {
  payment_mode: 'on' | 'off';
}

interface PaymentRequest {
  status: 'pending' | 'approved' | 'rejected';
}

interface StudentUser {
  id: string;
  name: string;
  username: string;
  role: string;
  isBanned?: boolean;
  isMuted?: boolean;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Stats
  const [studentsCount, setStudentsCount] = useState(85240);
  const [plansCount, setPlansCount] = useState(0);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [mocksCount, setMocksCount] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const [currentAffairsCount, setCurrentAffairsCount] = useState(0);
  const [bannedUsersCount, setBannedUsersCount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'on' | 'off'>('off');
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);

  useEffect(() => {
    // 1. Initialize blogs
    const savedBlogs = localStorage.getItem('blogs_db') || JSON.stringify(mockBlogs);
    const blogsList = JSON.parse(savedBlogs);

    // 2. Initialize current affairs
    const savedCA = localStorage.getItem('current_affairs_db') || JSON.stringify(mockCurrentAffairs);
    const caList = JSON.parse(savedCA);

    // 3. Initialize materials
    const savedMat = localStorage.getItem('materials_db') || JSON.stringify(mockMaterials);
    const matList = JSON.parse(savedMat);

    // 4. Initialize mock tests
    const savedMocks = localStorage.getItem('mock_tests_db') || JSON.stringify(mockMockTests);
    const mockList = JSON.parse(savedMocks);

    // 5. Initialize study plans
    const savedPlans = localStorage.getItem('plans_db') || JSON.stringify(mockPlans);
    const plansList = JSON.parse(savedPlans);

    // 6. Initialize questions count
    const savedQs = localStorage.getItem('daily_quiz_configured_questions');
    let qCount = 12;
    if (savedQs) {
      qCount = JSON.parse(savedQs).length;
    }

    // 7. Initialize student users
    const savedUsers = localStorage.getItem('users_db');
    let studCount = 85240;
    let bannedCount = 0;
    if (savedUsers) {
      const usersList: StudentUser[] = JSON.parse(savedUsers);
      studCount += usersList.length;
      bannedCount = usersList.filter((u) => u.isBanned || u.isMuted).length;
    }

    // 8. Payment settings
    const savedPaymentSettings = localStorage.getItem('payment_settings');
    let payMode: 'on' | 'off' = 'off';
    if (savedPaymentSettings) {
      const settings: PaymentSettings = JSON.parse(savedPaymentSettings);
      payMode = settings.payment_mode;
    }

    // 9. Pending payment requests
    const savedPayReqs = localStorage.getItem('payment_requests_db');
    let pendPayments = 0;
    if (savedPayReqs) {
      const reqs: PaymentRequest[] = JSON.parse(savedPayReqs);
      pendPayments = reqs.filter((r) => r.status === 'pending').length;
    }

    // 10. Flag community posts
    const flagged = mockCommunityPosts.map((p, idx) => {
      if (idx === 2) {
        return { ...p, reportsCount: 3 };
      }
      return p;
    });

    setTimeout(() => {
      setBlogsCount(blogsList.length);
      setCurrentAffairsCount(caList.length);
      setMaterialsCount(matList.length);
      setMocksCount(mockList.length);
      setPlansCount(plansList.length);
      setQuestionsCount(qCount);
      setStudentsCount(studCount);
      setBannedUsersCount(bannedCount);
      setPaymentMode(payMode);
      setPendingPaymentsCount(pendPayments);
      setPosts(flagged);
      setLoading(false);
    }, 0);
  }, []);

  const handleRemovePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    alert('Post removed from community successfully due to guideline violations.');
  };

  const flaggedPosts = posts.filter((p) => p.reportsCount > 0);

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <p className="text-xs text-surface-450 font-bold">Consolidating control stats...</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      
      {/* Simulation Info */}
      <div className="bg-danger-50 border border-danger-150 p-4 rounded-2xl flex items-center gap-3 text-xs md:text-sm font-semibold text-danger-850">
        <ShieldAlert className="h-5 w-5 text-danger-650 shrink-0" />
        <span>You are simulating the Admin dashboard. Perform safety audits and planner updates directly below.</span>
      </div>

      <SectionHeader
        title="Admin Control Center"
        subtitle="Manage exams, syllabus planners, community guidelines, and doubt report audits."
      />

      {/* Stats Panel */}
      <div>
        <h3 className="text-xs font-black uppercase text-surface-450 tracking-wider mb-4">
          Control Center Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={studentsCount.toLocaleString()}
            icon={<Users className="h-5 w-5 text-brand-650" />}
            description="Active verified student accounts"
          />
          <StatCard
            title="Active Study Plans"
            value={plansCount}
            icon={<FileText className="h-5 w-5 text-success-650" />}
            description="Configured exam roadmaps"
          />
          <StatCard
            title="Study Materials"
            value={materialsCount}
            icon={<BookOpen className="h-5 w-5 text-purple-600" />}
            description="Published PDFs & study notes"
          />
          <StatCard
            title="Mock Assessments"
            value={mocksCount}
            icon={<Award className="h-5 w-5 text-orange-600" />}
            description="Published mock speed tests"
          />
          <StatCard
            title="Question Bank"
            value={questionsCount}
            icon={<HelpCircle className="h-5 w-5 text-blue-600" />}
            description="Configured MCQ questions"
          />
          <StatCard
            title="Guidance Blogs"
            value={blogsCount}
            icon={<BookOpen className="h-5 w-5 text-teal-650" />}
            description="Toppers strategy guides"
          />
          <StatCard
            title="Current Affairs"
            value={currentAffairsCount}
            icon={<Globe className="h-5 w-5 text-indigo-650" />}
            description="Published GK news cards"
          />
          <StatCard
            title="Doubt Reports"
            value={flaggedPosts.length}
            icon={<AlertTriangle className="h-5 w-5 text-danger-650" />}
            description="Community flags pending audit"
          />
          <StatCard
            title="Banned/Muted Users"
            value={bannedUsersCount}
            icon={<Lock className="h-5 w-5 text-danger-700" />}
            description="Community access suspensions"
          />
          <StatCard
            title="Payment Locks Status"
            value={paymentMode.toUpperCase()}
            icon={<Settings className="h-5 w-5 text-surface-600" />}
            description="UPI Lock toggle configuration"
          />
          <StatCard
            title="Pending Payments"
            value={pendingPaymentsCount}
            icon={<CreditCard className="h-5 w-5 text-purple-750" />}
            description="Manual UTR logs pending audit"
          />
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div>
        <h3 className="text-xs font-black uppercase text-surface-450 tracking-wider mb-4">
          Quick Actions Launchpad
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/admin/study-plans">
            <Button size="sm" variant="primary" className="w-full justify-center" icon={<PlusCircle className="h-4.5 w-4.5" />}>
              Add Study Plan
            </Button>
          </Link>
          <Link href="/admin/tasks">
            <Button size="sm" variant="success" className="w-full justify-center" icon={<PlusCircle className="h-4.5 w-4.5" />}>
              Add Day Tasks
            </Button>
          </Link>
          <Link href="/admin/materials/new">
            <Button size="sm" variant="outline" className="w-full justify-center text-surface-700 border-surface-300 hover:bg-surface-50" icon={<PlusCircle className="h-4.5 w-4.5 text-purple-650" />}>
              Add Material
            </Button>
          </Link>
          <Link href="/admin/mock-tests/new">
            <Button size="sm" variant="outline" className="w-full justify-center text-surface-700 border-surface-300 hover:bg-surface-50" icon={<PlusCircle className="h-4.5 w-4.5 text-orange-650" />}>
              Add Mock Test
            </Button>
          </Link>
          <Link href="/admin/questions/new">
            <Button size="sm" variant="outline" className="w-full justify-center text-surface-700 border-surface-300 hover:bg-surface-50" icon={<PlusCircle className="h-4.5 w-4.5 text-blue-650" />}>
              Add Question
            </Button>
          </Link>
          <Link href="/admin/blogs/new">
            <Button size="sm" variant="outline" className="w-full justify-center text-surface-700 border-surface-300 hover:bg-surface-50" icon={<PlusCircle className="h-4.5 w-4.5 text-teal-650" />}>
              Post Blog
            </Button>
          </Link>
          <Link href="/admin/current-affairs/new">
            <Button size="sm" variant="outline" className="w-full justify-center text-surface-700 border-surface-300 hover:bg-surface-50" icon={<PlusCircle className="h-4.5 w-4.5 text-indigo-650" />}>
              Post CA Post
            </Button>
          </Link>
          <Link href="/admin/community">
            <Button size="sm" variant="danger" className="w-full justify-center" icon={<ShieldAlert className="h-4.5 w-4.5" />}>
              Moderate Community
            </Button>
          </Link>
        </div>
      </div>

      {/* Secondary Administration Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        <Card className="border border-surface-200">
          <h3 className="text-sm font-black text-surface-850 mb-3 flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-brand-650" />
            General Management Modules
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link href="/admin/exams" className="p-3 bg-surface-50 hover:bg-brand-50/20 border border-surface-150 rounded-xl font-bold text-surface-700 hover:text-brand-700 transition-colors">
              Govt Exams Settings
            </Link>
            <Link href="/admin/study-plans" className="p-3 bg-surface-50 hover:bg-brand-50/20 border border-surface-150 rounded-xl font-bold text-surface-700 hover:text-brand-700 transition-colors">
              Study Planners
            </Link>
            <Link href="/admin/users" className="p-3 bg-surface-50 hover:bg-brand-50/20 border border-surface-150 rounded-xl font-bold text-surface-700 hover:text-brand-700 transition-colors">
              Student Users List
            </Link>
            <Link href="/admin/reports" className="p-3 bg-surface-50 hover:bg-brand-50/20 border border-surface-150 rounded-xl font-bold text-surface-700 hover:text-brand-700 transition-colors">
              Moderation Reports
            </Link>
            <Link href="/admin/settings" className="p-3 bg-surface-50 hover:bg-brand-50/20 border border-surface-150 rounded-xl font-bold text-surface-700 hover:text-brand-700 transition-colors">
              Global Platform Safety
            </Link>
            <Link href="/admin/payments" className="p-3 bg-surface-50 hover:bg-brand-50/20 border border-surface-150 rounded-xl font-bold text-surface-700 hover:text-brand-700 transition-colors">
              Audit Student Billing
            </Link>
          </div>
        </Card>

        {/* Flagged community discussion preview inside dashboard */}
        <Card className="border border-surface-200">
          <h3 className="text-sm font-black text-surface-850 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><AlertTriangle className="h-4.5 w-4.5 text-danger-650" /> Flagged Doubt Reports ({flaggedPosts.length})</span>
            <Link href="/admin/reports" className="text-xs font-black text-brand-650 hover:underline">View All</Link>
          </h3>

          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
            {flaggedPosts.length === 0 ? (
              <p className="text-xs text-surface-450 italic py-4 text-center">No reports outstanding.</p>
            ) : (
              flaggedPosts.map((post) => (
                <div key={post.id} className="p-2.5 bg-danger-50/30 border border-danger-100 rounded-xl flex justify-between items-center gap-3">
                  <div>
                    <h5 className="text-xs font-black text-surface-800 line-clamp-1">{post.title}</h5>
                    <p className="text-[10px] text-surface-450 mt-0.5">Author: {post.authorName} &bull; Flags: {post.reportsCount}</p>
                  </div>
                  <Button variant="danger" size="sm" className="h-7 text-[10px] py-0 px-2.5" onClick={() => handleRemovePost(post.id)}>
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

    </Container>
  );
}
