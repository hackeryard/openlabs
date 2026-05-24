import React from "react";
import { Sparkles, BookOpen } from "lucide-react";
import BlogGrid from "../components/blog/BlogGrid";
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';

// Force dynamic or just use no-store in fetch to ensure fresh blog posts
export const dynamic = 'force-dynamic';

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({ published: true })
      .sort({ date: -1 })
      .select('slug title excerpt category author date readTime gradient border icon coverImage -_id')
      .lean();
    
    // We need to serialize the MongoDB objects to plain JS objects for Server Components
    return JSON.parse(JSON.stringify(blogs)) || [];
  } catch (error) {
    console.error("Failed to fetch blogs directly:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogs();

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased overflow-hidden">

      {/* Light Cinematic Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden border-b border-slate-200/80 bg-white">

        {/* Deepened Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white" />

        {/* Enhanced Cinematic Glowing Orbs - Scaled for mobile and desktop */}
        <div className="absolute -top-12 -left-12 w-[300px] h-[300px] md:-top-24 md:-left-24 md:w-[600px] md:h-[600px] bg-indigo-300/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply pointer-events-none" />
        <div className="absolute top-1/4 -right-12 w-[350px] h-[350px] md:-right-24 md:w-[700px] md:h-[700px] bg-cyan-300/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply pointer-events-none" />

        {/* Pure CSS Grid - Replaces the SVG for guaranteed crispness and better masking */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,white,transparent_90%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 z-10 flex flex-col items-center text-center">

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 md:mb-8 text-slate-900 drop-shadow-sm leading-[1.15] md:leading-[1.1]">
            Thoughts on the <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
              Future of Learning
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-xl md:max-w-3xl mx-auto leading-relaxed font-medium px-2">
            Deep dives into virtual experiments, AI integrations, pedagogical insights, and updates from the OpenLabs engineering team.
          </p>

        </div>
      </section>

      {/* Light Cinematic Blog Grid Container */}
      <section className="relative py-12 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Subtle background glow behind the grid - scaled down for mobile */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] bg-indigo-50/50 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />

        <BlogGrid posts={posts} />
      </section>
    </main>
  );
}