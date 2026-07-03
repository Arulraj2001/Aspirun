'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  Search,
  VolumeX,
  Volume2,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface StudentProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  city: string;
  community_status: 'active' | 'muted' | 'banned';
  targetExam: string;
  warningsCount: number;
}

const defaultProfiles: StudentProfile[] = [
  { id: 'usr-1', username: 'siddharth_mishra', fullName: 'Siddharth Mishra', email: 'siddharth@aspirav.co.in', city: 'Prayagraj', community_status: 'active', targetExam: 'UPSC Civil Services', warningsCount: 0 },
  { id: 'usr-2', username: 'priya_sharma', fullName: 'Priya Sharma', email: 'priya.sh@aspirav.co.in', city: 'Delhi', community_status: 'active', targetExam: 'SSC CGL', warningsCount: 1 },
  { id: 'usr-3', username: 'amit_kumar', fullName: 'Amit Kumar', email: 'amit.k@aspirav.co.in', city: 'Patna', community_status: 'muted', targetExam: 'RRB NTPC', warningsCount: 2 },
  { id: 'usr-4', username: 'rohit_singh', fullName: 'Rohit Singh', email: 'rohit@aspirav.co.in', city: 'Lucknow', community_status: 'banned', targetExam: 'UP SI', warningsCount: 3 }
];

export default function UserModerationPage() {
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let saved = localStorage.getItem('profiles_db');
    if (!saved) {
      localStorage.setItem('profiles_db', JSON.stringify(defaultProfiles));
      saved = JSON.stringify(defaultProfiles);
    }
    const data: StudentProfile[] = JSON.parse(saved);
    setTimeout(() => {
      setProfiles(data);
      setLoading(false);
    }, 0);
  }, []);

  const updateProfileStatus = (id: string, newStatus: 'active' | 'muted' | 'banned', message: string, incrementWarning = false) => {
    const updated = profiles.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          community_status: newStatus,
          warningsCount: incrementWarning ? p.warningsCount + 1 : p.warningsCount
        };
      }
      return p;
    });

    localStorage.setItem('profiles_db', JSON.stringify(updated));
    setProfiles(updated);
    alert(message);
  };

  const filtered = profiles.filter(
    (p) =>
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Container size="xl" className="py-16 text-center">
        <h3 className="text-xl font-extrabold text-surface-900 mb-2">Syncing student database...</h3>
        <p className="text-xs text-surface-450 font-semibold mb-6">Compiling profiles, warnings sheets, and ban lists.</p>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Back to admin community dashboard */}
      <div className="mb-6">
        <Link href="/admin/community" className="inline-flex items-center gap-1.5 text-xs font-black text-brand-650 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Moderation Hub
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-xl md:text-3xl font-black text-surface-900 leading-snug">
          Student Profile Moderation Center
        </h1>
        <p className="text-xs text-surface-500 font-semibold mt-1">
          Track warnings, mute violations, temporary lockouts, and ban suspensions.
        </p>
      </div>

      {/* Search Input bar */}
      <Card className="border border-surface-200 mb-6 p-4">
        <div className="flex items-center gap-2 bg-surface-50 border border-surface-200 rounded-xl px-3 py-1">
          <Search className="h-4 w-4 text-surface-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username, full name, email address..."
            className="w-full text-xs md:text-sm font-semibold text-surface-700 bg-transparent py-1.5 focus:outline-none"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {filtered.map((profile) => (
          <Card key={profile.id} className="border border-surface-200 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* User details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm md:text-base font-black text-surface-900 leading-snug">
                    {profile.fullName}
                  </h3>
                  <span className="text-[10px] text-surface-450 font-bold bg-surface-50 border border-surface-150 px-2 py-0.5 rounded">
                    @{profile.username}
                  </span>
                  
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                    profile.community_status === 'active'
                      ? 'bg-success-50 border-success-100 text-success-700'
                      : profile.community_status === 'muted'
                      ? 'bg-orange-50 border-orange-100 text-orange-700'
                      : 'bg-danger-50 border-danger-150 text-danger-700'
                  }`}>
                    {profile.community_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-bold text-surface-450">
                  <p>Email: <span className="text-surface-700">{profile.email}</span></p>
                  <p>Target Exam: <span className="text-brand-600">{profile.targetExam}</span></p>
                  <p>City: <span className="text-surface-750">{profile.city}</span></p>
                  <p className="flex items-center gap-1">
                    Warnings issued: 
                    <span className={`font-black ${profile.warningsCount > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                      {profile.warningsCount}
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-end shrink-0 bg-surface-50 p-2.5 rounded-xl border border-surface-150">
                <Button
                  variant="ghost"
                  onClick={() => updateProfileStatus(profile.id, profile.community_status, `Official safety warning logged for @${profile.username}.`, true)}
                  className="h-8 text-xs font-black text-orange-600"
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Warn
                </Button>

                {profile.community_status === 'active' ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => updateProfileStatus(profile.id, 'muted', `Account @${profile.username} has been MUTED.`, false)}
                      className="h-8 text-xs font-black text-orange-600"
                    >
                      <VolumeX className="h-3.5 w-3.5 mr-1" /> Mute 24h
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => updateProfileStatus(profile.id, 'banned', `Account @${profile.username} banned permanently.`, false)}
                      className="h-8 text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Ban User
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => updateProfileStatus(profile.id, 'active', `Community privileges restored for @${profile.username}.`, false)}
                    className="h-8 text-xs text-success-700 hover:text-success-800"
                  >
                    <Volume2 className="h-3.5 w-3.5 mr-1" /> Restore User
                  </Button>
                )}
              </div>

            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
