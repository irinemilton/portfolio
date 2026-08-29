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

    // Extract all unique technologies
    const allTechs = ['All', ...new Set(projects.flatMap(p => p.tech))];

    // Filter projects based on selected technology
    const filteredProjects = selectedTech === 'All'
        ? projects
        : projects.filter(p => p.tech.includes(selectedTech));

    return (
        <div className="w-full">
            {/* Filter buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex flex-wrap justify-center gap-2 md:mb-8 md:gap-3"
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
                            rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 md:px-4 md:py-2 md:text-sm
                            ${selectedTech === tech
                                ? 'border border-white bg-white text-black'
                                : 'border border-white/20 bg-transparent text-white hover:border-white/50'
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
                className="mb-5 text-center md:mb-8"
            >
                <p className="text-xs opacity-50 md:text-sm">
                    {filteredProjects.length} {filteredProjects.length === 1 ? 'PROJECT' : 'PROJECTS'}
                    {selectedTech !== 'All' && ` • FILTERED BY ${selectedTech.toUpperCase()}`}
                </p>
            </motion.div>

            {/* Filtered projects */}
            <motion.div
                layout
                className="grid gap-4 perspective-1000 md:gap-8"
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
