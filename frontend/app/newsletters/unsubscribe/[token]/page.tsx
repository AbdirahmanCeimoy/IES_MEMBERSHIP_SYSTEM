import { Section } from '@/components/layout/Section';
import { PageHero } from '@/components/layout/PageHero';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { API_BASE_URL } from '@/lib/apiClient';
import { routes } from '@/config/routes';

export const metadata = { title: 'Unsubscribe' };

type Params = { token: string };

async function unsubscribe(token: string): Promise<{ success: boolean; message: string; email?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletters/unsubscribe/${encodeURIComponent(token)}`, {
      method: 'POST',
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.success) {
      return { success: true, message: data.message ?? 'You have been unsubscribed.', email: data.email };
    }
    return { success: false, message: data?.message ?? 'This unsubscribe link is invalid.' };
  } catch {
    return { success: false, message: 'Unable to unsubscribe right now. Please try again.' };
  }
}

export default async function UnsubscribePage({ params }: { params: Promise<Params> }) {
  const { token } = await params;
  const result = await unsubscribe(token);

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Newsletter' }, { label: 'Unsubscribe' }]} />}
        eyebrow="Newsletter"
        title={result.success ? 'You are unsubscribed' : 'Unsubscribe Issue'}
        description={result.success ? 'We won\'t email you anymore.' : 'We could not process this link.'}
      />
      <Section spacing="compact">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {result.success ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#022D5A]">Unsubscribed</h2>
              <p className="mt-2 text-sm text-slate-600">
                {result.email ? `${result.email} has been removed from our newsletter.` : 'Your email has been removed from our newsletter.'}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                If this was a mistake, you can resubscribe at any time from the footer below.
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
              <h2 className="text-xl font-bold text-[#022D5A]">We couldn't process this request</h2>
              <p className="mt-2 text-sm text-slate-600">{result.message}</p>
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
