import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    
    const blog = await Blog.findOne({ 
      slug: params.slug, 
      published: true 
    }).lean();

    if (!blog) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
      
    return NextResponse.json({ post: blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching single blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
