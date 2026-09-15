import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/config/site';
import { footerNavigation } from '@/config/navigation';
import { SiteContainer } from './SiteContainer';

export const Footer = () => (
  <footer className="mt-auto bg-[#082B55] text-slate-200">
    <SiteContainer className="py-8">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 shrink-0">
              <Image src={site.logo} alt="" fill className="object-contain" />
            </div>
            <span className="text-sm font-bold text-white">{site.name}</span>
          </Link>
          <p className="max-w-sm text-[11px] leading-relaxed text-slate-300">
            {site.description}
          </p>
          <div className="mt-1 text-[11px] text-slate-300">
            <a href={`mailto:${site.contact.generalEmail}`} className="hover:text-white">
              {site.contact.generalEmail}
            </a>
          </div>
        </div>

        {Object.entries(footerNavigation).map(([key, group]) => (
          <div key={key} className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#66FF00]">
              {group.label}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[11px] text-slate-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-4 text-[10px] text-slate-400 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p>Established {site.established} · {site.domain}</p>
      </div>
    </SiteContainer>
  </footer>
);
