"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminLockScreen from '@/app/components/AdminLockScreen';
import { useAdminSecret } from '@/app/components/AdminSecretContext';
import { getAdminHref } from '@/app/lib/adminUrl';

export default function CreateBlogPage() {
  const router = useRouter();
  const { adminSecret, isUnlocked, unlock } = useAdminSecret();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'OpenLabs Team',
    readTime: '5 min read',
    gradient: 'from-blue-100 to-cyan-50',
    border: 'group-hover:border-blue-200',
    adminSecret: '',
    metaTitle: '',
    metaDescription: '',
    faqs: [] as { question: string, answer: string }[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddFaq = () => {
    setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] });
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][field] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let coverImageUrl = '';
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await fetch('/api/admin/blogs/upload', {
          method: 'POST',
          headers: { 'x-admin-secret': formData.adminSecret },
          body: uploadData
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Failed to upload image');
        coverImageUrl = uploadJson.url;
      }

      const payload = {
        ...formData,
        ...(coverImageUrl && { coverImage: coverImageUrl }),
        published: true, // Auto-publish for now
      };

      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': formData.adminSecret
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create blog');
      }

      setSuccess(`Blog post "${data.post.title}" created successfully!`);

      // Reset form partially
      setFormData(prev => ({
        ...prev,
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        faqs: [],
      }));

      // Redirect back to blog list
      setTimeout(() => {
        router.push(getAdminHref('/admin/blogs'));
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <AdminLockScreen
        title="Create Blog Clearance"
        description="Enter your shared Admin Secret to create and publish articles to the OpenLabs Journal."
        error={error}
        loading={loading}
        onUnlock={async (secret) => {
          unlock(secret);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen text-foreground pt-6 sm:pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/70 backdrop-blur-xl border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Create New Blog Post</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Publish a new article to the OpenLabs Journal.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-3xl shadow-sm border border-border">

          {/* Security */}
          {/* Admin Secret is securely loaded from sessionStorage */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="The Future of Education" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Slug (Optional)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="auto-generated-if-empty" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Category <span className="text-red-500">*</span></label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Physics, EdTech" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Read Time</label>
              <input type="text" name="readTime" value={formData.readTime} onChange={handleChange} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 5 min read" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Cover Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-muted border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Meta Title (SEO)</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Leave empty to use main title" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-muted-foreground">Meta Description (SEO)</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Leave empty to use excerpt"></textarea>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <label className="block text-sm font-bold text-muted-foreground">Excerpt (Short description) <span className="text-red-500">*</span></label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={2} className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none"></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-muted-foreground">Markdown Content <span className="text-red-500">*</span></label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows={15} className="w-full bg-slate-900 text-slate-100 font-mono border-0 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="## Write your markdown here..."></textarea>
          </div>

          {/* FAQs Builder */}
          <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-bold text-foreground">FAQs (Optional)</h3>

            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl bg-muted border border-border relative group">
                <button type="button" onClick={() => handleRemoveFaq(index)} className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-4 pr-10">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">Question {index + 1}</label>
                    <input type="text" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="What is OpenLabs?" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest">Answer {index + 1}</label>
                    <textarea value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} rows={2} className="w-full bg-card border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="OpenLabs is..."></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <button type="button" onClick={handleAddFaq} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Publishing...' : 'Publish Blog Post'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
