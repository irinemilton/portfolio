'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';
import { useState, useEffect } from 'react';

interface GitHubStatsProps {
    username: string;
}

interface GitHubStatsData {
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    totalForks: number;
    topLanguages: {
        language: string;
        count: number;
        percentage: string;
    }[];
}

export default function GitHubStats({ username }: GitHubStatsProps) {
    const [stats, setStats] = useState<GitHubStatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log('[GitHub Stats] Starting fetch...');
                const response = await fetch('/api/github-stats');
                console.log('[GitHub Stats] Response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('[GitHub Stats] Error response:', errorText);
                    throw new Error('Failed to fetch stats');
                }

                const data = await response.json();
                console.log('[GitHub Stats] Received data:', data);
                setStats(data);
            } catch (err) {
                console.error('[GitHub Stats] Error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-white/50">Loading GitHub stats...</p>
                </div>
            ) : error || !stats ? (
                <div className="text-center py-12 space-y-4">
                    <p className="text-white/50">Unable to load GitHub stats</p>
                    <a
                        href={`https://github.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm border border-white/20 px-4 py-2 rounded-full hover:border-white/50 transition-colors"
                    >
                        View on GitHub →
                    </a>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <StatCard label="Repositories" value={stats.publicRepos} />
                        <StatCard label="Followers" value={stats.followers} />
                        <StatCard label="Following" value={stats.following} />
                        <StatCard label="Stars" value={stats.totalStars} />
                        <StatCard label="Forks" value={stats.totalForks} />
                    </div>

                    {/* Top Languages */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300"
                    >
                        <h4 className="text-lg font-bold mb-4 opacity-70">Top Languages</h4>
                        <div className="space-y-3">
                            {stats.topLanguages.map((lang, index) => (
                                <div key={lang.language}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm">{lang.language}</span>
                                        <span className="text-sm opacity-50">{lang.percentage}%</span>
                                    </div>
                                    {/* Segmented Progress Bar */}
                                    <div className="flex gap-1 w-full h-2">
                                        {Array.from({ length: 10 }).map((_, i) => {
                                            const isFilled = i < Math.round(parseFloat(lang.percentage) / 10);
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{
                                                        opacity: 1
                                                    }}
                                                    transition={{ duration: 0.2, delay: index * 0.1 + (i * 0.05) }}
                                                    viewport={{ once: true }}
                                                    className={`flex-1 rounded-sm ${isFilled ? 'bg-white' : 'bg-white/10'}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

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
                            loading="lazy"
                        />
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
            className="border border-white/10 rounded-lg p-4 hover:border-white/30 transition-all duration-300 text-center"
        >
            <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold mb-1"
            >
                {value}
            </motion.p>
            <p className="text-xs opacity-50 uppercase tracking-wider">{label}</p>
        </motion.div>
    );
}
