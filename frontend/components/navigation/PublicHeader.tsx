import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { SiteContainer } from '@/components/layout/SiteContainer';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { NavigationActions } from './NavigationActions';

export const PublicHeader = () => (
  <header className="sticky top-0 z-[60] border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
    <SiteContainer className="flex h-16 items-center justify-between gap-4">
      <Link href={routes.home} className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047AB] rounded-md">
        <div className="relative h-10 w-10 shrink-0">
          <Image src={site.logo} alt={`${site.shortName} logo`} fill className="object-contain" priority />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-[#0047AB]">{site.shortName}omalia</span>
          <span className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:block">
            {site.name}
          </span>
        </div>
      </Link>

      <DesktopNavigation />

      <div className="flex items-center gap-2">
        <div className="hidden lg:flex">
          <NavigationActions />
        </div>
        <MobileNavigation />
      </div>
    </SiteContainer>
  </header>
);
