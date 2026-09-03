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
    contributions?: Contribution[];
}

interface Contribution {
    date: string;
    count: number;
    level: number;
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
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {stats.topLanguages.map((lang, index) => (
                                <div key={lang.language} className="flex flex-col items-center">
                                    <div className="relative w-16 h-16 mb-2">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            {/* Track */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                className="text-white/10"
                                            />
                                            {/* Progress */}
                                            <motion.circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                className="text-white"
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: parseFloat(lang.percentage) / 100 }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                viewport={{ once: true }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xs font-bold">{lang.percentage}%</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-center opacity-80">{lang.language}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* GitHub Contribution Graph */}
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300 overflow-hidden"
                    >
                        <h4 className="text-lg font-bold mb-4 opacity-70">Contribution Graph</h4>
                        <div className="w-full overflow-x-auto">
                            {stats.contributions?.length ? (
                                <ContributionGrid contributions={stats.contributions} />
                            ) : (
                                <div className="text-center py-8 text-white/30">
                                    Contribution data not available
                                </div>
                            )}
                            </div>
                    </motion.div>\

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

function ContributionGrid({ contributions }: { contributions: Contribution[] }) {
    const weeks = Array.from({ length: Math.ceil(contributions.length / 7) }, (_, week) =>
        contributions.slice(week * 7, week * 7 + 7)
    );

    return (
        <div className="relative min-w-[680px] overflow-hidden rounded-md border border-white/10 bg-black/20 p-4">
            <div className="grid grid-flow-col auto-cols-fr gap-1.5">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-rows-7 gap-1.5">
                        {Array.from({ length: 7 }, (_, dayIndex) => {
                            const contribution = week[dayIndex];
                            const level = contribution?.level ?? 0;
                            return (
                                <span
                                    key={contribution?.date ?? `${weekIndex}-${dayIndex}`}
                                    title={contribution ? `${contribution.count} contributions on ${contribution.date}` : undefined}
                                    className={`aspect-square rounded-[2px] ${
                                        level === 0 ? 'bg-white/5' :
                                        level === 1 ? 'bg-white/20' :
                                        level === 2 ? 'bg-white/40' :
                                        level === 3 ? 'bg-white/65' : 'bg-white'
                                    }`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 h-1 w-20 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-white/50 to-white shadow-[0_0_14px_4px_rgba(255,255,255,0.25)]"
                animate={{ x: ['-120%', '520%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            />
        </div>
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
