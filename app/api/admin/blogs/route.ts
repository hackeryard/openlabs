import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';
import { verifyAdminAccess } from '@/app/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    const body = await request.json();

    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters
        .replace(/[\s_-]+/g, '-') // Swap spaces and underscores for hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }

    const blog = new Blog(body);
    await blog.save();

    return NextResponse.json({ message: 'Blog post created successfully', post: blog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post', details: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();

    // Fetch all blogs including drafts, sorted by newest first
    const blogs = await Blog.find({}).sort({ date: -1 }).lean();

    return NextResponse.json({ posts: blogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
