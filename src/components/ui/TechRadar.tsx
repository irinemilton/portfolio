'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

interface TechRadarProps {
    skills: {
        category: string;
        items: string[];
    }[];
}

export default function TechRadar({ skills }: TechRadarProps) {
    // Calculate skill proficiency (for visualization)
    const getSkillLevel = (category: string) => {
        const levels: { [key: string]: number } = {
            'Frontend': 90,
            'Backend': 85,
            'AI & Tools': 80,
        };
        return levels[category] || 75;
    };

    return (
        <motion.div
            variants={fadeUp}
            className="w-full"
        >
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight opacity-50 mb-8">
                TECH STACK
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Radar Chart Visualization */}
                <div className="relative aspect-square max-w-md mx-auto">
                    {/* Concentric circles */}
                    {[100, 75, 50, 25].map((size) => (
                        <motion.div
                            key={size}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 0.1 }}
                            transition={{ duration: 0.5, delay: (100 - size) * 0.002 }}
                            viewport={{ once: true }}
                            className="absolute inset-0 m-auto border border-white rounded-full"
                            style={{
                                width: `${size}%`,
                                height: `${size}%`,
                            }}
                        />
                    ))}

                    {/* Skill categories on radar */}
                    {skills.map((skill, index) => {
                        const angle = (index * 360) / skills.length - 90;
                        const level = getSkillLevel(skill.category);
                        const radius = (level / 100) * 50; // 50% is max radius
                        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                        return (
                            <motion.div
                                key={skill.category}
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="absolute"
                                style={{
                                    left: `${x}%`,
                                    top: `${y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div className="relative group">
                                    <div className="w-4 h-4 bg-white rounded-full" />
                                    {/* Label - Always visible on mobile, hover on desktop */}
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap opacity-100 transition-opacity duration-300">
                                        <span className="text-xs font-bold">{skill.category}</span>
                                        <span className="text-xs opacity-50 ml-2">{level}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Center dot */}
                    <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full" />
                </div>

                {/* Skills List */}
                <div className="space-y-8">
                    {skills.map((skillGroup, index) => (
                        <motion.div
                            key={skillGroup.category}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-bold">{skillGroup.category}</h4>
                                <span className="text-sm opacity-50">{getSkillLevel(skillGroup.category)}%</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${getSkillLevel(skillGroup.category)}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                                    viewport={{ once: true }}
                                    className="h-full bg-white"
                                />
                            </div>

                            {/* Skills tags */}
                            <div className="flex flex-wrap gap-2">
                                {skillGroup.items.map((item, itemIndex) => (
                                    <motion.span
                                        key={item}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 + itemIndex * 0.05 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.1 }}
                                        className="text-sm border border-white/20 px-3 py-1 rounded-full hover:border-white/50 transition-colors duration-300 cursor-default"
                                    >
                                        {item}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
