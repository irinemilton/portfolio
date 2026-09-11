'use client';

import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

const COLS = 4;
const ROWS = 4;

function seeded(seed: number, salt: number): number {
    const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
}

interface Piece {
    top: string;
    left: string;
    width: string;
    height: string;
    backgroundPosition: string;
}

const PIECES: Piece[] = [];

for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
        PIECES.push({
            top: `${(row / ROWS) * 100}%`,
            left: `${(col / COLS) * 100}%`,
            width: `${100 / COLS}%`,
            height: `${100 / ROWS}%`,
            backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
        });
    }
}

const pieceVariants: Variants = {
    gather: {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        transition: { duration: 0.45, ease: 'easeOut' },
    },
    scatter: (index: number) => ({
        opacity: 0,
        x: (seeded(index, 1) - 0.5) * 2 * 160,
        y: (seeded(index, 2) - 0.5) * 2 * 140,
        rotate: (seeded(index, 3) - 0.5) * 2 * 80,
        transition: {
            duration: 0.7,
            delay: seeded(index, 4) * 0.18,
            ease: [0.32, 0.72, 0, 1],
        },
    }),
};

export default function NavLogo() {
    const [scattered, setScattered] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScattered(window.scrollY > 60);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="fixed top-8 left-8 z-50 w-12 h-12" aria-label="Logo">
            <motion.div
                className="relative w-full h-full"
                variants={pieceVariants}
                initial="gather"
                animate={scattered ? 'scatter' : 'gather'}
            >
                {PIECES.map((piece, index) => (
                    <motion.div
                        key={index}
                        variants={pieceVariants}
                        custom={index}
                        style={{
                            position: 'absolute',
                            top: piece.top,
                            left: piece.left,
                            width: piece.width,
                            height: piece.height,
                            backgroundImage: 'url(/logoim.png)',
                            backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                            backgroundPosition: piece.backgroundPosition,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}