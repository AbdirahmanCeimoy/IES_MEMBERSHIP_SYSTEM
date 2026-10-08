'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

const images = [
    '/slides-home-section/slides-home-1.jpeg',
    '/slides-home-section/slides-home-2.jpeg',
    '/slides-home-section/slides-home-3.jpeg',
    '/slides-home-section/slides-home-4.jpeg',
    '/slides-home-section/slides-home-5.jpeg',
    '/slides-home-section/slides-home-6.jpeg',
    '/slides-home-section/slides-home-7.jpeg',
    '/slides-home-section/slides-home-8.jpeg',
    '/slides-home-section/slides-home-99.jpeg',
    '/slides-home-section/slides-home-11.jpeg',
    '/slides-home-section/slides-home-12.jpeg',
    '/slides-home-section/slides-home-13.jpeg',
    '/slides-home-section/slides-home-14.jpeg',
    '/slides-home-section/slides-home-15.jpeg',
    '/slides-home-section/maanka.jpeg',
    '/slides-home-section/slides-home-17.jpeg',
    '/slides-home-section/slides-home-18.jpeg',
    '/slides-home-section/slides-home-19.jpeg',
    '/slides-home-section/slides-home-20.jpeg',
    '/slides-home-section/slides-home-21.jpeg',
    '/slides-home-section/slides-home-22.jpeg',
    '/slides-home-section/slides-home-23.jpeg',
    '/slides-home-section/slides-home-24.jpeg',
    '/slides-home-section/slides-home-16.jpeg',
    '/slides-home-section/slides-home-25.jpeg',
];

// Heads sit in the top third of most event photos, so crop from the bottom by default.
const DEFAULT_POSITION = 'center 22%';

// Per-slide crop overrides (CSS object-position), tuned so faces clear the hero title.
const slidePositions: Record<string, string> = {
    '/slides-home-section/slides-home-9.jpeg': 'center 42%',
};

// Portrait photos: centred over a softened copy of themselves so they fill the wide hero like the landscape slides.
const portraitSlides = new Set(['/slides-home-section/slides-home-10.jpeg']);

export default function HomeSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }, []);

    // Auto-scroll
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full h-full overflow-hidden group">
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <div key={index} className="min-w-full h-full relative bg-[#022D5A]">
                        {portraitSlides.has(src) ? (
                            <>
                                {/* Backdrop: the same photo stretched across the frame and softened, so the banner continues to the edges. */}
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="100vw"
                                    className="scale-110 object-cover blur-md brightness-95"
                                    style={{ objectPosition: 'center top' }}
                                    aria-hidden="true"
                                />
                                {/* Mobile: whole photo. */}
                                <Image
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    fill
                                    sizes="100vw"
                                    className="object-contain md:hidden"
                                />
                                {/* Desktop: head-to-waist framing like the landscape slides, edges faded into the backdrop. */}
                                <div
                                    className="absolute left-1/2 top-[-6%] hidden h-[170%] -translate-x-1/2 md:block"
                                    style={{
                                        aspectRatio: '817 / 1089',
                                        maskImage: 'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
                                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 14%, black 86%, transparent)',
                                    }}
                                >
                                    <Image
                                        src={src}
                                        alt={`Slide ${index + 1}`}
                                        fill
                                        sizes="(min-width: 768px) 60vw, 100vw"
                                        className="object-cover"
                                    />
                                </div>
                            </>
                        ) : (
                            <Image
                                src={src}
                                alt={`Slide ${index + 1}`}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                style={{ objectPosition: slidePositions[src] ?? DEFAULT_POSITION }}
                                priority={index === 0}
                            />
                        )}
                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    </div>
                ))}
            </div>

            {/* Left Arrow - rounded pill style */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 flex h-8 w-12 items-center justify-center rounded-full bg-white/85 text-[#022D5A] opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white group-hover:opacity-100 focus:outline-none"
                aria-label="Previous Slide"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Arrow - rounded pill style */}
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 flex h-8 w-12 items-center justify-center rounded-full bg-white/85 text-[#022D5A] opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white group-hover:opacity-100 focus:outline-none"
                aria-label="Next Slide"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 sm:h-3 sm:w-3 ${currentIndex === index ? 'w-5 bg-white sm:w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
