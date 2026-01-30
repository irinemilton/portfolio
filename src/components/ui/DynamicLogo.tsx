'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { portfolioData } from '@/lib/data';

export default function DynamicLogo() {
    const { scrollY } = useScroll();
    const [isMobile, setIsMobile] = useState(false);

    // Add smoothing to the scroll value
    // Snappier spring physics to reduce "lag" feeling
    const smoothScrollY = useSpring(scrollY, {
        stiffness: 300,
        damping: 30,
        mass: 1,
        restDelta: 0.001
    });

    // Dynamic transforms based on smooth scroll position
    const scale = useTransform(smoothScrollY, [0, 400], [1, 0.25]);
    const top = useTransform(smoothScrollY, [0, 400], ['20%', '1.5rem']);
    const left = useTransform(smoothScrollY, [0, 400], ['50%', '1.5rem']);
    const x = useTransform(smoothScrollY, [0, 400], ['-50%', '0%']);
    const y = useTransform(smoothScrollY, [0, 400], ['-50%', '0%']);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <motion.div
            style={{
                position: 'fixed',
                top,
                left,
                x,
                y,
                scale,
                zIndex: 999,
                transformOrigin: 'top left',
                width: 'fit-content', // Critical for centering
                height: 'fit-content', // Critical for centering
            }}
            className="pointer-events-none"
        >
            <Link
                href="/"
                className="pointer-events-auto flex gap-4 font-bold tracking-tighter text-white whitespace-nowrap"
                style={{
                    fontSize: isMobile ? '15vw' : '13vw',
                    lineHeight: 1,
                }}
            >
                {portfolioData.name.split(' ').map((word, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                        {word}
                    </motion.span>
                ))}
            </Link>
        </motion.div>
    );
}
