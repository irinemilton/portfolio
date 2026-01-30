'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (newTheme: 'dark' | 'light') => {
        const root = document.documentElement;

        if (newTheme === 'light') {
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-color', '#000000');
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#000000';
        } else {
            root.style.setProperty('--bg-color', '#000000');
            root.style.setProperty('--text-color', '#ffffff');
            document.body.style.backgroundColor = '#000000';
            document.body.style.color = '#ffffff';
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed top-8 right-8 z-50 w-12 h-12 rounded-full border border-white/20 hover:border-white/50 transition-all duration-300 flex items-center justify-center group"
            aria-label="Toggle theme"
        >
            {/* Sun/Moon icon */}
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.5 }}
                className="relative w-6 h-6"
            >
                {theme === 'dark' ? (
                    // Moon icon
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                ) : (
                    // Sun icon
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                )}
            </motion.div>

            {/* Tooltip */}
            <div className="absolute -bottom-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-xs whitespace-nowrap px-2 py-1 border border-white/20 rounded bg-black">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
            </div>
        </motion.button>
    );
}
