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
      <SiteContainer className="flex h-16 items-center justify-between gap-4">
        <Link href={routes.home} className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#035CB3] rounded-md">
          <div className="relative h-11 w-11 shrink-0">
            <Image src={site.logo} alt={`${site.shortName} logo`} fill className="object-contain" priority />
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="whitespace-nowrap text-[11px] font-extrabold uppercase leading-tight tracking-[0.04em] text-[#035CB3]">The Institution of</span>
            <span className="whitespace-nowrap text-[11px] font-extrabold uppercase leading-tight tracking-[0.04em] text-[#035CB3]">Engineers Somalia (IES)</span>
          </div>
        </Link>

        <DesktopNavigation />

        <div className="flex items-center gap-2">
          <div className="hidden xl:flex">
            <NavigationActions />
          </div>
          <MobileNavigation />
        </div>
      </SiteContainer>
    </header>
  </>
);
