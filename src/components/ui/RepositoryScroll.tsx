'use client';

import { motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Repository } from '@/lib/data';

interface RepositoryScrollProps {
    repositories: Repository[];
}

export default function RepositoryScroll({ repositories }: RepositoryScrollProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-scroll animation
    useAnimationFrame((time, delta) => {
        if (!scrollRef.current || isPaused) return;

        const scrollSpeed = 0.3; // Reduced from 0.5 for smoother scrolling
        scrollRef.current.scrollLeft += scrollSpeed;

        // Reset scroll when reaching the end (infinite loop)
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScroll / 2) {
            scrollRef.current.scrollLeft = 0;
        }
    });

    // Duplicate repositories for seamless infinite scroll
    const duplicatedRepos = [...repositories, ...repositories];

    return (
        <div className="w-full overflow-hidden py-12" suppressHydrationWarning>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
                className="mb-8"
            >
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight opacity-50">
                    ALL REPOSITORIES
                </h3>
            </motion.div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                tabIndex={-1}
                onKeyDown={(e) => e.preventDefault()}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {duplicatedRepos.map((repo, index) => (
                    <motion.a
                        key={`${repo.name}-${index}`}
                        href={repo.repo !== 'Private' ? `https://github.com/${repo.repo}` : undefined}
                        target={repo.repo !== 'Private' ? '_blank' : undefined}
                        rel={repo.repo !== 'Private' ? 'noopener noreferrer' : undefined}
                        tabIndex={-1}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.5,
                            delay: (index % repositories.length) * 0.03,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        whileHover={{
                            scale: 1.05,
                            y: -8,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }
                        }}
                        className={`
                            group relative flex-shrink-0 w-80 h-48
                            border border-white/10 rounded-lg p-6
                            transition-all duration-300
                            hover:border-white/30
                            ${repo.repo === 'Private' ? 'cursor-default' : 'cursor-pointer'}
                        `}
                    >
                        {/* Hover gradient effect */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-xl font-bold tracking-tight line-clamp-1">
                                        {repo.name}
                                    </h4>
                                    {repo.repo === 'Private' && (
                                        <span className="text-xs px-2 py-1 border border-white/20 rounded-full opacity-50">
                                            PRIVATE
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm opacity-60 line-clamp-3 leading-relaxed mb-4">
                                    {repo.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs px-3 py-1 border border-white/10 rounded-full opacity-40">
                                    {repo.category}
                                </span>

                                {repo.repo !== 'Private' && (
                                    <svg
                                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Subtle border glow on hover */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-0 rounded-lg border border-white/20" />
                        </div>
                    </motion.a>
                ))}
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 text-center"
            >
                <p className="text-xs opacity-30 tracking-wider">
                    HOVER TO PAUSE • {repositories.length} REPOSITORIES
                </p>
            </motion.div>
        </div>
    );
}
