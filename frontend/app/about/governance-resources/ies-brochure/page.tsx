import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { routes } from '@/config/routes';

export const metadata = { title: 'IES Brochure' };

const BROCHURE_PDF = '/documents/IES-Brochure-2026.pdf';

export default function BrochurePage() {
  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: routes.about.root },
              { label: 'Governance Resources', href: routes.about.governance.root },
              { label: 'IES Brochure' },
            ]}
          />
        }
        eyebrow="About IES"
        title="IES Brochure"
      />
      <Section>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <object
            data={BROCHURE_PDF}
            type="application/pdf"
            className="h-[80vh] w-full"
          >
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <p className="text-base font-medium text-slate-700">
                able to display the PDF in your browser.
              </p>
              <a
                href={BROCHURE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#024A8F]"
              >
                Open PDF
              </a>
            </div>
          </object>
        </div>
      </Section>
    </>
  );
}
