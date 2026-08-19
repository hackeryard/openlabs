"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { Plus, Edit2, Trash2, Eye, Lock, Globe, FileEdit, Users, BookOpen, Activity, MessageSquare, Inbox, BarChart3 } from 'lucide-react';

export default function AdminBlogsPage() {
  const { adminSecret, isUnlocked, isAdmin, unlock, lock } = useAdminSecret();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async (secret?: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {};
      const activeSecret = secret || adminSecret;
      if (activeSecret) headers['x-admin-secret'] = activeSecret;

      const res = await fetch('/api/admin/blogs', {
        headers,
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          lock();
        }
        throw new Error(data.error || 'Failed to fetch blogs');
      }
      
      setBlogs(data.posts || []);
      if (activeSecret) unlock(activeSecret);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchBlogs(adminSecret);
    }
  }, [isUnlocked]);

  const handleDelete = async (slug: string) => {
    if (!isAdmin) {
      alert("Publication deletion is restricted to Administrators only.");
      return;
    }

    if (!confirm(`Are you sure you want to delete the blog "${slug}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs/${slug}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminSecret }
      });
      
      if (!res.ok) throw new Error('Failed to delete blog');
      
      // Remove from UI
      setBlogs(blogs.filter(b => b.slug !== slug));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isUnlocked) {
    return (
      <AdminLockScreen
        title="Admin Blog Management"
        description="Enter your shared Admin Secret to create, edit, upload assets, and manage public publications."
        error={error}
        loading={loading}
        onUnlock={fetchBlogs}
      />
    );
  }

  return (
    <main className="min-h-screen text-foreground py-24">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Blog Management</h1>
            <p className="text-muted-foreground">Manage your published articles and drafts.</p>
          </div>
          <Link 
            href={`/admin/blogs/create`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Blog Post
          </Link>
        </div>

        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-accent transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{blog.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{blog.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                          <Globe className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                          <FileEdit className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="p-2 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Live"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blogs/${blog.slug}/edit`}
                          className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(blog.slug)}
                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      No blogs found. Create your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
