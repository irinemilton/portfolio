'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ChatTrigger({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
    const controls = useAnimation();
    const [position, setPosition] = useState<'left' | 'right'>('right');

    const togglePosition = async () => {
        const nextPos = position === 'right' ? 'left' : 'right';
        const xValue = nextPos === 'left' ? '-75vw' : '0'; // Move across most of the screen
        
        await controls.start({
            x: xValue,
            transition: { duration: 2, ease: "easeInOut" }
        });
        
        setPosition(nextPos);
    };

    useEffect(() => {
        if (isOpen) return; // Don't move if chat is already open

        const interval = setInterval(() => {
            togglePosition();
        }, 15000); // Move every 15 seconds

        return () => clearInterval(interval);
    }, [position, isOpen]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ 
                y: 0,
                ...(isOpen 
                    ? { scale: 0, opacity: 0, pointerEvents: 'none' as const } 
                    : { scale: 1, opacity: 1, pointerEvents: 'auto' as const }
                )
            }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-8 right-8 z-[9999]"
        >
            <motion.button
                animate={controls}
                onClick={onClick}
                className="relative group w-16 h-16 rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-transform border border-white"
            >
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="relative z-10"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 13.591 2.363 15.097 3.007 16.437L2 22L7.563 20.993C8.903 21.637 10.409 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" />
                        <circle cx="8" cy="12" r="1.5" fill="white" />
                        <circle cx="12" cy="12" r="1.5" fill="white" />
                        <circle cx="16" cy="12" r="1.5" fill="white" />
                    </svg>
                </motion.div>

                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-20" />
            </motion.button>
        </motion.div>
    );
}
