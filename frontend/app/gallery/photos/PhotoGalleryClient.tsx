'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import type { SeminarEvent } from '@/data/seminars';

interface Props {
  events: SeminarEvent[];
}

interface YearGroup {
  year: string;
  events: SeminarEvent[];
}

const extractYear = (date: string): string => {
  const m = date.match(/\b(20\d{2})\b/);
  return m ? m[1] : '-';
};

/** Group by year, newest year first; events within a year newest first. */
const groupByYear = (events: SeminarEvent[]): YearGroup[] => {
  const map = new Map<string, SeminarEvent[]>();
  for (const e of events) {
    const y = extractYear(e.date);
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(e);
  }
  const years = Array.from(map.keys()).sort((a, b) => Number(b) - Number(a));
  return years.map((year) => ({
    year,
    events: map.get(year)!.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
  }));
};

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export function PhotoGalleryClient({ events }: Props) {
  const grouped = useMemo(() => groupByYear(events), [events]);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openEvent = events.find((e) => e.slug === openSlug) ?? null;
  const photos = openEvent?.photos ?? [];

  const closeGallery = useCallback(() => {
    setOpenSlug(null);
    setLightboxIndex(null);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const nextPhoto = useCallback(() => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((i) => (i! + 1) % photos.length);
  }, [lightboxIndex, photos.length]);

  const prevPhoto = useCallback(() => {
    if (lightboxIndex === null || photos.length === 0) return;
    setLightboxIndex((i) => (i! - 1 + photos.length) % photos.length);
  }, [lightboxIndex, photos.length]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (openSlug) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [openSlug]);

  // Keyboard: Esc to close, Arrow keys for lightbox nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) closeLightbox();
        else if (openSlug) closeGallery();
      } else if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSlug, lightboxIndex, closeGallery, closeLightbox, nextPhoto, prevPhoto]);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 py-14 text-center">
        <p className="text-sm text-slate-500">No photo galleries available yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {grouped.map(({ year, events: yearEvents }) => (
        <div key={year}>
          <div className="mb-5 flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#022D5A]">{year}</h2>
            <span className="rounded-full bg-[#035CB3]/10 px-2.5 py-0.5 text-xs font-semibold text-[#035CB3]">
              {yearEvents.length} {yearEvents.length === 1 ? 'event' : 'events'}
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex flex-wrap gap-6">
            {yearEvents.map((event) => (
              <article
                key={event.slug}
                className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
              >
                <button
                  type="button"
                  onClick={() => { setOpenSlug(event.slug); setLightboxIndex(null); }}
                  className="relative block aspect-[4/5] w-full overflow-hidden bg-slate-50"
                  aria-label={`View photos of ${event.title}`}
                >
                  <Image
                    src={event.cardImage}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Category badge */}
                  <span className={
                    'absolute left-3 top-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow ' +
                    (event.category === 'Panel Discussion'
                      ? 'bg-[#48C184] text-white'
                      : 'bg-white/95 text-[#035CB3]')
                  }>
                    {event.category}
                  </span>
                  {/* Photo count badge */}
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    <CameraIcon /> {event.photos?.length ?? 0}
                  </div>
                </button>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-snug text-[#022D5A] sm:text-lg">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{event.date}</p>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => { setOpenSlug(event.slug); setLightboxIndex(null); }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#022D5A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#035CB3]"
                    >
                      <CameraIcon />
                      View Photos
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

      {/* Photo gallery modal */}
      {openEvent && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/80 p-4 backdrop-blur-sm"
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label={`Photos from ${openEvent.title}`}
        >
          <div
            className="relative my-8 w-full max-w-6xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-2xl border-b border-slate-200 bg-white px-5 py-4">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-[#022D5A] sm:text-lg">
                  {openEvent.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {openEvent.date} · {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeGallery}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#022D5A]"
                aria-label="Close gallery"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Photo grid */}
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 transition-all hover:ring-2 hover:ring-[#035CB3]"
                  aria-label={`Open photo ${idx + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${openEvent.title} photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen lightbox */}
      {openEvent && lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close photo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Previous photo"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative h-full max-h-[85vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex]}
              alt={`${openEvent.title} photo ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Next photo"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
