'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { Project } from "@/lib/data"; // You might need to export Project interface from data.ts or define it here

// Temporary interface if not exported
interface ProjectProps {
    project: Project;
    index: number;
}

const ROTATION_RANGE = 20.5; // Degree of tilt
const HALF_ROTATION_RANGE = 20.5 / 2;

export default function ProjectCard({ project, index }: ProjectProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position relative to the card
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics for the tilt
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    // Map mouse position to rotation
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-[0_0_24px_rgba(255,255,255,0.03)] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] md:p-12"
        >
            {/* Spotlight Gradient */}
            <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)"
                }}
            />

            <div
                style={{ transform: "translateZ(50px)" }}
                className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-start md:gap-8"
            >
                <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <h3 className="text-2xl font-bold tracking-tight text-white md:text-4xl">{project.title}</h3>
                        <span className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60 md:px-3 md:text-xs">{project.year}</span>
                    </div>
                    <p className="mb-5 max-w-2xl text-sm leading-relaxed text-white/75 md:mb-8 md:text-lg">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((t: string) => (
                            <span key={t} className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] text-white/80 md:px-3 md:text-sm">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="text-5xl font-bold opacity-10 transition-transform duration-500 group-hover:scale-110 md:text-6xl">
                    {String(index + 1).padStart(2, '0')}
                </div>
            </div>
        </motion.div>
    );
}
