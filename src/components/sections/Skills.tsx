'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function Skills() {
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
                    EXPERTISE
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                    {portfolioData.skills.map((skillGroup, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group"
                        >
                            {/* Category Title */}
                            <h3 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight border-b-2 border-white/20 pb-4 group-hover:border-white/60 transition-colors duration-300">
                                {skillGroup.category.toUpperCase()}
                            </h3>

                            {/* Skills List */}
                            <div className="space-y-4">
                                {skillGroup.items.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skillIndex}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: skillIndex * 0.1 }}
                                        className="text-lg md:text-xl opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default pl-4 border-l-2 border-transparent hover:border-white/40"
                                    >
                                        {skill}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
