import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/config/site';
import { routes } from '@/config/routes';
import { SiteContainer } from './SiteContainer';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  YouTubeIcon,
  XIcon,
} from '@/components/navigation/TopBar';

const socialLinks = [
  { icon: FacebookIcon, href: site.social.facebook, label: 'Facebook' },
  { icon: InstagramIcon, href: site.social.instagram, label: 'Instagram' },
  { icon: LinkedInIcon, href: site.social.linkedin, label: 'LinkedIn' },
  { icon: TikTokIcon, href: site.social.tiktok, label: 'TikTok' },
  { icon: YouTubeIcon, href: site.social.youtube, label: 'YouTube' },
  { icon: XIcon, href: site.social.x, label: 'X' },
];

const quickLinks = [
  { label: 'About IES', href: routes.about.root },
  { label: 'Membership', href: routes.membership.root },
  { label: 'Apply Now', href: routes.membership.applicationGuidelines },
  { label: 'Member Check', href: routes.membership.memberCheck },
  { label: 'News', href: routes.infoHub.news },
  { label: 'Events', href: routes.events.root },
  { label: 'Gallery', href: routes.gallery.photos },
  { label: 'Member Login', href: routes.auth.login },
];

const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#48C184" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIconFooter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#48C184" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIconFooter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#48C184" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ChevronRight = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#48C184" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const Footer = ({ hideCta }: { hideCta?: boolean }) => (
  <footer className="mt-auto">
    {!hideCta && (
      <div className="bg-[#035CB3]">
        <SiteContainer className="flex items-center justify-between py-3">
          <p className="text-xs font-semibold text-white sm:text-sm">
            Join The Institution of Engineers Somalia (IES)
          </p>
          <Link
            href={routes.membership.applicationGuidelines}
            className="shrink-0 rounded-md bg-white px-4 py-1.5 text-[11px] font-bold text-[#035CB3] transition-all hover:bg-slate-100 sm:px-5 sm:py-2 sm:text-xs"
          >
            Apply for Membership
          </Link>
        </SiteContainer>
      </div>
    )}

    {/* Footer content */}
    <div className="bg-[#e2e8f0] text-slate-600">
      <SiteContainer className="py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + Name */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg p-0.5">
                <Image src={site.logo} alt="" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-[13px] font-bold uppercase leading-snug tracking-wide text-slate-800">
              The Institution of Engineers<br />Somalia (IES)
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800">Contact Us</h3>
              <span className="h-px flex-1 bg-slate-400/30" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-1.5">
                <MapPinIcon />
                <span className="text-[11px] leading-snug text-slate-500">{site.contact.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MailIconFooter />
                <a href={`mailto:${site.contact.generalEmail}`} className="text-[11px] text-slate-500 transition-colors hover:text-[#035CB3]">
                  {site.contact.generalEmail}
                </a>
              </div>
              <div className="flex items-start gap-1.5">
                <PhoneIconFooter />
                <div className="flex flex-col text-[11px] text-slate-500">
                  {site.contact.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:text-[#035CB3]">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Follow Us:</span>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-slate-400 transition-colors hover:text-[#035CB3]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Working Days & Hours */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="whitespace-nowrap text-xs font-bold text-slate-800">Working Days &amp; Hours</h3>
              <span className="h-px flex-1 bg-slate-400/30" />
            </div>
            <div className="flex flex-col gap-1.5 text-[11px] text-slate-500">
              <p className="leading-relaxed">
                Our office is open {site.contact.workingDays}, excluding major public holidays.
              </p>
              <div className="flex flex-col gap-0.5">
                <p>Working Days: <span className="font-semibold text-slate-700">{site.contact.workingDays}</span></p>
                <p>Working Hours: <span className="font-semibold text-slate-700">{site.contact.workingHours}</span></p>
                <p className="font-medium text-red-400">{site.contact.closedDay}: Closed</p>
              </div>
              <p className="leading-relaxed text-[10px] text-slate-400">
                For urgent assistance outside working hours, please contact us through our Hotline or submit a request through our Contact Form.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800">Quick Links</h3>
              <span className="h-px flex-1 bg-slate-400/30" />
            </div>
            <ul className="flex flex-col gap-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-[#035CB3]"
                  >
                    <ChevronRight />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SiteContainer>

      <div className="border-t border-slate-300/50">
        <SiteContainer className="flex flex-col items-center justify-between gap-1.5 py-2.5 sm:flex-row">
          <p className="text-[11px] text-slate-400">
            Copyright &copy; {new Date().getFullYear()} by The Institution of Engineers Somalia (IES). All Rights Reserved.
          </p>
          <p className="text-[11px] text-slate-400">
            Privacy Policy | Terms of Use
          </p>
        </SiteContainer>
      </div>
    </div>
  </footer>
);
