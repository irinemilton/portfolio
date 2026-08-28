'use client';

import { motion } from 'framer-motion';
import ConversationGlyph from './ConversationGlyph';

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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Open chat"
                className="group relative flex h-14 w-14 items-center justify-center text-white/80 transition-colors duration-300 hover:text-white"
            >
                <ConversationGlyph className="relative z-10 h-8 w-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.14)] transition-transform duration-300 group-hover:scale-110" />
            </motion.button>
        </motion.div>
    );
}
