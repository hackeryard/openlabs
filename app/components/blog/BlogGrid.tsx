import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, Clock, ArrowRight, Microscope, CloudLightning,
  Bot, Beaker, Gamepad, Laptop, BookOpen, Sparkles, FlaskConical, Cpu
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Microscope, CloudLightning, Bot, Beaker, Gamepad, Laptop, BookOpen, Sparkles, FlaskConical, Cpu
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime?: string;
  gradient?: string;
  border?: string;
  icon?: string;
  author?: string;
  coverImage?: string;
}

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-indigo-50/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-indigo-100/50">
          <BookOpen className="w-10 h-10 text-indigo-300" aria-hidden="true" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No transmissions yet</h3>
        <p className="text-slate-500 max-w-sm text-lg">Check back soon for new articles, research, and updates.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      {posts.map((post) => {
        const IconComponent = post.icon && ICON_MAP[post.icon] ? ICON_MAP[post.icon] : BookOpen;
        const displayDate = formatDate(post.date);

        // Use the post's gradient if provided, otherwise fallback to a cinematic multi-color glow
        const glowColor = post.gradient || "from-indigo-500/40 via-purple-500/40 to-cyan-500/40";

        return (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group relative block outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 rounded-[2.5rem] z-10 hover:z-20"
          >
            {/* Cinematic Hover Glow (Behind the card) */}
            <div className={`absolute -inset-3 rounded-[3.5rem] bg-gradient-to-br ${glowColor} opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 ease-out -z-10`} />

            <article className="relative flex flex-col h-full bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] rounded-[2rem] p-3 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              {/* Internal subtle border for glass effect */}
              <div className="absolute inset-0 border border-slate-200/50 rounded-[2rem] pointer-events-none" />

              {/* Framed Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-6 z-10 shadow-inner bg-slate-100">
                {post.coverImage ? (
                  <>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Dynamic Image Overlay */}
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                    <IconComponent className="w-16 h-16 text-slate-200" aria-hidden="true" />
                  </div>
                )}

                {/* Floating Glass Category Pill */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.1)] translate-y-0 group-hover:-translate-y-1 transition-transform duration-500 ease-out border border-white/50">
                  <IconComponent className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-800 mt-0.5">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content Box */}
              <div className="px-3 pb-3 flex flex-col flex-1 relative z-10">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 leading-[1.25] group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-slate-500 text-[0.95rem] font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer Metadata & Interactive Button */}
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100/80">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5 group-hover:text-indigo-400 transition-colors duration-300">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                      <time dateTime={post.date}>{displayDate}</time>
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1.5 group-hover:text-indigo-400 transition-colors duration-300 delay-75">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        {post.readTime}
                      </span>
                    )}
                  </div>

                  {/* Exploding Action Button */}
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-500 ease-out z-20">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
