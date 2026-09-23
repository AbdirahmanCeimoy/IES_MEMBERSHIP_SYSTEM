import Image from 'next/image';
import { site } from '@/config/site';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata = { title: 'IES Journal' };

export default function IESJournalPage() {
  return (
    <PageContainer>
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="relative mb-8 h-24 w-24 overflow-hidden rounded-2xl bg-[#035CB3]/5 p-3 shadow-sm">
          <Image src={site.logo} alt="IES Logo" fill className="object-contain" />
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#48C184]/30 bg-[#48C184]/5 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#48C184] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#48C184]" />
          </span>
          <span className="text-xs font-semibold text-[#48C184]">Coming Soon</span>
        </div>

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[#035CB3]">
          IES Journal
        </h1>

        <p className="max-w-md text-sm leading-relaxed text-slate-500">
          The IES Journal is currently under development as a multidisciplinary engineering journal.
          Our editorial team is preparing a peer-reviewed publication featuring original research,
          technical articles, and engineering insights across diverse engineering disciplines in
          Somalia and beyond.
        </p>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          The journal will provide a platform for engineers, researchers, academics, and
          professionals to share knowledge, research, and innovations that contribute to the
          advancement of engineering.
        </p>
      </div>
    </PageContainer>
  );
}
