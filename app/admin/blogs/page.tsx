'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockBlogs } from '@/data/mockData';
import { BlogPost } from '@/types';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function AdminBlogsDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let saved = localStorage.getItem('blogs_db');
    if (!saved) {
      localStorage.setItem('blogs_db', JSON.stringify(mockBlogs));
      saved = JSON.stringify(mockBlogs);
    }
    const data: BlogPost[] = JSON.parse(saved);
    setTimeout(() => {
      setBlogs(data);
      setLoading(false);
    }, 0);
  }, []);

  const handleDeleteBlog = (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    const updated = blogs.filter((b) => b.id !== id);
    localStorage.setItem('blogs_db', JSON.stringify(updated));
    setBlogs(updated);
    alert('Blog article deleted successfully.');
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
            Blogs Management Console
          </h1>
          <p className="text-xs text-surface-450 font-bold mt-1">
            Publish, edit, or delete topper guidance articles.
          </p>
        </div>

        <Link href="/admin/blogs/new">
          <Button size="sm" icon={<Plus className="h-4.5 w-4.5" />}>
            Publish New Blog
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xs text-surface-450 font-bold">Syncing guides library...</p>
        </div>
      ) : blogs.length === 0 ? (
        <Card className="text-center py-16 border border-surface-200 bg-surface-50/20">
          <p className="text-xs text-surface-450 font-semibold italic">No blogs currently published. Get started by creating one!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="border border-surface-200 hover:border-brand-200 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase text-brand-650 bg-brand-50 border border-brand-100 px-1.5 py-0.2 rounded">
                      {blog.category}
                    </span>
                    <span className="text-[10px] font-bold text-surface-400">{blog.readTime}</span>
                  </div>

                  <h3 className="text-xs md:text-sm font-black text-surface-850 leading-snug">{blog.title}</h3>
                  <p className="text-[10px] text-surface-450 font-bold uppercase mt-1">By {blog.author} &bull; Date: {blog.date}</p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-black flex items-center gap-1">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    className="h-8 text-xs font-black flex items-center gap-1"
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
