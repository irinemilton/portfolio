'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';
import { useState } from 'react';

interface GitHubStatsProps {
    username: string;
}

export default function GitHubStats({ username }: GitHubStatsProps) {
    const [statsError, setStatsError] = useState(false);
    const [langsError, setLangsError] = useState(false);

    return (
        <motion.div
            variants={fadeUp}
            className="w-full space-y-6"
        >
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight opacity-50">
                    GITHUB ACTIVITY
                </h3>
                <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm border border-white/20 px-4 py-2 rounded-full hover:border-white/50 transition-colors duration-300"
                >
                    View Profile →
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GitHub Stats Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300 min-h-[200px] flex items-center justify-center"
                >
                    {!statsError ? (
                        <img
                            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=transparent&hide_border=true&title_color=ffffff&text_color=ffffff&icon_color=ffffff&bg_color=00000000`}
                            alt="GitHub Stats"
                            className="w-full"
                            onError={() => setStatsError(true)}
                        />
                    ) : (
                        <div className="text-center space-y-3">
                            <p className="text-white/50 text-sm">Stats temporarily unavailable</p>
                            <a
                                href={`https://github.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-white/30 hover:text-white/60 transition-colors"
                            >
                                View on GitHub
                            </a>
                        </div>
                    )}
                </motion.div>

                {/* Top Languages Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300 min-h-[200px] flex items-center justify-center"
                >
                    {!langsError ? (
                        <img
                            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=transparent&hide_border=true&title_color=ffffff&text_color=ffffff&bg_color=00000000`}
                            alt="Top Languages"
                            className="w-full"
                            onError={() => setLangsError(true)}
                        />
                    ) : (
                        <div className="text-center space-y-3">
                            <p className="text-white/50 text-sm">Languages temporarily unavailable</p>
                            <a
                                href={`https://github.com/${username}?tab=repositories`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-white/30 hover:text-white/60 transition-colors"
                            >
                                View Repositories
                            </a>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* GitHub Streak */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300"
            >
                <img
                    src={`https://streak-stats.demolab.com?user=${username}&theme=dark&hide_border=true&background=00000000&stroke=ffffff&ring=ffffff&fire=ffffff&currStreakLabel=ffffff&sideLabels=ffffff&currStreakNum=ffffff&sideNums=ffffff&dates=ffffff`}
                    alt="GitHub Streak"
                    className="w-full"
                />
            </motion.div>

            {/* Contribution Graph */}
            <motion.div
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.2 }}
                className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300 overflow-hidden"
            >
                <img
                    src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=high-contrast&hide_border=true&bg_color=00000000&color=ffffff&line=ffffff&point=ffffff&area=true&area_color=ffffff`}
                    alt="Contribution Graph"
                    className="w-full"
                />
            </motion.div>
        </motion.div>
    );
}
