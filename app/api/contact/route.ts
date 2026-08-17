import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Contact from '@/app/models/Contact';
import { sendContactEmail } from '@/app/lib/email';
import { getUserFromToken } from '@/app/lib/getUserFromToken';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user is logged in (optional association)
    let userId = null;
    try {
      const payload = getUserFromToken();
      if (payload?.id) userId = payload.id;
    } catch {
      // Optional authentication
    }

    const userAgent = request.headers.get('user-agent') || undefined;

    // 1. Save submission to MongoDB first so no inquiry is ever lost
    let contactDoc: any = null;
    try {
      contactDoc = await (Contact as any).create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim().slice(0, 3000),
        userId,
        userAgent,
        status: 'new',
      });
    } catch (dbErr) {
      console.error('Error saving contact to DB:', dbErr);
    }

    // 2. Send email notification via nodemailer transporter
    let emailSent = false;
    let emailError: string | null = null;
    try {
      await sendContactEmail(name.trim(), email.trim(), subject.trim(), message.trim());
      emailSent = true;
    } catch (mailErr: any) {
      console.error('Error sending contact email:', mailErr);
      emailError = mailErr?.message || 'Failed to dispatch email';
    }

    // 3. Update DB record with email dispatch status
    if (contactDoc) {
      contactDoc.emailSent = emailSent;
      if (emailError) contactDoc.emailError = emailError;
      await contactDoc.save();
    }

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        contactId: contactDoc?._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
