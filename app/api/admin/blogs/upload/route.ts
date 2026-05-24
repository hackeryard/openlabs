import { NextResponse } from 'next/server';
import { uploadImage } from '@/app/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const adminSecret = request.headers.get('x-admin-secret');
    
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // Next.js 14 App Router uses Web Request APIs, not Node.js Express Streams.
    // Multer is incompatible with Web Requests without messy custom wrappers.
    // Instead, we use native formData() and arrayBuffer() to read the file into memory.
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file found in the request' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Read into memory buffer (equivalent to multer memoryStorage)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const url = await uploadImage(buffer);

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image', details: (error as Error).message }, { status: 500 });
  }
}

// USAGE PATTERN:
// 1. First upload the image:
// POST /api/admin/blogs/upload with FormData containing 'image' file
// Returns: { url: "https://res.cloudinary.com/..." }
//
// 2. Then create the blog post:
// POST /api/admin/blogs with JSON body including coverImage: url
