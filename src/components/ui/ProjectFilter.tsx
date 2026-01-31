'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Project } from '@/lib/data';
import ProjectCard from './ProjectCard';

interface ProjectFilterProps {
    projects: Project[];
}

export default function ProjectFilter({ projects }: ProjectFilterProps) {
    const [selectedTech, setSelectedTech] = useState<string>('All');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Extract all unique technologies
    const allTechs = ['All', ...new Set(projects.flatMap(p => p.tech))];

    // Filter projects based on selected technology
    const filteredProjects = selectedTech === 'All'
        ? projects
        : projects.filter(p => p.tech.includes(selectedTech));

    // Prevent hydration errors
    if (!isMounted) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Filter buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap gap-3 mb-12 justify-center"
            >
                {allTechs.map((tech, index) => (
                    <motion.button
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTech(tech)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium
                            transition-all duration-300
                            ${selectedTech === tech
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-white border border-white/20 hover:border-white/50'
                            }
                        `}
                    >
                        {tech}
                    </motion.button>
                ))}
            </motion.div>

            {/* Project count indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
            >
                <p className="text-sm opacity-50">
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'PROJECT' : 'PROJECTS'}
                    {selectedTech !== 'All' && ` • FILTERED BY ${selectedTech.toUpperCase()}`}
                </p>
            </motion.div>

            {/* Filtered projects */}
            <motion.div
                layout
                className="grid gap-12 perspective-1000"
            >
                {filteredProjects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <ProjectCard project={project} index={index} />
                    </motion.div>
                ))}
            </motion.div>

            {/* No results message */}
            {filteredProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <p className="text-2xl opacity-30">No projects found with {selectedTech}</p>
                </motion.div>
            )}
        </div>
    );
}
