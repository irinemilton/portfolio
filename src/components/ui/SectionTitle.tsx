'use client';

import { motion, Variants } from 'framer-motion';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

export default function SectionTitle({ title, subtitle }: SectionTitleProps) {
    // Split title into characters for staggered reveal
    const characters = Array.from(title);

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(8px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <div className="mb-12 md:mb-16">
            <motion.h2
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter overflow-hidden flex flex-wrap"
            >
                {characters.map((char, index) => (
                    <motion.span variants={child} key={index} className="mr-[0.05em] last:mr-0 inline-block">
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.h2>

            {title === "Journey" && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[1px] bg-gradient-to-l from-white/20 to-transparent hidden md:block" />
            )}

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-4 text-sm md:text-base opacity-50 tracking-wide max-w-lg"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
