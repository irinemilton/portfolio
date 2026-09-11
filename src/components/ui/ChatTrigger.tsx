'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import GhostAvatar from './GhostAvatar';

export default function ChatTrigger({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
    const [isVisible, setIsVisible] = useState(true);
    const hideTimeoutRef = useState<NodeJS.Timeout | null>(null)[1];

    useEffect(() => {
        const handleUserActivity = () => {
            setIsVisible(true);
        };

        // Show on scroll, mouse move, or click
        window.addEventListener('scroll', handleUserActivity);
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('click', handleUserActivity);

        // Hide after 5 seconds of inactivity
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => {
            window.removeEventListener('scroll', handleUserActivity);
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            clearTimeout(hideTimer);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={{
                x: isOpen ? 120 : isVisible ? 0 : 120,
                opacity: isOpen ? 0 : isVisible ? 1 : 0,
                pointerEvents: isOpen || !isVisible ? 'none' : 'auto'
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 md:bottom-8 md:right-8"
        >
            <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: isOpen ? 0 : isVisible ? 1 : 0, x: isOpen ? 18 : 0 }}
                transition={{ duration: 0.35 }}
                className="hidden items-center rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm md:flex"
            >
                Ask me about me
            </motion.div>

            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Open chat"
                className="group relative flex h-16 w-16 items-center justify-center rounded-full"
            >
                <GhostAvatar />
            </motion.button>
        </motion.div>
    );
}
