'use client';

import { motion } from 'framer-motion';

export default function ChatTrigger({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
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
                onClick={onClick}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/65 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
                <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.45)]" />
                <svg
                    className="relative z-10 h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7 18.5L4 20v-3.5A7.5 7.5 0 1 1 7 18.5Z"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path d="M9 10h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    <path d="M9 13h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
            </motion.button>
        </motion.div>
    );
}
