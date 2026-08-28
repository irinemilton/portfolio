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
                className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-none border border-white/15 bg-black/65 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
                <span className="absolute inset-x-3 top-3 h-px bg-white/20 transition-opacity duration-300 group-hover:bg-white/35" />
                <span className="absolute inset-x-3 bottom-3 h-px bg-white/10" />
                <span className="relative z-10 text-[11px] font-semibold tracking-[0.35em]">
                    AI
                </span>
            </motion.button>
        </motion.div>
    );
}
