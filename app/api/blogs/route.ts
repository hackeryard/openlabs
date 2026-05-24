import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Blog from '@/app/models/Blog';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch published blogs, sort by date descending
    // Exclude content for the list view to reduce payload size
    const blogs = await Blog.find({ published: true })
      .sort({ date: -1 })
      .select('slug title excerpt category author date readTime gradient border icon coverImage -_id')
      .lean();
      
    return NextResponse.json({ posts: blogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
