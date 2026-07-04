'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Lock,
  Ban,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Download,
  Eye,
  X,
  Loader2,
} from 'lucide-react';

interface StudentProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  qualification: string | null;
  role: string;
  community_status: string;
  preferred_language: string | null;
  target_exam_id: string | null;
  created_at: string;
  // Computed / enriched
  targetExamLabel?: string;
  paymentCount?: number;
  enrollmentCount?: number;
}

const EXAM_UUID_LABELS: Record<string, string> = {
  '123e4567-e89b-12d3-a456-426614174000': 'UPSC Civil Services',
  '433a7ad1-77ad-4560-bf88-a739b8bc7e6a': 'SSC CGL',
  'b7c53d10-8b1b-4f51-b0db-bcf643f8e52e': 'RRB NTPC',
  'cb03e190-21a4-4f9e-a0db-bcd6f58bc7ea': 'IBPS PO',
};

const PAGE_SIZE = 12;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StudentProfile | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    const configured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');
    setIsConfigured(configured);

    if (configured) {
      try {
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

        if (filterRole) query = query.eq('role', filterRole);
        if (filterStatus) query = query.eq('community_status', filterStatus);
        if (filterExam) query = query.eq('target_exam_id', filterExam);
        if (searchQuery.trim()) {
          query = query.or(
            `full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
          );
        }

        const { data, count, error } = await query;

        if (error) {
          console.error('Users fetch error:', error);
        } else {
          const enriched = (data || []).map((u: StudentProfile) => ({
            ...u,
            targetExamLabel: EXAM_UUID_LABELS[u.target_exam_id ?? ''] || '—',
          }));
          setUsers(enriched);
          setTotalCount(count || 0);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    } else {
      // Simulation fallback
      const saved = localStorage.getItem('users_db');
      const mockData: StudentProfile[] = saved
        ? JSON.parse(saved)
        : [
            {
              id: 'usr-sim-1',
              full_name: 'Siddharth Mishra',
              username: 'siddharth_99',
              email: 'siddharth@aspirav.in',
              phone: '9876543210',
              city: 'Lucknow',
              state: 'UP',
              qualification: 'B.Tech Graduate',
              role: 'student',
              community_status: 'active',
              preferred_language: 'Hindi',
              target_exam_id: '123e4567-e89b-12d3-a456-426614174000',
              created_at: new Date().toISOString(),
              targetExamLabel: 'UPSC Civil Services',
            },
            {
              id: 'usr-sim-2',
              full_name: 'Priya Sharma',
              username: 'priya_aspirant',
              email: 'priya@aspirav.in',
              phone: '9123456780',
              city: 'Mumbai',
              state: 'Maharashtra',
              qualification: 'B.Sc Economics',
              role: 'student',
              community_status: 'active',
              preferred_language: 'English',
              target_exam_id: '433a7ad1-77ad-4560-bf88-a739b8bc7e6a',
              created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
              targetExamLabel: 'SSC CGL',
            },
          ];
      setUsers(mockData);
      setTotalCount(mockData.length);
    }

    setLoading(false);
  }, [page, searchQuery, filterRole, filterStatus, filterExam]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setSaving(userId + ':role');
    if (isConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (!error) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        showToast('Role updated successfully.');
      } else {
        showToast('Failed to update role: ' + error.message);
      }
    } else {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      showToast('Role updated (simulation mode).');
    }
    setSaving(null);
  };

  const handleToggleMute = async (user: StudentProfile) => {
    const nextStatus = user.community_status === 'muted' ? 'active' : 'muted';
    setSaving(user.id + ':mute');

    if (isConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({ community_status: nextStatus })
        .eq('id', user.id);

      if (!error && nextStatus === 'muted') {
        // Insert community ban record
        await supabase.from('community_bans').insert({
          user_id: user.id,
          reason: 'Admin muted — community guideline violation',
          ban_type: 'mute',
          starts_at: new Date().toISOString(),
          ends_at: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days
        });
      }

      if (!error) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, community_status: nextStatus } : u))
        );
        showToast(`User ${nextStatus === 'muted' ? 'muted (7 days)' : 'unmuted'} successfully.`);
      } else {
        showToast('Failed: ' + error.message);
      }
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, community_status: nextStatus } : u))
      );
      showToast(`User ${nextStatus === 'muted' ? 'muted' : 'unmuted'} (simulation).`);
    }
    setSaving(null);
  };

  const handleToggleBan = async (user: StudentProfile) => {
    const nextStatus = user.community_status === 'banned' ? 'active' : 'banned';
    setSaving(user.id + ':ban');

    if (isConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({ community_status: nextStatus })
        .eq('id', user.id);

      if (!error && nextStatus === 'banned') {
        await supabase.from('community_bans').insert({
          user_id: user.id,
          reason: 'Admin permanently banned — serious community violation',
          ban_type: 'permanent_ban',
          starts_at: new Date().toISOString(),
          ends_at: null,
        });
      }

      if (!error) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, community_status: nextStatus } : u))
        );
        showToast(`Account ${nextStatus === 'banned' ? 'permanently banned' : 'unbanned'}.`);
      } else {
        showToast('Failed: ' + error.message);
      }
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, community_status: nextStatus } : u))
      );
      showToast(`Account ${nextStatus === 'banned' ? 'banned' : 'unbanned'} (simulation).`);
    }
    setSaving(null);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Username', 'Email', 'Phone', 'City', 'State', 'Qualification', 'Target Exam', 'Role', 'Status', 'Joined'];
    const rows = users.map((u) => [
      u.full_name || '',
      u.username || '',
      u.email || '',
      u.phone || '',
      u.city || '',
      u.state || '',
      u.qualification || '',
      u.targetExamLabel || '',
      u.role,
      u.community_status,
      new Date(u.created_at).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aspirav-students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const statusColor = (status: string) => {
    if (status === 'active') return 'bg-success-50 text-success-700 border-success-100';
    if (status === 'muted') return 'bg-orange-50 text-orange-700 border-orange-100';
    if (status === 'banned') return 'bg-danger-50 text-danger-700 border-danger-100';
    return 'bg-surface-50 text-surface-500 border-surface-100';
  };

  return (
    <Container size="xl" className="py-8 md:py-10 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-surface-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-right duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-surface-900 tracking-tight">
              Student Directory
            </h1>
            <p className="text-xs text-surface-450 font-bold mt-1">
              {totalCount.toLocaleString()} total registered users
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              className="text-xs"
              icon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs"
              icon={<Download className="h-3.5 w-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="border border-surface-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder="Search by name, username, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-surface-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select
            label=""
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
            options={[
              { value: '', label: 'All Roles' },
              { value: 'student', label: 'Student' },
              { value: 'moderator', label: 'Moderator' },
              { value: 'admin', label: 'Admin' },
              { value: 'content_creator', label: 'Content Creator' },
            ]}
            className="min-w-[140px]"
          />
          <Select
            label=""
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'muted', label: 'Muted' },
              { value: 'banned', label: 'Banned' },
            ]}
            className="min-w-[130px]"
          />
          <Select
            label=""
            value={filterExam}
            onChange={(e) => { setFilterExam(e.target.value); setPage(0); }}
            options={[
              { value: '', label: 'All Exams' },
              { value: '123e4567-e89b-12d3-a456-426614174000', label: 'UPSC' },
              { value: '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', label: 'SSC CGL' },
              { value: 'b7c53d10-8b1b-4f51-b0db-bcf643f8e52e', label: 'RRB NTPC' },
              { value: 'cb03e190-21a4-4f9e-a0db-bcd6f58bc7ea', label: 'IBPS PO' },
            ]}
            className="min-w-[130px]"
          />
        </div>
      </Card>

      {/* Users Table / Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-surface-450 font-bold">No students match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((student) => (
            <Card
              key={student.id}
              className={`border transition-all hover:shadow-md ${
                student.community_status === 'banned'
                  ? 'border-danger-200 bg-danger-50/10'
                  : student.community_status === 'muted'
                  ? 'border-orange-200 bg-orange-50/10'
                  : 'border-surface-200 bg-white'
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                {/* Left: Student Info */}
                <div className="flex-1 space-y-2.5">
                  {/* Name + badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-600 font-black text-sm shrink-0">
                      {(student.full_name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-surface-850 leading-tight">
                        {student.full_name || 'Unnamed User'}
                        <span className="text-surface-400 font-bold text-xs ml-1">
                          @{student.username}
                        </span>
                      </h3>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${statusColor(student.community_status)}`}>
                      {student.community_status}
                    </span>
                    <span className="text-[9px] font-black uppercase bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full">
                      {student.role}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5 text-[10px] font-semibold text-surface-500">
                    {student.email && (
                      <span className="flex items-center gap-1 col-span-2">
                        <Mail className="h-3 w-3 text-surface-400 shrink-0" />
                        {student.email}
                      </span>
                    )}
                    {student.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-surface-400 shrink-0" />
                        {student.phone}
                      </span>
                    )}
                    {(student.city || student.state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-surface-400 shrink-0" />
                        {[student.city, student.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {student.qualification && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-surface-400 shrink-0" />
                        {student.qualification}
                      </span>
                    )}
                    {student.targetExamLabel && student.targetExamLabel !== '—' && (
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-brand-500 shrink-0" />
                        {student.targetExamLabel}
                      </span>
                    )}
                    <span className="text-surface-350">
                      Joined: {new Date(student.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-surface-400">Role</label>
                    <Select
                      label=""
                      value={student.role}
                      onChange={(e) => handleRoleChange(student.id, e.target.value)}
                      options={[
                        { value: 'student', label: 'Student' },
                        { value: 'moderator', label: 'Moderator' },
                        { value: 'content_creator', label: 'Content Creator' },
                        { value: 'admin', label: 'Admin' },
                      ]}
                      className="min-w-[130px] !py-1 text-xs"
                    />
                  </div>

                  <div className="flex gap-2 self-end pb-0.5">
                    <Button
                      variant={student.community_status === 'muted' ? 'success' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleMute(student)}
                      isLoading={saving === student.id + ':mute'}
                      className="h-8 text-[10px] uppercase font-black px-3"
                    >
                      {student.community_status === 'muted' ? (
                        <><UserCheck className="h-3.5 w-3.5 mr-1" /> Unmute</>
                      ) : (
                        <><Lock className="h-3.5 w-3.5 mr-1" /> Mute</>
                      )}
                    </Button>
                    <Button
                      variant={student.community_status === 'banned' ? 'success' : 'danger'}
                      size="sm"
                      onClick={() => handleToggleBan(student)}
                      isLoading={saving === student.id + ':ban'}
                      className="h-8 text-[10px] uppercase font-black px-3"
                    >
                      {student.community_status === 'banned' ? (
                        <><UserCheck className="h-3.5 w-3.5 mr-1" /> Unban</>
                      ) : (
                        <><Ban className="h-3.5 w-3.5 mr-1" /> Ban</>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(student)}
                      className="h-8 text-[10px] uppercase font-black px-3"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          <p className="text-xs text-surface-450 font-bold">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount.toLocaleString()} students
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-black text-surface-600 px-2">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="h-8 px-3"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-black text-surface-900">{selectedUser.full_name}</h3>
                <p className="text-xs text-surface-450 font-bold">@{selectedUser.username} · {selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-surface-400 hover:text-surface-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-surface-600">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-50 rounded-xl">
                  <p className="text-[10px] uppercase text-surface-400 font-black mb-1">Phone</p>
                  <p>{selectedUser.phone || '—'}</p>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl">
                  <p className="text-[10px] uppercase text-surface-400 font-black mb-1">Location</p>
                  <p>{[selectedUser.city, selectedUser.state].filter(Boolean).join(', ') || '—'}</p>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl">
                  <p className="text-[10px] uppercase text-surface-400 font-black mb-1">Qualification</p>
                  <p>{selectedUser.qualification || '—'}</p>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl">
                  <p className="text-[10px] uppercase text-surface-400 font-black mb-1">Target Exam</p>
                  <p>{selectedUser.targetExamLabel || '—'}</p>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl">
                  <p className="text-[10px] uppercase text-surface-400 font-black mb-1">Language</p>
                  <p>{selectedUser.preferred_language || '—'}</p>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl">
                  <p className="text-[10px] uppercase text-surface-400 font-black mb-1">Joined</p>
                  <p>{new Date(selectedUser.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-surface-100">
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${statusColor(selectedUser.community_status)}`}>
                  Status: {selectedUser.community_status}
                </span>
                <span className="text-[10px] font-black uppercase bg-brand-50 text-brand-700 border border-brand-100 px-2.5 py-1 rounded-full">
                  Role: {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-5 pt-4 border-t border-surface-100">
              <Button
                variant={selectedUser.community_status === 'muted' ? 'success' : 'outline'}
                size="sm"
                onClick={() => { handleToggleMute(selectedUser); setSelectedUser(null); }}
                className="flex-1 justify-center"
              >
                {selectedUser.community_status === 'muted' ? 'Unmute User' : 'Mute User (7 days)'}
              </Button>
              <Button
                variant={selectedUser.community_status === 'banned' ? 'success' : 'danger'}
                size="sm"
                onClick={() => { handleToggleBan(selectedUser); setSelectedUser(null); }}
                className="flex-1 justify-center"
              >
                {selectedUser.community_status === 'banned' ? 'Unban Account' : 'Permanently Ban'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
