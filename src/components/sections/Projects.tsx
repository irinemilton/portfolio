'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData, Repository } from '@/lib/data';
import ProjectFilter from '../ui/ProjectFilter';
import RepositoryScroll from '../ui/RepositoryScroll';
import { useEffect, useState } from 'react';

export default function Projects() {
    const [repositories, setRepositories] = useState<Repository[]>(portfolioData.repositories);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const fetchRepos = async () => {
            try {
                console.log('[Frontend] Fetching repositories from API...');
                const response = await fetch('/api/github-repos');
                console.log('[Frontend] API response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ details: 'Failed to parse error' }));
                    console.error('[Frontend] API error:', errorData);
                    throw new Error(errorData.details || 'Failed to fetch repositories');
                }

                const data = await response.json();
                console.log('[Frontend] Received data:', data.length, 'repositories');

                if (data && data.length > 0) {
                    setRepositories(data);
                    console.log('[Frontend] Successfully updated repositories');
                } else {
                    console.warn('[Frontend] No repositories returned from API');
                }
            } catch (err) {
                console.error('[Frontend] Error fetching GitHub repos:', err);
                setError(err instanceof Error ? err.message : 'Using static repository data');
                // Keep using static data as fallback
            }
        };

        fetchRepos();
    }, []);

    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-20">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-7xl w-full"
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-20 tracking-tight"
                >
                    SELECTED WORK
                </motion.h2>

                {/* Project Filter */}
                <ProjectFilter projects={portfolioData.projects} />

                {/* Repository Showcase */}
                <div className="mt-32">
                    {error && (
                        <div className="mb-4 text-center">
                            <p className="text-sm opacity-40">{error}</p>
                        </div>
                    )}
                    <RepositoryScroll repositories={repositories} />
                </div>
            </motion.div>
        </section>
    );
}

