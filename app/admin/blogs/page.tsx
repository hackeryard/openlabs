"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLockScreen from "@/app/components/AdminLockScreen";
import { useAdminSecret } from "@/app/components/AdminSecretContext";
import { getAdminHref, getMainSiteHref } from "@/app/lib/adminUrl";
import { Plus, Edit2, Trash2, Eye, Globe, FileEdit, RefreshCw } from 'lucide-react';

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
      fetchBlogs();
    }
  }, [isUnlocked]);

  const handleDelete = async (slug: string) => {
    if (!isAdmin) {
      alert("Delete action is restricted to Admins only.");
      return;
    }
    if (!confirm(`Are you sure you want to delete post "${slug}"?`)) return;

    try {
      const headers: Record<string, string> = {};
      if (adminSecret) headers['x-admin-secret'] = adminSecret;

      const res = await fetch(`/api/admin/blogs/${slug}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete blog');
      }

      setBlogs(blogs.filter((b) => b.slug !== slug));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isUnlocked) {
    return (
      <AdminLockScreen
        title="Admin Blog Management"
        description="Enter your shared Admin Secret to access editorial tools, publish posts, or manage articles."
        onUnlock={fetchBlogs}
      />
    );
  }

  return (
    <main className="min-h-screen text-foreground pt-6 sm:pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/70 backdrop-blur-xl border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Blog Management</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage your published articles, author assignments, and draft content.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchBlogs()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/80 hover:bg-accent border border-border/80 text-xs font-bold text-foreground transition"
              title="Refresh Blogs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link 
              href={getAdminHref(`/admin/blogs/create`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Blog Post</span>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/70 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{blog.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{blog.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          <Globe className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
                          <FileEdit className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={getMainSiteHref(`/blog/${blog.slug}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition"
                          title="View Live Article"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <Link
                          href={getAdminHref(`/admin/blogs/${blog.slug}/edit`)}
                          className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(blog.slug)}
                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition"
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
