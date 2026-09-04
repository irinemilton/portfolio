'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';
import ScrollWords from '../ui/ScrollWords';

export default function About() {
    return (
        <section id="about" className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 md:py-48 relative z-10 bg-black/40 backdrop-blur-sm">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-7xl w-full space-y-20 md:space-y-28"
            >
                {/* Section Title */}
                <motion.div
                    variants={fadeUp}
                    className="space-y-8 md:space-y-10"
                >
                    <ScrollWords />
                    <p className="about-description text-lg md:text-xl opacity-60 max-w-3xl leading-loose tracking-wide">
                        {portfolioData.about.description}
                    </p>
                </motion.div>

                {/* Core Values Grid */}
                <motion.div
                    variants={fadeUp}
                    className="about-highlights grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16"
                >
                    {portfolioData.about.highlights.map((highlight, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="about-highlight border-l-2 border-white/20 pl-6 py-4 hover:border-white/60 transition-all duration-300">
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                                    {highlight.toUpperCase()}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
