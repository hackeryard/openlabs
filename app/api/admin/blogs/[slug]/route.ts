import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';
import { verifyAdminAccess } from '@/app/lib/adminAuth';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
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
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    await connectDB();
    const body = await request.json();

    const blog = await Blog.findOneAndUpdate(
      { slug: params.slug },
      body,
      { returnDocument: "after", runValidators: true }
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
    const auth = verifyAdminAccess(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status });
    }

    if (auth.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can permanently delete publications" },
        { status: 403 }
      );
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
