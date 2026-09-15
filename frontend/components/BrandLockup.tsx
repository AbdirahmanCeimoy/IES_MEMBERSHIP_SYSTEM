'use client';

import Image from 'next/image';
import Link from 'next/link';

type BrandLockupProps = {
  title?: string;
  subtitle?: string;
  href?: string;
  align?: 'left' | 'center';
  variant?: 'light' | 'dark';
  imageSize?: number;
  priority?: boolean;
  className?: string;
};

const BrandLockup = ({
  title = 'IES Portal',
  subtitle = 'Somalia',
  href = '/',
  align = 'left',
  variant = 'light',
  imageSize = 64,
  priority = false,
  className = '',
}: BrandLockupProps) => {
  const isDark = variant === 'dark';
  const content = (
    <div
      className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''} ${className}`}
    >
      <div
        className="relative shrink-0 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
        style={{ width: imageSize, height: imageSize }}
      >
        <Image
          src="/logo-ies.jpg"
          alt="Institution of Engineers Somalia logo"
          fill
          sizes={`${imageSize}px`}
          priority={priority}
          className="object-contain"
        />
      </div>
      <div className={align === 'center' ? 'text-left' : ''}>
        <div
          className={`text-[26px] font-black leading-none tracking-tight ${
            isDark ? 'text-white' : 'text-[#1e3a8a]'
          }`}
        >
          {title}
        </div>
        <div
          className={`mt-1 text-xs font-bold uppercase tracking-[0.28em] ${
            isDark ? 'text-white/70' : 'text-slate-500'
          }`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  ) : (
    <div className="inline-flex">{content}</div>
  );
};

export default BrandLockup;
