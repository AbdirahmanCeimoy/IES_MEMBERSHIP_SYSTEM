import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { NavigationActions } from './NavigationActions';
import { TopBar } from './TopBar';

export const PublicHeader = () => (
  <>
    <TopBar />
    <header className="sticky top-0 z-[60] border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <SiteContainer className="flex h-16 max-w-none items-center justify-between gap-3 lg:px-6 xl:px-4">
        <Link href={routes.home} className="flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035CB3] rounded-md">
          <div className="relative h-11 w-11 shrink-0">
            <Image src={site.logo} alt={`${site.shortName} logo`} fill className="object-contain" priority />
          </div>
          {/* Two lines on mobile/tablet; stacked into three narrower lines on desktop to leave room for the nav. */}
          <div className="hidden shrink-0 flex-col sm:flex xl:hidden">
            <span className="whitespace-nowrap text-[11px] font-extrabold uppercase leading-tight tracking-[0.04em] text-[#035CB3]">The Institution of</span>
            <span className="whitespace-nowrap text-[11px] font-extrabold uppercase leading-tight tracking-[0.04em] text-[#035CB3]">Engineers Somalia (IES)</span>
          </div>
          <div className="hidden shrink-0 flex-col xl:flex">
            <span className="whitespace-nowrap text-[9.5px] font-extrabold uppercase leading-[1.25] tracking-[0.03em] text-[#035CB3]">The Institution</span>
            <span className="whitespace-nowrap text-[9.5px] font-extrabold uppercase leading-[1.25] tracking-[0.03em] text-[#035CB3]">of Engineers</span>
            <span className="whitespace-nowrap text-[9.5px] font-extrabold uppercase leading-[1.25] tracking-[0.03em] text-[#035CB3]">Somalia (IES)</span>
          </div>
        </Link>

        <DesktopNavigation />

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden xl:flex">
            <NavigationActions />
          </div>
          <MobileNavigation />
        </div>
      </SiteContainer>
    </header>
  </>
);
