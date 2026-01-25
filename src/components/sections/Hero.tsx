'use client';

import { motion } from 'framer-motion';
import { portfolioData } from '@/lib/data';

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-center max-w-6xl w-full"
            >
                {/* Main Name - Massive Typography spacer to push content down below centered logo */}
                <div className="h-[20vh] md:h-[30vh]" />

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-24 md:mt-32 text-base sm:text-lg md:text-xl lg:text-2xl opacity-80 tracking-widest uppercase font-medium"
                >
                    {portfolioData.title}
                </motion.p>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-20 text-center text-sm md:text-base opacity-40 max-w-3xl mx-auto tracking-wider leading-loose"
                >
                    {portfolioData.tagline}
                </motion.p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
                >
                    <div className="w-1 h-2 bg-white/50 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}
