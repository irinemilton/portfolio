'use client';

import { useEffect, useRef } from 'react';

export default function GhostAvatar() {
    const eyesRef = useRef<SVGGElement>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!eyesRef.current) return;

            const nx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
            const ny = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));

            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
                eyesRef.current?.setAttribute('transform', `translate(${(nx * 26).toFixed(2)}, ${(ny * 26).toFixed(2)})`);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return (
        <div className="relative z-10 flex h-full w-full items-center justify-center animate-ghost-float transition-transform duration-300 group-hover:scale-[1.1]">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
            <svg
                width="80"
                height="80"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="relative h-full w-full p-2 drop-shadow-[0_0_22px_rgba(255,255,255,0.5)]"
            >
                {/* Ghost body */}
                <path
                    d="m508.374 432.802s-46.6-39.038-79.495-275.781c-8.833-87.68-82.856-156.139-172.879-156.139-90.015 0-164.046 68.458-172.879 156.138-32.895 236.743-79.495 275.782-79.495 275.782-15.107 25.181 20.733 28.178 38.699 27.94 35.254-.478 35.254 40.294 70.516 40.294 35.254 0 35.254-35.261 70.508-35.261s37.396 45.343 72.65 45.343 37.389-45.343 72.651-45.343c35.254 0 35.254 35.261 70.508 35.261s35.27-40.772 70.524-40.294c17.959.238 53.798-2.76 38.692-27.94z"
                    fill="white"
                    opacity="0.9"
                />

                <g ref={eyesRef}>
                    {/* Left eye */}
                    <circle cx="208" cy="225" r="22" fill="black" />

                    {/* Right eye */}
                    <circle cx="297" cy="225" r="22" fill="black" />
                </g>
            </svg>

            <style jsx global>{`
                @keyframes ghostFloat {
                    0%,
                    100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-8px);
                    }
                }

                .animate-ghost-float {
                    animation: ghostFloat 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}