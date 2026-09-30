import Image from 'next/image';
import Link from 'next/link';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { stakeholders } from '@/data/stakeholders';

export const PartnersStakeholdersStrip = () => {
  const loop = [...stakeholders, ...stakeholders];

  return (
    <section className="bg-white py-8 sm:py-10">
      <SiteContainer>
        <div className="relative flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">
            Sponsors &amp; Stakeholders
          </h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-600">
            We collaborate with sponsors and stakeholders to advance shared goals, strengthen our collective impact, and support the sustainable development of the engineering profession in Somalia.
          </p>
          <Link
            href="/about/partners-stakeholders"
            className="mt-1 inline-flex items-center gap-2 self-center text-xs font-bold uppercase tracking-widest text-[#035CB3] transition-colors hover:text-[#024A8F] sm:absolute sm:right-0 sm:top-0 sm:self-auto"
          >
            View All
            <span aria-hidden>→</span>
          </Link>
        </div>
      </SiteContainer>

      <div className="marquee-mask mt-8 overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-12 py-2">
          {loop.map((s, i) => (
            <div key={`${s.name}-${i}`} className="flex h-20 w-32 shrink-0 items-center justify-center sm:h-24 sm:w-40">
              <Image
                src={s.logo}
                alt={s.name}
                width={160}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
