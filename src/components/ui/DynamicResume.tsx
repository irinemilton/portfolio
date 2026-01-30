'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { portfolioData } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function DynamicResume() {
    const { scrollY } = useScroll();
    const [isMobile, setIsMobile] = useState(false);

    // Spring physics matching DynamicLogo for consistency
    const smoothScrollY = useSpring(scrollY, {
        stiffness: 300,
        damping: 30,
        mass: 1,
        restDelta: 0.001
    });

    // Transform Logic
    // Start: Centered horizontally (right: 50%, x: 50%) and lower vertically (top: 75vh)
    // End: Fixed Top-Right (right: 1.5rem, x: 0%, top: 1.5rem)

    // NOTE: Using 'vh' for start `top` ensures it sits nicely in the Hero section initially
    const top = useTransform(smoothScrollY, [0, 400], ['75vh', '1.5rem']);
    const right = useTransform(smoothScrollY, [0, 400], ['50%', '1.5rem']);
    const x = useTransform(smoothScrollY, [0, 400], ['50%', '0%']);
    const scale = useTransform(smoothScrollY, [0, 400], [1, 0.85]);

    // Optional: Fade out text on scroll to make it a compact icon? 
    // For now, keeping full button but scaling down slightly.

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
                right,
                x,
                scale,
                zIndex: 999,
                transformOrigin: 'top right',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }} // Fade in after Hero text
        >
            <a
                href={portfolioData.contact.resume}
                download="Irine_Milton_Resume.pdf"
                className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300"
            >
                <span className="uppercase tracking-widest text-xs md:text-sm">Download Resume</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </a>
        </motion.div>
    );
}
