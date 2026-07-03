'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ArrowLeft, Lock, Ban } from 'lucide-react';

interface StudentUser {
  id: string;
  name: string;
  username: string;
  role: 'Student' | 'New User' | 'Admin' | 'Moderator';
  qualification: string;
  targetExam: string;
  streak: number;
  mocksCompleted: number;
  isBanned?: boolean;
  isMuted?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('users_db');
    let data: StudentUser[] = [];
    if (saved) {
      data = JSON.parse(saved);
    } else {
      data = [
        {
          id: 'usr-1',
          name: 'Siddharth Mishra',
          username: 'siddharth_99',
          role: 'Student',
          qualification: 'B.Tech Graduate',
          targetExam: 'UPSC Civil Services',
          streak: 12,
          mocksCompleted: 8,
          isBanned: false,
          isMuted: false
        },
        {
          id: 'usr-2',
          name: 'Priya Sharma',
          username: 'priya_aspirant',
          role: 'Student',
          qualification: 'B.Sc Economics',
          targetExam: 'SSC CGL',
          streak: 4,
          mocksCompleted: 14,
          isBanned: false,
          isMuted: false
        },
        {
          id: 'usr-3',
          name: 'Ankit Verma',
          username: 'ankit_govt_jobs',
          role: 'Moderator',
          qualification: 'M.A. History',
          targetExam: 'UPSC Civil Services',
          streak: 0,
          mocksCompleted: 2,
          isBanned: false,
          isMuted: false
        }
      ];
      localStorage.setItem('users_db', JSON.stringify(data));
    }

    setTimeout(() => {
      setUsers(data);
      setLoading(false);
    }, 0);
  }, []);

  const handleChangeRole = (userId: string, newRole: 'Student' | 'New User' | 'Admin' | 'Moderator') => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });
    localStorage.setItem('users_db', JSON.stringify(updated));
    setUsers(updated);
    alert('User role updated successfully.');
  };

  const handleToggleMute = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextState = !u.isMuted;
        alert(`User accounts ${nextState ? 'muted' : 'unmuted'}.`);
        if (u.username === 'siddharth_99') {
          localStorage.setItem('simulated_muted', nextState ? 'true' : 'false');
        }
        return { ...u, isMuted: nextState };
      }
      return u;
    });
    localStorage.setItem('users_db', JSON.stringify(updated));
    setUsers(updated);
  };

  const handleToggleBan = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextState = !u.isBanned;
        alert(`User accounts ${nextState ? 'banned' : 'unbanned'}.`);
        if (u.username === 'siddharth_99') {
          localStorage.setItem('simulated_banned', nextState ? 'true' : 'false');
        }
        return { ...u, isBanned: nextState };
      }
      return u;
    });
    localStorage.setItem('users_db', JSON.stringify(updated));
    setUsers(updated);
  };

  return (
    <Container size="xl" className="py-8 md:py-12 space-y-8">
      {/* Back button */}
      <div className="mb-2">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Admin Panel
        </Link>
      </div>

      <div className="border-b border-surface-150 pb-4">
        <h1 className="text-xl md:text-3xl font-black text-surface-900 tracking-tight">
          Student Profile Directory
        </h1>
        <p className="text-xs text-surface-450 font-bold mt-1">
          Review qualification details, streaks checkpoints, and suspend accounts violating community safety guidelines.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold animate-pulse">Syncing student logs...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {users.map((student) => (
            <Card key={student.id} className={`border ${
              student.isBanned ? 'border-danger-200 bg-danger-50/5' : 'border-surface-200'
            }`}>
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                
                {/* Left: User metadata */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs md:text-sm font-black text-surface-850">
                      {student.name} (@{student.username})
                    </h3>
                    <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                      {student.role}
                    </span>
                    {student.isBanned && (
                      <span className="text-[9px] font-black uppercase text-danger-700 bg-danger-50 border border-danger-100 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <Ban className="h-3 w-3" /> Banned
                      </span>
                    )}
                    {student.isMuted && (
                      <span className="text-[9px] font-black uppercase text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <Lock className="h-3 w-3" /> Muted
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-surface-550">
                    <p>Target Exam: {student.targetExam}</p>
                    <p>Streak: {student.streak} Days</p>
                    <p>Qualification: {student.qualification}</p>
                    <p>Completed Mocks: {student.mocksCompleted} Tests</p>
                  </div>
                </div>

                {/* Right: Actions form controls */}
                <div className="flex flex-wrap items-center gap-4 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                  <Select
                    label="Adjust Role"
                    value={student.role}
                    onChange={(e) => handleChangeRole(student.id, e.target.value as 'Student' | 'New User' | 'Admin' | 'Moderator')}
                    options={[
                      { value: 'Student', label: 'Student' },
                      { value: 'Moderator', label: 'Moderator' },
                      { value: 'Admin', label: 'Admin' },
                      { value: 'New User', label: 'New User' }
                    ]}
                    className="max-w-[150px]"
                  />

                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" size="sm" onClick={() => handleToggleMute(student.id)}>
                      {student.isMuted ? 'Unmute' : 'Mute forum'}
                    </Button>
                    <Button variant={student.isBanned ? 'success' : 'danger'} size="sm" onClick={() => handleToggleBan(student.id)}>
                      {student.isBanned ? 'Unban Account' : 'Ban Account'}
                    </Button>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
