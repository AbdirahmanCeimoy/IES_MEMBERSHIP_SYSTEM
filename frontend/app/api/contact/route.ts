import { NextResponse } from 'next/server';

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  category?: string;
  regNumber?: string;
  isMember?: boolean;
  anonymous?: boolean;
  type?: 'contact' | 'report';
}

/**
 * Forward the submission to the Nest/Laravel backend if configured.
 * Non-blocking — errors are logged but never fail the request.
 */
async function forwardToBackend(payload: ContactPayload): Promise<void> {
  const nestUrl = process.env.NEST_BACKEND_URL
    || process.env.NEXT_PUBLIC_API_URL
    || 'http://127.0.0.1:8000/api';
  if (!nestUrl) return;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${nestUrl}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn('[contact-api] backend returned', res.status);
    }
  } catch (err) {
    console.warn('[contact-api] backend unreachable:', (err as Error).message);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, subject, message, anonymous, type } = body;

  // For anonymous reports, email is not required (just name='Anonymous')
  const requireEmail = !anonymous;
  const missing: string[] = [];
  if (!name) missing.push('name');
  if (requireEmail && !email) missing.push('email');
  if (!subject) missing.push('subject');
  if (!message) missing.push('message');

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  // Log the submission so admins can see it in server logs (dev + prod).
  const prefix = type === 'report' ? '[REPORT VIOLATION]' : '[CONTACT]';
  console.log(prefix, {
    name,
    email: email || '(anonymous)',
    subject,
    anonymous: !!anonymous,
    timestamp: new Date().toISOString(),
  });

  // Fire-and-forget backend forwarding; never let it fail the response.
  forwardToBackend(body).catch(() => {});

  const mailtoSubject = encodeURIComponent(
    type === 'report' ? `[IES Report] ${subject}` : `[IES Contact] ${subject}`,
  );
  const mailtoBody = encodeURIComponent(
    `Name: ${name}\nEmail: ${email || '(anonymous)'}\n\n${message}`,
  );
  const mailto = `mailto:info@iesomalia.org.so?subject=${mailtoSubject}&body=${mailtoBody}`;

  return NextResponse.json({ success: true, mailto });
}
