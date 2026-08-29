'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ChatTrigger({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{
                y: 0,
                ...(isOpen
                    ? { scale: 0, opacity: 0, pointerEvents: 'none' as const }
                    : { scale: 1, opacity: 1, pointerEvents: 'auto' as const })
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 md:bottom-8 md:right-8"
        >
            <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? 18 : 0 }}
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
                className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <Image
                    src="/mascout1.png"
                    alt="Irine profile"
                    width={120}
                    height={120}
                    priority
                    className="relative z-10 h-full w-full object-cover scale-[1.08] transition-transform duration-300 group-hover:scale-[1.15]"
                />
            </motion.button>
        </motion.div>
    );
}
