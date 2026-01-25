'use client';

import Link from 'next/link';

export default function FixedLogo() {
    return (
        <Link
            href="/"
            className="fixed top-6 left-6 z-[999] text-white mix-blend-difference font-bold text-xl md:text-2xl tracking-tight hover:opacity-80 transition-opacity"
        >
            IRINE MILTON
        </Link>
    );
}
