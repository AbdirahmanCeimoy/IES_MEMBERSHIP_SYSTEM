import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: `${site.shortName} - ${site.name}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  icons: {
    icon: [
      { url: site.logo, type: 'image/png' },
    ],
    shortcut: site.logo,
    apple: site.logo,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="mx-auto min-h-screen max-w-7xl bg-white text-slate-800 antialiased" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
