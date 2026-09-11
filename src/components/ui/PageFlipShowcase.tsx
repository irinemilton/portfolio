'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Project } from '@/lib/data';

type BookPageType = 'cover' | 'project' | 'final';

interface BookPage {
    type: BookPageType;
    project?: Project;
    image?: string;
}

interface PageFlipShowcaseProps {
    projects: Project[];
}

export default function PageFlipShowcase({ projects }: PageFlipShowcaseProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [flipping, setFlipping] = useState<number | null>(null);
    const currentPageRef = useRef(0);
    const animatingRef = useRef(false);
    const touchStartRef = useRef<number | null>(null);
    const reduced = useReducedMotion();
    const flipDuration = reduced ? 0 : 1050;

    const pages: BookPage[] = [
        { type: 'cover' },
        ...projects.map((project) => ({ type: 'project' as const, project })),
        { type: 'final' },
    ];

    const pageCountRef = useRef(pages.length);
    pageCountRef.current = pages.length;

    const flipTo = useCallback(
        (next: number) => {
            const curr = currentPageRef.current;
            if (
                next === curr ||
                next < 0 ||
                next >= pageCountRef.current ||
                animatingRef.current
            ) {
                return;
            }

            animatingRef.current = true;
            const changing = next > curr ? curr : next;

            setFlipping(changing);
            setCurrentPage(next);
            currentPageRef.current = next;

            window.setTimeout(() => {
                animatingRef.current = false;
                setFlipping(null);
            }, flipDuration + 50);
        },
        [flipDuration]
    );

    const nextPage = useCallback(() => flipTo(currentPageRef.current + 1), [flipTo]);
    const previousPage = useCallback(() => flipTo(currentPageRef.current - 1), [flipTo]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                nextPage();
            }

            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                previousPage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextPage, previousPage]);

    const handleTouchStart = (event: React.TouchEvent) => {
        touchStartRef.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: React.TouchEvent) => {
        if (touchStartRef.current === null) return;

        const deltaX = event.changedTouches[0].clientX - touchStartRef.current;
        touchStartRef.current = null;

        if (Math.abs(deltaX) < 48) return;
        if (deltaX < 0) nextPage();
        else previousPage();
    };

    const zIndex = (index: number, flipped: boolean) => {
        if (flipping === index) return 'z-30';
        if (flipped) return 'z-10';
        if (currentPage === index) return 'z-20';
        return '';
    };

    const flipTransition = reduced
        ? 'transition-none'
        : 'transition-transform duration-1000 ease-[cubic-bezier(.6,.045,.165,1)]';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mx-auto w-full"
        >
            <div
                role="group"
                aria-roledescription="carousel"
                aria-label="Selected work flip book"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative h-[min(68vh,620px)] min-h-[420px] w-full max-w-[1180px] mx-auto [perspective:1800px] shadow-[0_45px_60px_-35px_rgba(0,0,0,0.9)]"
            >
                {/* LEFT CONTENTS PAGE (static) */}
                <div className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-1/2 flex-col justify-between bg-[#0c0e0d] p-8 md:flex md:p-10">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0) 40%), radial-gradient(circle at 15% 85%, rgba(255,255,255,0.06), transparent 55%)' }} />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/50 to-transparent" />

                    <div className="relative z-10 text-[10px] uppercase tracking-[0.35em] text-white/50">
                        Contents
                    </div>

                    <ol className="relative z-10 space-y-5">
                        {projects.map((project, i) => {
                            const isActive = currentPage - 1 === i;

                            return (
                                <li key={project.id}>
                                    <div className={`flex items-baseline gap-4 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/35'}`}>
                                        <span className="font-mono text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                                        <span className="flex-1 font-sans text-lg font-bold uppercase tracking-[-0.02em]">{project.title}</span>
                                        <span className="font-mono text-[9px] uppercase tracking-[0.2em]">{project.year}</span>
                                    </div>
                                    {isActive && (
                                        <div className="ml-10 mt-2 h-px w-16 bg-white/60 transition-all duration-300" />
                                    )}
                                </li>
                            );
                        })}
                    </ol>

                    <div className="relative z-10 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">
                        {projects.length} Featured Projects
                    </div>
                </div>

                {/* PAGES */}
                {pages.map((page, index) => {
                    const flipped = index < currentPage;
                    const imageUrl = page.image ?? page.project?.image;

                    return (
                        <div
                            key={`${page.type}-${index}`}
                            aria-hidden={currentPage !== index}
                            className={`absolute right-0 top-0 h-full w-full origin-left [transform-style:preserve-3d] md:w-1/2 ${flipTransition} ${zIndex(index, flipped)}`}
                            style={{
                                transform: flipped
                                    ? 'rotateY(-180deg)'
                                    : 'rotateY(0deg)',
                            }}
                        >
                            {/* FRONT */}
                            <div
                                className="absolute inset-0 overflow-hidden bg-[#0a0a0a] [backface-visibility:hidden]"
                                style={
                                    imageUrl
                                        ? {
                                              backgroundImage: `url("${encodeURI(imageUrl)}")`,
                                              backgroundSize: 'cover',
                                              backgroundPosition: 'center',
                                          }
                                        : undefined
                                }
                            >
                                {/* Dark overlay for legibility */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            page.type === 'project'
                                                ? 'linear-gradient(160deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.95) 100%)'
                                                : 'radial-gradient(circle at 70% 25%, rgba(255,255,255,0.08), transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.85))',
                                    }}
                                />

                                {/* Spine shading */}
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/60 to-transparent" />

                                {/* Section marker */}
                                <div className="absolute left-6 top-6 z-10 font-sans text-[10px] uppercase tracking-[0.35em] text-white/60">
                                    {page.type === 'cover'
                                        ? 'Irine Milton'
                                        : page.type === 'final'
                                        ? 'Portfolio Series 01'
                                        : 'Selected Work'}
                                </div>

                                {/* Page number */}
                                <div className="absolute bottom-5 left-8 z-10 font-sans text-xs tracking-[0.4em] text-white/70">
                                    {String(index + 1).padStart(2, '0')}
                                    <div className="mt-2 h-px w-16 bg-white/40" />
                                </div>

                                {/* CONTENT */}
                                <div className="relative z-10 h-full w-full">
                                    {page.type === 'cover' && (
                                        <div className="flex h-full items-center justify-center">
                                            <div className="border-y border-white/50 px-8 py-5 text-center backdrop-blur-[2px]">
                                                <h2 className="font-sans text-[clamp(2.4rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-[-0.04em] text-white">
                                                    Selected
                                                    <br />
                                                    Work
                                                </h2>

                                                <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.5em] text-white/70">
                                                    Portfolio Series&nbsp;·&nbsp;01
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {page.type === 'project' && page.project && (
                                        <div className="flex h-full flex-col justify-between py-14 md:py-16">
                                            <div className="flex items-start justify-between pl-8 pr-8 text-[10px] uppercase tracking-[0.3em] text-white/50 md:pl-10">
                                                <span className="border-l border-white/40 pl-3">
                                                    Project {String((index)).padStart(2, '0')}
                                                </span>
                                                <span>
                                                    {String(index).padStart(2, '0')} / {String(pages.length - 2).padStart(2, '0')}
                                                </span>
                                            </div>

                                            <div className="max-w-[92%] pl-8 md:pl-10">
                                                <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-white/60">
                                                    {page.project.year}
                                                </p>

                                                <h3 className="font-sans text-[clamp(1.9rem,3.6vw,3.8rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-white">
                                                    {page.project.title}
                                                </h3>

                                                <p className="mt-5 max-w-md font-sans text-sm leading-6 text-white/70 md:text-[15px]">
                                                    {page.project.description}
                                                </p>

                                                <div className="mt-6 flex max-w-md flex-wrap gap-2">
                                                    {page.project.tech.map((technology) => (
                                                        <span
                                                            key={technology}
                                                            className="border border-white/20 px-3 py-1 font-sans text-[9px] uppercase tracking-[0.16em] text-white/65"
                                                        >
                                                            {technology}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {page.type === 'final' && (
                                        <div className="flex h-full flex-col items-center justify-center gap-8 px-8 text-center">
                                            <div className="border-y border-white/40 py-5">
                                                <h2 className="font-sans text-[clamp(1.7rem,4vw,3.2rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-white">
                                                    Let&apos;s build
                                                    <br />
                                                    something great
                                                </h2>
                                            </div>

                                            <a
                                                href="#contact"
                                                className="rounded-full border border-white/30 px-8 py-4 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:bg-white hover:text-black"
                                            >
                                                Start a project
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* BACK */}
                            <div className="absolute inset-0 overflow-hidden bg-[#0d0f0e] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)' }} />

                                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/60 to-transparent" />

                                <div className="absolute left-6 top-6 font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">
                                    Selected Work
                                </div>

                                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right">
                                    <span className="font-sans text-7xl font-extrabold tracking-[-0.05em] text-white/[0.08] md:text-8xl">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* LEFT ARROW */}
                <button
                    type="button"
                    onClick={previousPage}
                    disabled={currentPage === 0}
                    aria-label="Previous page"
                    className="absolute left-2 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white/70 transition-all duration-300 hover:scale-105 hover:border-white/70 hover:text-white disabled:pointer-events-none disabled:opacity-0"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* RIGHT ARROW */}
                <button
                    type="button"
                    onClick={nextPage}
                    disabled={currentPage === pages.length - 1}
                    aria-label="Next page"
                    className="absolute right-2 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white/70 transition-all duration-300 hover:scale-105 hover:border-white/70 hover:text-white disabled:pointer-events-none disabled:opacity-0"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* PAGE INDICATOR */}
                <div className="pointer-events-none absolute -bottom-8 left-1/2 z-40 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
                    {String(currentPage + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
                </div>
            </div>

            <p className="mt-12 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-white/30">
                Use the arrows, swipe, or arrow keys to flip
            </p>
        </motion.div>
    );
}