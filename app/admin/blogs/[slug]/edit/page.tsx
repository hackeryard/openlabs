"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditBlogPage({ params }: { params: { slug: string } }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    published: false,
    coverImage: '',
    adminSecret: '',
    metaTitle: '',
    metaDescription: '',
    faqs: [] as { question: string, answer: string }[],
  });

  useEffect(() => {
    const storedSecret = sessionStorage.getItem('adminSecret');
    if (!storedSecret) {
      router.push('/admin/blogs');
      return;
    }

    setFormData(prev => ({ ...prev, adminSecret: storedSecret }));

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${params.slug}`, {
          headers: {
            'x-admin-secret': storedSecret
          }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch blog details');

        const post = data.post;
        setFormData(prev => ({
          ...prev,
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || '',
          author: post.author || 'OpenLabs Team',
          readTime: post.readTime || '5 min read',
          published: post.published || false,
          coverImage: post.coverImage || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          faqs: post.faqs || [],
        }));
      } catch (err: any) {
        setError("Could not load blog post details. Are you sure it exists?");
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [params.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
      let coverImageUrl = formData.coverImage;
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
        coverImage: coverImageUrl,
      };

      const res = await fetch(`/api/admin/blogs/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': formData.adminSecret
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update blog');
      }

      setSuccess(`Blog post "${data.post.title}" updated successfully!`);

      setTimeout(() => {
        router.push(`/admin/blogs`);
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Blog Post</h1>
          <p className="text-slate-500">Update an existing article in the OpenLabs Journal.</p>
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

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">

          {/* Admin Secret is securely loaded from sessionStorage */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              <p className="text-xs text-amber-600 font-medium mt-1">Warning: Changing the slug will break any existing links to this post.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Cover Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
              {formData.coverImage && (
                <p className="text-xs text-indigo-600 mt-1">Current: <a href={formData.coverImage} target="_blank" rel="noreferrer" className="underline hover:text-indigo-800">View Image</a></p>
              )}
            </div>

            <div className="space-y-2 flex items-center pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-bold text-slate-700">Published (Live)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Meta Title (SEO)</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Leave empty to use main title" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Meta Description (SEO)</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Leave empty to use excerpt"></textarea>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200">
            <label className="block text-sm font-bold text-slate-700">Excerpt <span className="text-red-500">*</span></label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} required rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none"></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Markdown Content <span className="text-red-500">*</span></label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows={15} className="w-full bg-slate-900 text-slate-100 font-mono border-0 rounded-xl px-4 py-4 text-sm outline-none"></textarea>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">FAQs</h3>

            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group">
                <button type="button" onClick={() => handleRemoveFaq(index)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-4 pr-10">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Question {index + 1}</label>
                    <input type="text" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Answer {index + 1}</label>
                    <textarea value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <button type="button" onClick={handleAddFaq} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
