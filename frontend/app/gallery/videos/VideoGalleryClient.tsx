'use client';

import { useEffect, useState, useCallback } from 'react';
import type { GalleryVideo } from '@/data/gallery-videos';

interface Props {
  videos: GalleryVideo[];
}

const PlayIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export function VideoGalleryClient({ videos }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openVideo = videos.find((v) => v.slug === openSlug) ?? null;

  const closeVideo = useCallback(() => setOpenSlug(null), []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (openSlug) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [openSlug]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openSlug) closeVideo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSlug, closeVideo]);

  if (videos.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 py-14 text-center">
        <p className="text-sm text-slate-500">No videos available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-6">
        {videos.map((video) => (
          <article
            key={video.slug}
            className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
          >
            {/* Video thumbnail (poster) */}
            <button
              type="button"
              onClick={() => setOpenSlug(video.slug)}
              className="relative block aspect-video w-full overflow-hidden bg-slate-900"
              aria-label={`Play ${video.title}`}
            >
              <video
                src={video.videoSrc}
                preload="metadata"
                muted
                playsInline
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#022D5A] shadow-xl transition-transform group-hover:scale-110">
                  <PlayIcon size={28} />
                </div>
              </div>
              {video.category && (
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[#48C184] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow">
                  {video.category}
                </span>
              )}
            </button>

            {/* Card body */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-bold leading-snug text-[#022D5A] sm:text-lg">
                {video.title}
              </h3>
              {video.date && (
                <p className="mt-1 text-xs text-slate-500">{video.date}</p>
              )}
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">
                {video.description[0]}
              </p>

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={() => setOpenSlug(video.slug)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#48C184] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2d7a50]"
                >
                  <PlayIcon size={14} />
                  View Video
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Video player modal */}
      {openVideo && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/80 p-4 backdrop-blur-sm"
          onClick={closeVideo}
          role="dialog"
          aria-modal="true"
          aria-label={`Playing ${openVideo.title}`}
        >
          <div
            className="relative my-8 w-full max-w-5xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-[#022D5A] sm:text-lg">
                  {openVideo.title}
                </h3>
                {openVideo.date && (
                  <p className="text-xs text-slate-500">{openVideo.date}</p>
                )}
              </div>
              <button
                type="button"
                onClick={closeVideo}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#022D5A]"
                aria-label="Close video"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Video player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src={openVideo.videoSrc}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-3 p-5">
              {openVideo.description.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-slate-700">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
