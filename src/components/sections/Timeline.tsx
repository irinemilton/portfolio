'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function Timeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 110,
        damping: 22,
        mass: 0.45,
    });

    const orbY = useTransform(smoothProgress, [0, 1], ['8%', '92%']);
    const orbScale = useTransform(smoothProgress, [0, 0.25, 1], [0.9, 1.1, 1.25]);

    return (
        <section
            id="timeline"
            className="min-h-screen w-full flex flex-col items-center justify-start px-4 py-16 md:px-6 md:py-24 bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="max-w-7xl w-full pt-4 md:pt-8"
            >
                <motion.div variants={fadeUp} className="mb-8 md:mb-14">
                    <p className="mb-3 text-[10px] tracking-[0.38em] uppercase text-white/45 md:text-xs">
                        Evolving story
                    </p>
                    <h2 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
                        JOURNEY
                    </h2>
                </motion.div>

                <div ref={containerRef} className="relative mx-auto max-w-5xl">
                    <motion.div
                        className="absolute left-4 top-4 bottom-4 w-px rounded-full bg-gradient-to-b from-white/0 via-white/30 to-white/0 md:left-1/2 md:top-8 md:bottom-6 md:-translate-x-1/2"
                        style={{ boxShadow: '0 0 18px rgba(255,255,255,0.18)' }}
                    />

                    <motion.div
                        className="absolute left-4 z-20 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)] md:left-1/2 md:h-5 md:w-5"
                        style={{
                            top: orbY,
                            scale: orbScale,
                        }}
                    >
                        <div className="h-2 w-2 rounded-full bg-black md:h-2.5 md:w-2.5" />
                    </motion.div>

                    <div className="space-y-6 md:space-y-12">
                        {portfolioData.timeline.map((item, index) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <motion.article
                                    key={index}
                                    variants={fadeUp}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    initial={{ opacity: 0, y: 28 }}
                                    viewport={{ once: true, amount: 0.35 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    whileHover={{ y: -6, scale: 1.01 }}
                                    className="relative pl-8 md:pl-0 md:grid md:grid-cols-2"
                                >
                                    <div className={isLeft ? 'md:col-start-1 md:pr-10 md:text-right' : 'md:col-start-2 md:pl-10'}>
                                        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.02] p-5 shadow-[0_0_30px_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] md:p-7">
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                            <div className="absolute -left-5 top-6 h-3.5 w-3.5 rounded-full border border-white/30 bg-black md:hidden" />
                                            <div className="absolute left-1/2 top-7 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-white/30 bg-black md:block" />

                                            <div className="mb-4 flex items-center justify-between gap-4 md:gap-6">
                                                <span className="inline-flex rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.28em] text-white/75 md:px-3 md:text-[10px]">
                                                    {item.year}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-[0.26em] text-white/35 md:text-[10px]">
                                                    milestone
                                                </span>
                                            </div>

                                            <h3 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl lg:text-[2.2rem]">
                                                {item.title}
                                            </h3>

                                            <p className="text-sm leading-relaxed text-white/65 md:text-base">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}