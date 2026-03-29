'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function Experience() {
    return (
        <section id="experience" className="min-h-screen flex items-center justify-center px-6 py-24 md:py-32 relative">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="max-w-7xl w-full"
            >
                {/* Section Title */}
                <motion.div variants={fadeUp} className="mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-8 tracking-tight uppercase">
                        Experience
                    </h2>
                </motion.div>

                {/* Experience Grid */}
                <div className="grid grid-cols-1 gap-12 md:gap-16">
                    {portfolioData.experience?.map((exp, index) => (
                        <motion.div
                            key={index}
                            variants={fadeUp}
                            className="group relative border-l-2 border-white/10 pl-6 md:pl-10 hover:border-white/50 transition-colors duration-500"
                        >
                            {/* Dot indicator */}
                            <div className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/20 group-hover:bg-white -left-[7px] md:-left-[9px] top-2 transition-colors duration-500" />
                            
                            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-4 mb-4 md:mb-6">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                                        {exp.role}
                                    </h3>
                                    <h4 className="text-lg md:text-xl text-white/60">
                                        {exp.company}
                                    </h4>
                                </div>
                                <div className="text-left md:text-right mt-2 md:mt-0">
                                    <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs md:text-sm mb-2">
                                        {exp.date}
                                    </span>
                                    <p className="text-xs md:text-sm text-white/40">{exp.location}</p>
                                </div>
                            </div>

                            <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-4xl mb-6">
                                {exp.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {exp.skills?.map((skill, i) => (
                                    <span key={i} className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-full border border-white/10 text-white/70">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
