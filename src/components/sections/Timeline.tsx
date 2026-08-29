'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function Timeline() {
    return (
        <section
            id="timeline"
            className="min-h-screen w-full flex flex-col items-center justify-start px-6 py-16 md:py-24 bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-7xl w-full pt-4 md:pt-8"
            >
                {/* Section Title */}
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-16 md:mb-20 tracking-tight"
                >
                    JOURNEY
                </motion.h2>

                {/* Timeline */}
                <div className="space-y-12 md:space-y-16">
                    {portfolioData.timeline.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                            }}
                            className="flex flex-col md:flex-row gap-6 md:gap-12 items-start group"
                        >
                            {/* Year */}
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold opacity-30 group-hover:opacity-50 transition-opacity min-w-[120px] md:min-w-[160px]">
                                {item.year}
                            </div>

                            {/* Content */}
                            <div className="flex-1 border-l-2 border-white/20 pl-8 md:pl-12 group-hover:border-white/40 transition-colors">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 tracking-tight">
                                    {item.title}
                                </h3>

                                <p className="text-base md:text-lg opacity-60 leading-relaxed tracking-wide max-w-2xl">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}