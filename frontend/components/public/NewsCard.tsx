import Link from 'next/link';
import Image from 'next/image';

export interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
  href: string;
  category?: string;
  image?: string;
}

export const NewsCard = ({ item }: { item: NewsItem }) => {
  const [day, month] = item.date.split(' ');

  return (
    <Link href={item.href} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#035CB3]/10 to-[#48C184]/10">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="absolute right-3 top-3 flex flex-col items-center rounded-lg bg-[#035CB3] px-2.5 py-1.5 text-center leading-none text-white shadow-md">
          <span className="text-lg font-extrabold">{day}</span>
          <span className="text-[9px] font-bold uppercase tracking-wide">{month}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-sm font-bold leading-snug text-[#022D5A] group-hover:text-[#035CB3]">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#035CB3]">
          Read More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );
};
