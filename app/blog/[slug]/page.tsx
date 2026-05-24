import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';

// TypeScript Types for better safety
interface FAQ {
  question: string;
  answer: string;
}

interface BlogPost {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  category: string;
  author?: string;
  date: string;
  readTime?: string;
  coverImage?: string;
  content: string;
  faqs?: FAQ[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug, published: true }).lean();
    
    if (!blog) return null;
    
    // Serialize Mongoose object to plain JS object for Next.js Server Components
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error("Failed to fetch blog post directly:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.openlabs.org.in";

  if (!post) {
    return { title: 'Post Not Found | OpenLabs' };
  }
  return {
    title: post.metaTitle || `${post.title} | OpenLabs Blog`,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const displayDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased pt-20 pb-32">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Changed to max-w-3xl for optimal reading line length */}
      <article className="max-w-5xl mx-auto px-5 sm:px-8">

        {/* Navigation & Context Action */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium group transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to publications
          </Link>
        </div>

        {/* Editorial Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="px-2.5 py-1 text-xs font-semibold tracking-wider uppercase text-indigo-700 bg-indigo-50/80 rounded-md border border-indigo-100/80">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.15]">
            {post.title}
          </h1>

          {/* Author Matrix Meta */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-slate-500 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="font-semibold text-slate-800">{post.author || 'OpenLabs Team'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{displayDate}</time>
            </div>

            {post.readTime && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>
        </header>

        {/* Editorial Hero Asset */}
        {post.coverImage && (
          <div className="mb-14 relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 bg-slate-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover object-center transform hover:scale-[1.02] transition-transform duration-700"
              sizes="(max-w-3xl) 100vw, 768px"
            />
          </div>
        )}

        {/* Clean, Publication-Grade Typography Canvas */}
        <div className="prose prose-slate md:prose-lg max-w-none 
          prose-p:text-slate-700 prose-p:leading-relaxed 
          prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:mt-12 prose-h2:mb-6
          prose-h3:mt-8 prose-h3:mb-4
          prose-a:text-indigo-600 prose-a:font-medium prose-a:underline-offset-4 prose-a:decoration-indigo-200 hover:prose-a:decoration-indigo-600 prose-a:transition-colors
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-800
          prose-strong:text-slate-900 prose-strong:font-semibold
          prose-img:rounded-2xl prose-img:border prose-img:border-slate-200/60 prose-img:shadow-sm
          prose-code:text-indigo-600 prose-code:bg-indigo-50/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800/80 prose-pre:rounded-xl prose-pre:shadow-sm"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Elegant Minimalist FAQ Section */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-20 pt-14 border-t border-slate-200/80">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">Frequently Asked Questions</h2>
              <p className="text-slate-500">Quick answers to common questions about this topic.</p>
            </div>

            <div className="space-y-4">
              {post.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-slate-200/80 bg-white transition-all duration-200 ease-out open:border-slate-300 open:shadow-sm"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-medium text-slate-900 list-none select-none">
                    <span className="pr-6 text-base md:text-lg group-hover:text-indigo-600 transition-colors duration-200">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                      <ChevronDown className="w-4 h-4 transform group-open:rotate-180 transition-transform duration-300 ease-in-out" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 mt-2 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}