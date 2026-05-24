import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');

    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectDB();
    const blog = await Blog.findOne({ slug: params.slug }).lean();

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ post: blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');

    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      body,
      { new: true, runValidators: true }
    );

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog updated successfully', post: blog }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post', details: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');

    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectDB();

    const blog = await Blog.findOneAndDelete({ slug: params.slug });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post', details: (error as Error).message }, { status: 500 });
  }
}
