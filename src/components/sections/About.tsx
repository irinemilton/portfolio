'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function About() {
    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-7xl w-full"
            >
                {/* Section Title */}
                <motion.div
                    variants={fadeUp}
                    className="mb-20"
                >
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
                        DRIVEN BY
                    </h2>
                    <p className="text-lg md:text-xl opacity-60 max-w-3xl leading-relaxed">
                        {portfolioData.about.description}
                    </p>
                </motion.div>

                {/* Core Values Grid */}
                <motion.div
                    variants={fadeUp}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
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
                            <div className="border-l-2 border-white/20 pl-6 py-4 hover:border-white/60 transition-all duration-300">
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
