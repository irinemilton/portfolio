'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function Contact() {
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
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-16 tracking-tight"
                >
                    LET'S CONNECT
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    className="text-lg md:text-xl lg:text-2xl opacity-60 mb-20 leading-relaxed max-w-3xl"
                >
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </motion.p>

                {/* Contact Links */}
                <motion.div
                    variants={fadeUp}
                    className="space-y-6 mb-32"
                >
                    <motion.a
                        href={`mailto:${portfolioData.contact.email}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="group flex items-baseline gap-4 border-b border-white/20 pb-4 hover:border-white/60 transition-all duration-300"
                    >
                        <span className="text-sm md:text-base opacity-40 min-w-[100px]">EMAIL</span>
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight group-hover:opacity-100 opacity-80 transition-opacity">
                            {portfolioData.contact.email}
                        </span>
                    </motion.a>

                    <motion.a
                        href={portfolioData.contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group flex items-baseline gap-4 border-b border-white/20 pb-4 hover:border-white/60 transition-all duration-300"
                    >
                        <span className="text-sm md:text-base opacity-40 min-w-[100px]">GITHUB</span>
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight group-hover:opacity-100 opacity-80 transition-opacity">
                            View Profile →
                        </span>
                    </motion.a>

                    <motion.a
                        href={portfolioData.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group flex items-baseline gap-4 border-b border-white/20 pb-4 hover:border-white/60 transition-all duration-300"
                    >
                        <span className="text-sm md:text-base opacity-40 min-w-[100px]">LINKEDIN</span>
                        <span className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight group-hover:opacity-100 opacity-80 transition-opacity">
                            Connect →
                        </span>
                    </motion.a>
                </motion.div>

                {/* Footer */}
                <motion.div
                    variants={fadeUp}
                    className="border-t border-white/10 pt-8"
                >
                    <p className="text-sm md:text-base opacity-30">
                        © 2024 {portfolioData.name}. Built with Next.js & Framer Motion.
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
}
