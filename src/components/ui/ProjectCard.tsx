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
            className="group relative w-full rounded-xl p-8 md:p-12 transition-colors duration-300"
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
                className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10"
            >
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h3>
                        <span className="text-sm opacity-50 px-3 py-1 border border-white/20 rounded-full">{project.year}</span>
                    </div>
                    <p className="text-base md:text-lg opacity-70 mb-8 max-w-2xl leading-relaxed">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {project.tech.map((t: string) => (
                            <span key={t} className="text-sm border border-white/10 px-3 py-1 rounded-md">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="text-6xl font-bold opacity-10 group-hover:scale-110 transition-transform duration-500">
                    {String(index + 1).padStart(2, '0')}
                </div>
            </div>
        </motion.div>
    );
}
