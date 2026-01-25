'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function Timeline() {
    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-7xl w-full"
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-20 tracking-tight"
                >
                    JOURNEY
                </motion.h2>

                <div className="space-y-16">
                    {portfolioData.timeline.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="flex flex-col md:flex-row gap-8 md:gap-16 items-start group"
                        >
                            {/* Year */}
                            <div className="text-5xl md:text-6xl lg:text-7xl font-bold opacity-30 group-hover:opacity-50 transition-opacity min-w-[120px] md:min-w-[180px]">
                                {item.year}
                            </div>

                            {/* Content */}
                            <div className="flex-1 border-l-2 border-white/20 pl-8 md:pl-12 group-hover:border-white/40 transition-colors">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-base md:text-lg opacity-60 leading-loose tracking-wide max-w-2xl">
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
