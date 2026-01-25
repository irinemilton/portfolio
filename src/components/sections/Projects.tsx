'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';

export default function Projects() {
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
                    SELECTED WORK
                </motion.h2>

                <div className="space-y-12">
                    {portfolioData.projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group border-t border-white/20 pt-8 hover:border-white/60 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                {/* Project Info */}
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-4 mb-4">
                                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight group-hover:opacity-100 opacity-90 transition-opacity">
                                            {project.title}
                                        </h3>
                                        <span className="text-sm md:text-base opacity-40">{project.year}</span>
                                    </div>

                                    <p className="text-base md:text-lg opacity-60 mb-6 leading-relaxed max-w-2xl">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-3">
                                        {project.tech.map((tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="text-sm md:text-base px-4 py-2 border border-white/20 opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Project Number */}
                                <div className="text-6xl md:text-7xl font-bold opacity-10 group-hover:opacity-20 transition-opacity">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
