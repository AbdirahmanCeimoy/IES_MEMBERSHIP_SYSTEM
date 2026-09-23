import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const nestUrl = process.env.NEST_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (nestUrl) {
      try {
        await fetch(`${nestUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, subject, message }),
        });
      } catch {
        // backend unreachable — fall through to mailto
      }
    }

    const mailtoSubject = encodeURIComponent(`[IES Contact] ${subject}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\n${message}`,
    );
    const mailto = `mailto:info@iesomalia.org.so?subject=${mailtoSubject}&body=${mailtoBody}`;

    return NextResponse.json({ success: true, mailto });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
