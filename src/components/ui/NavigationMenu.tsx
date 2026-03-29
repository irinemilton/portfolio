'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Contact', href: '#contact' },
];

export default function NavigationMenu() {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Also add a little padding to prevent layout shift if there's a scrollbar
            document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [isOpen]);

    const handleNavigate = (href: string) => {
        setIsOpen(false);
        const element = document.querySelector(href);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth' });
            }, 300); // slight delay to allow menu animation to close
        }
    };

    return (
        <>
            {/* Hamburger Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed top-8 right-8 z-50 w-12 h-12 rounded-full border border-white/20 hover:border-white/50 bg-black/50 backdrop-blur-md transition-all duration-300 flex items-center justify-center group"
                aria-label="Open Navigation"
            >
                <div className="flex flex-col gap-1.5 w-5">
                    <span className="block w-full h-0.5 bg-white transition-transform group-hover:scale-x-110" />
                    <span className="block w-full h-0.5 bg-white transition-transform group-hover:scale-x-110" />
                </div>
            </motion.button>

            {/* Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
                    >
                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            onClick={() => setIsOpen(false)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/20 hover:border-white/50 bg-black/50 backdrop-blur-md flex items-center justify-center transition-colors group z-50"
                            aria-label="Close Navigation"
                        >
                            <svg className="w-5 h-5 text-white transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>

                        {/* Navigation Links */}
                        <div className="flex flex-col items-center justify-center gap-6 md:gap-10 h-full w-full">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    transition={{ delay: index * 0.05 + 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                >
                                    <button
                                        onClick={() => handleNavigate(item.href)}
                                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter hover:text-white/50 transition-colors uppercase relative group"
                                    >
                                        <span className="relative z-10">{item.label}</span>
                                        {/* Hover line effect */}
                                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-white transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
