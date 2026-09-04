'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/all';
import { Project } from '@/lib/data';

gsap.registerPlugin(Observer);

interface ScrollProjectShowcaseProps {
    projects: Project[];
}

export default function ScrollProjectShowcase({ projects }: ScrollProjectShowcaseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<HTMLElement[]>([]);
    const currentIndex = useRef(0);
    const animating = useRef(false);
    const navigateRef = useRef<(index: number, direction: 1 | -1) => void>(() => undefined);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        const panels = panelsRef.current;

        if (!container || panels.length === 0) return;

        gsap.set(panels, { autoAlpha: 0, xPercent: 100, zIndex: 0 });
        gsap.set(panels[0], { autoAlpha: 1, xPercent: 0, zIndex: 1 });

        const wrap = gsap.utils.wrap(0, projects.length);

        const goToProject = (requestedIndex: number, direction: 1 | -1) => {
            if (animating.current || projects.length < 2) return;

            const nextIndex = wrap(requestedIndex);
            const currentPanel = panels[currentIndex.current];
            const nextPanel = panels[nextIndex];

            if (currentPanel === nextPanel) return;

            animating.current = true;
            gsap.set(nextPanel, { autoAlpha: 1, xPercent: 100 * direction, zIndex: 2 });

            const timeline = gsap.timeline({
                defaults: { duration: 0.85, ease: 'expo.inOut' },
                onComplete: () => {
                    gsap.set(currentPanel, { autoAlpha: 0, zIndex: 0 });
                    animating.current = false;
                },
            });

            timeline.to(currentPanel, { xPercent: -100 * direction }, 0);
            timeline.to(nextPanel, { xPercent: 0 }, 0);
            timeline.call(() => setActiveIndex(nextIndex), [], 0.25);
            currentIndex.current = nextIndex;
        };

        navigateRef.current = goToProject;

        const observer = Observer.create({
            target: container,
            type: 'wheel,touch,pointer',
            tolerance: 18,
            wheelSpeed: -1,
            onUp: () => goToProject(currentIndex.current + 1, 1),
            onDown: () => goToProject(currentIndex.current - 1, -1),
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!container.matches(':hover') && document.activeElement !== container) return;

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                goToProject(currentIndex.current + 1, 1);
            }

            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                goToProject(currentIndex.current - 1, -1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            observer.kill();
            window.removeEventListener('keydown', handleKeyDown);
            navigateRef.current = () => undefined;
        };
    }, [projects.length]);

    const goTo = (index: number) => {
        const direction = index > currentIndex.current ? 1 : -1;
        navigateRef.current(index, direction);
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            aria-label="Selected projects showcase. Use the arrow keys or scroll to change projects."
            className="relative h-[min(68vh,640px)] min-h-[500px] w-full overflow-hidden border-y border-white/15 outline-none focus-visible:ring-1 focus-visible:ring-white/60"
        >
            {projects.map((project, index) => (
                <article
                    key={project.id}
                    ref={(element) => {
                        if (element) panelsRef.current[index] = element;
                    }}
                    aria-hidden={activeIndex !== index}
                    className="absolute inset-0 grid grid-cols-1 overflow-hidden bg-black md:grid-cols-12"
                >
                    <div className="relative flex min-h-[290px] flex-col justify-between overflow-hidden border-b border-white/10 p-6 md:col-span-7 md:min-h-0 md:border-b-0 md:border-r md:p-12">
                        <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at ${30 + index * 16}% ${25 + index * 10}%, rgba(255,255,255,0.16), transparent 38%), linear-gradient(135deg, #111111, #030303 70%)` }} />
                        <div className="relative z-10 flex items-start justify-between text-xs uppercase tracking-[0.3em] text-white/45">
                            <span>Selected work</span>
                            <span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
                        </div>
                        <div className="relative z-10 mt-12 md:mt-0">
                            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/40">{project.year}</p>
                            <h3 className="max-w-3xl text-[clamp(2.5rem,6vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.07em] text-white mix-blend-difference">
                                {project.title}
                            </h3>
                        </div>
                        <div className="relative z-10 mt-10 h-1 w-2/3 overflow-hidden bg-white/10">
                            <div className="h-full bg-white transition-all duration-500" style={{ width: `${((index + 1) / projects.length) * 100}%` }} />
                        </div>
                    </div>

                    <div className="relative flex flex-col justify-between bg-white/[0.04] p-6 md:col-span-5 md:p-12">
                        <div>
                            <p className="max-w-md text-base leading-7 text-white/65 md:text-lg">{project.description}</p>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {project.tech.map((technology) => (
                                    <span key={technology} className="border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/60">
                                        {technology}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10 flex items-end justify-between gap-5">
                            <span className="text-6xl font-bold tracking-[-0.08em] text-white/10 md:text-8xl">0{index + 1}</span>
                            <div className="flex gap-2" aria-label="Choose project">
                                {projects.map((item, itemIndex) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-label={`Show ${item.title}`}
                                        aria-current={activeIndex === itemIndex}
                                        onClick={() => goTo(itemIndex)}
                                        className={`h-2 transition-all ${activeIndex === itemIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/70'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
            <p className="pointer-events-none absolute bottom-4 left-6 z-20 text-[10px] uppercase tracking-[0.25em] text-white/35 md:left-12">Scroll or use arrow keys</p>
        </div>
    );
}
