'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { portfolioData } from '@/lib/data';

export default function DynamicLogo() {
    const { scrollY } = useScroll();
    const [isMobile, setIsMobile] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);

    const smoothScrollY = useSpring(scrollY, {
        stiffness: 300,
        damping: 30,
        mass: 1,
        restDelta: 0.001
    });

    const scale = useTransform(smoothScrollY, [0, 400], [1, 0.25]);
    const top = useTransform(smoothScrollY, [0, 400], ['42%', '0%']);
    const left = useTransform(smoothScrollY, [0, 400], ['50%', '0%']);
    const x = useTransform(smoothScrollY, [0, 400], ['-50%', '0%']);
    const y = useTransform(smoothScrollY, [0, 400], ['0%', '0%']);

    useEffect(() => {
        const checkViewport = () => {
            setIsMobile(window.innerWidth < 768);
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        checkViewport();
        window.addEventListener('resize', checkViewport);
        window.addEventListener('orientationchange', checkViewport);

        return () => {
            window.removeEventListener('resize', checkViewport);
            window.removeEventListener('orientationchange', checkViewport);
        };
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                pointerEvents: 'none',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <motion.div
                style={{
                    position: 'absolute',
                    top,
                    left,
                    x,
                    y,
                    scale,
                    transformOrigin: 'top left',
                    width: 'fit-content',
                    height: 'fit-content',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    pointerEvents: 'none',
                }}
                className="pointer-events-none"
            >
                <Link
                    href="/"
                    className="pointer-events-auto flex gap-4 font-bold tracking-tighter text-white whitespace-nowrap"
                    style={{
                        margin: 0,
                        padding: 0,
                        fontSize: isPortrait
                            ? isMobile ? '14vw' : '12vw'
                            : isMobile ? '10vw' : '11vw',
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
        </div>
    );
}
