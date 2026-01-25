'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function Cursor() {
    const [isMobile, setIsMobile] = useState(true); // Default to true to prevent flash
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for smooth trailing
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Only run on desktop
        const checkMobile = () => {
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            setIsMobile(isTouch || window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    if (isMobile) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
        >
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
    );
}
