'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '@/lib/animations';
import { portfolioData } from '@/lib/data';
import TechRadar from '../ui/TechRadar';
import GitHubStats from '../ui/GitHubStats';

export default function Skills() {
    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-7xl w-full space-y-32"
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                >
                    EXPERTISE
                </motion.h2>

                {/* Tech Radar Visualization */}
                <TechRadar skills={portfolioData.skills} />

                {/* GitHub Stats */}
                <GitHubStats username="irinemilton" />
            </motion.div>
        </section>
    );
}
