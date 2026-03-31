'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const loadingTexts = [
    "SYSTEM INITIALIZATION...",
    "COMPILING BUNDLES...",
    "LOADING NEURAL WEIGHTS...",
    "ESTABLISHING CONNECTION...",
    "RENDERING INTERFACE..."
];

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [textIndex, setTextIndex] = useState(0);
    const [isAudioBlocked, setIsAudioBlocked] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('/startup.mpeg');
        audioRef.current.volume = 0.6; // Soft but clear volume

        const playAudio = async () => {
            try {
                if (audioRef.current) {
                    await audioRef.current.play();
                    setIsAudioBlocked(false);
                }
            } catch (error) {
                console.warn('Audio auto-play blocked by browser policy. User interaction required.');
                setIsAudioBlocked(true);
            }
        };

        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        
        // Attempt play
        playAudio();

        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = 'unset';
        }, 2400);

        const textTimer = setInterval(() => {
            setTextIndex(prev => Math.min(prev + 1, loadingTexts.length - 1));
        }, 400);

        return () => {
            clearTimeout(timer);
            clearInterval(textTimer);
            document.body.style.overflow = 'unset';
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleStart = () => {
        if (audioRef.current && isAudioBlocked) {
            audioRef.current.play().catch(() => {});
            setIsAudioBlocked(false);
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
                    onClick={handleStart}
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-center gap-12 relative"
                    >
                        {/* Sleek rotating loader */}
                        <div className="relative w-24 h-24">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 border-[1px] border-white/20 rounded-full"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-3 border-[1px] border-l-white border-transparent rounded-full"
                            />
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                            </motion.div>
                        </div>
                        
                        {/* Cycling Tech Text */}
                        <div className="h-10 w-[300px] md:w-[400px] flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.span 
                                    key={textIndex}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-white/90 tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs font-light text-center"
                                >
                                    {isAudioBlocked ? "TAP TO INITIALIZE AUDIO & ENTER" : loadingTexts[textIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>

                        {isAudioBlocked && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -bottom-24 flex items-center gap-2 text-white/50 text-[8px] tracking-widest uppercase animate-pulse"
                            >
                                <div className="w-4 h-0.5 bg-white/30" />
                                Interactive session required
                                <div className="w-4 h-0.5 bg-white/30" />
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
