'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import CareerTree from '../ui/CareerTree';

export default function Experience() {
    return (
        <section id="experience" className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-32 md:py-48 relative z-10 bg-black/40 backdrop-blur-sm">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="max-w-7xl w-full space-y-16 md:space-y-24"
            >
                {/* Section Title */}
                <motion.div variants={fadeUp}>
                    <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight uppercase">
                        Experience
                    </h2>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <CareerTree />
                </motion.div>
            </motion.div>
        </section>
    );
}
