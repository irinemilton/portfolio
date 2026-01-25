'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';
import ProjectCard from '../ui/ProjectCard';

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

                <div className="grid gap-12 perspective-1000">
                    {portfolioData.projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
