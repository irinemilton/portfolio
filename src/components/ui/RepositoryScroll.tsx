'use client';

import { motion } from 'framer-motion';
import { Repository } from '@/lib/data';

interface RepositoryScrollProps {
    repositories: Repository[];
    error?: string | null;
}

export default function RepositoryScroll({ repositories, error }: RepositoryScrollProps) {
    // Show error message if API fetch failed
    if (error) {
        return (
            <div className="w-full overflow-hidden py-12">
                <div className="text-center">
                    <p className="text-lg opacity-50 mb-2">Notice</p>
                    <p className="text-sm opacity-40">{error}</p>
                    <p className="text-xs opacity-30 mt-4">Showing static repository data</p>
                </div>
            </div>
        );
    }

    // Duplicate repositories for seamless infinite scroll
    const duplicatedRepos = [...repositories, ...repositories];

    return (
        <div className="w-full overflow-hidden py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
                className="mb-8"
            >
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight opacity-50">
                    ALL REPOSITORIES
                </h3>
            </motion.div>

            <div className="w-full overflow-hidden">
                <div className="flex w-max gap-6 animate-scroll">
                    {duplicatedRepos.map((repo, index) => (
                    <motion.a
                        key={`${repo.name}-${index}`}
                        href={repo.repo !== 'Private' ? `https://github.com/${repo.repo}` : undefined}
                        target={repo.repo !== 'Private' ? '_blank' : undefined}
                        rel={repo.repo !== 'Private' ? 'noopener noreferrer' : undefined}
                        tabIndex={-1}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.5,
                            delay: (index % repositories.length) * 0.03,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        whileHover={{
                            scale: 1.05,
                            y: -8,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }
                        }}
                        className={`
                            group relative flex h-[22rem] w-80 flex-shrink-0 flex-col overflow-hidden
                            rounded-lg border border-white/10
                            transition-all duration-300
                            hover:border-white/30
                            ${repo.repo === 'Private' ? 'cursor-default' : 'cursor-pointer'}
                        `}
                    >
                        <div className="relative h-28 shrink-0 overflow-hidden border-b border-white/10 bg-white/[0.04]">
                            <img
                                src={getRepositoryImage(repo)}
                                alt=""
                                aria-hidden="true"
                                className="h-full w-full object-cover grayscale opacity-65 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                                onError={(event) => {
                                    event.currentTarget.src = '/file.svg';
                                }}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                        </div>

                        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-between p-6">
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-xl font-bold tracking-tight line-clamp-1">
                                        {repo.name}
                                    </h4>
                                    {repo.repo === 'Private' && (
                                        <span className="text-xs px-2 py-1 border border-white/20 rounded-full opacity-50">
                                            PRIVATE
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm opacity-60 line-clamp-3 leading-relaxed mb-4">
                                    {repo.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs px-3 py-1 border border-white/10 rounded-full opacity-40">
                                    {repo.category}
                                </span>

                                {repo.repo !== 'Private' && (
                                    <svg
                                        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Subtle border glow on hover */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-0 rounded-lg border border-white/20" />
                        </div>
                    </motion.a>
                    ))}
                </div>
            </div>

        </div>
    );
}

function getRepositoryImage(repository: Repository) {
    const projectImages: Record<string, string> = {
        'irinemilton/MentoraX': 'https://raw.githubusercontent.com/irinemilton/MentoraX/main/MentoraX/src/assets/hero.png',
        'irinemilton/Safe-Home': 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=900&q=80',
        'irinemilton/DICE': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80',
        'irinemilton/HexaCoders-Dashboard': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
        'irinemilton/white-matrix-voting': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
        'irinemilton/GigFlow': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
        'irinemilton/ShopSphere-1': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
        'irinemilton/AgriConnect': 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=80',
        'irinemilton/ICU_MONITORING': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
        'irinemilton/Task-Master': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80',
        'irinemilton/StudentManagementSysytem': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
        'irinemilton/Xpry': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
        'irinemilton/portfolio': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
        'irinemilton/Random-String-Generator': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
        'irinemilton/text-translator': 'https://images.unsplash.com/photo-1455390582262-044cdaad277a?auto=format&fit=crop&w=900&q=80',
        'irinemilton/UselessForm.exe': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
        'irinemilton/shopzye': 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
        'Private': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    };

    if (projectImages[repository.repo]) return projectImages[repository.repo];

    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80';
}
