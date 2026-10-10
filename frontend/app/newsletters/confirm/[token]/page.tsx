import { Section } from '@/components/layout/Section';
import { PageHero } from '@/components/layout/PageHero';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { API_BASE_URL } from '@/lib/apiClient';
import { routes } from '@/config/routes';

export const metadata = { title: 'Confirm Subscription' };

type Params = { token: string };

async function confirmSubscription(token: string): Promise<{ success: boolean; message: string; email?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletters/confirm/${encodeURIComponent(token)}`, {
      method: 'POST',
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.success) {
      return { success: true, message: data.message ?? 'Your subscription has been confirmed.', email: data.email };
    }
    return {
      success: false,
      message: data?.message ?? 'This confirmation link is invalid or has expired.',
    };
  } catch {
    return { success: false, message: 'Unable to confirm your subscription right now. Please try again.' };
  }
}

export default async function ConfirmNewsletterPage({ params }: { params: Promise<Params> }) {
  const { token } = await params;
  const result = await confirmSubscription(token);

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Newsletter' }, { label: 'Confirm' }]} />}
        eyebrow="Newsletter"
        title={result.success ? 'Subscription Confirmed' : 'Confirmation Issue'}
        description={result.success ? 'Welcome aboard.' : 'We could not confirm this link.'}
      />
      <Section spacing="compact">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {result.success ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#48C184]/15 text-[#2d7a50]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#022D5A]">You're subscribed</h2>
              <p className="mt-2 text-sm text-slate-600">
                {result.email ? `${result.email} is now confirmed.` : 'Your subscription is now confirmed.'}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                You will start receiving IES news, announcements, and publications directly in your inbox.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#022D5A]">We couldn't confirm this link</h2>
              <p className="mt-2 text-sm text-slate-600">{result.message}</p>
              <p className="mt-1 text-sm text-slate-600">
                You can request a new confirmation email by subscribing again from the footer below.
              </p>
            </>
          )}
          <div className="mt-6 flex justify-center">
            <Button href={routes.home} variant="primary" size="sm">
              Return home
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
