'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData, Repository } from '@/lib/data';
import ProjectFilter from '../ui/ProjectFilter';
import RepositoryScroll from '../ui/RepositoryScroll';
import { useEffect, useState } from 'react';

export default function Projects() {
    const [repositories, setRepositories] = useState<Repository[]>(
        portfolioData.repositories
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                console.log('[Frontend] Fetching repositories from API...');

                const response = await fetch('/api/github-repos');

                console.log(
                    '[Frontend] API response status:',
                    response.status
                );

                if (!response.ok) {
                    let errorDetails = 'Failed to fetch repositories';

                    try {
                        const errorData = await response.json();

                        errorDetails =
                            errorData.details ||
                            errorData.error ||
                            errorDetails;

                        console.error(
                            '[Frontend] API Error Object:',
                            errorData
                        );
                    } catch {
                        const errorText = await response
                            .text()
                            .catch(() => 'Unknown Error Body');

                        console.error(
                            '[Frontend] Could not parse error JSON. Raw body:',
                            errorText
                        );

                        errorDetails = `API Error ${response.status}: ${errorText.substring(
                            0,
                            50
                        )}`;
                    }

                    throw new Error(errorDetails);
                }

                const data = await response.json();

                console.log(
                    '[Frontend] Received data:',
                    data.length,
                    'repositories'
                );

                if (data && data.length > 0) {
                    setRepositories(data);

                    console.log(
                        '[Frontend] Successfully updated repositories'
                    );
                } else {
                    console.warn(
                        '[Frontend] No repositories returned from API'
                    );
                }
            } catch (err) {
                console.error(
                    '[Frontend] Error fetching GitHub repos:',
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : 'Using static repository data'
                );

                // Keep using static data as fallback
            }
        };

        fetchRepos();
    }, []);

    return (
        <section
            id="projects"
            className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center bg-black/40 px-6 py-20 backdrop-blur-sm md:py-28"
        >
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="w-full max-w-7xl space-y-6 md:space-y-10"
            >
                {/* Section Title */}
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
                >
                    SELECTED WORK
                </motion.h2>

                {/* Project Filter */}
                <ProjectFilter projects={portfolioData.projects} />

                {/* Repository Showcase */}
                <RepositoryScroll
                    repositories={repositories}
                    error={error}
                />
            </motion.div>
        </section>
    );
}