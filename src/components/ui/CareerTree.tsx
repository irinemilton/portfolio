'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { portfolioData } from '@/lib/data';

const branchPositions = [
    { x: 12, y: 68, anchor: 'start' },
    { x: 30, y: 30, anchor: 'start' },
    { x: 50, y: 14, anchor: 'middle' },
    { x: 70, y: 30, anchor: 'end' },
    { x: 88, y: 68, anchor: 'end' },
] as const;

export default function CareerTree() {
    const [activeIndex, setActiveIndex] = useState(0);
    const experiences = portfolioData.experience.slice(0, branchPositions.length);
    const activeExperience = experiences[activeIndex];

    return (
        <div className="career-tree" aria-label="Career path map">
            <div className="career-tree__intro">
                <span className="career-tree__eyebrow">Career map</span>
                <p className="career-tree__hint">Select a branch to explore the role.</p>
            </div>

            <div className="career-tree__canvas">
                <svg className="career-tree__svg" viewBox="0 0 100 100" role="img" aria-label="Career path branches from student to developer">
                    <motion.path
                        d="M50 96 V50"
                        pathLength={1}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                        className="career-tree__trunk"
                    />
                    {branchPositions.map((position, index) => (
                        <motion.path
                            key={index}
                            d={`M50 50 L${position.x} ${position.y}`}
                            pathLength={1}
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.8, delay: 0.15 + index * 0.08, ease: 'easeOut' }}
                            className={`career-tree__branch ${activeIndex === index ? 'career-tree__branch--active' : ''}`}
                        />
                    ))}
                    <circle cx="50" cy="50" r="3.2" className="career-tree__core" />
                </svg>

                {experiences.map((experience, index) => {
                    const position = branchPositions[index];
                    const isActive = activeIndex === index;

                    return (
                        <button
                            key={`${experience.company}-${experience.role}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            onMouseEnter={() => setActiveIndex(index)}
                            onFocus={() => setActiveIndex(index)}
                            className={`career-tree__node career-tree__node--${position.anchor} ${isActive ? 'career-tree__node--active' : ''}`}
                            style={{ left: `${position.x}%`, top: `${position.y}%` }}
                            aria-pressed={isActive}
                        >
                            <span className="career-tree__dot" />
                            <span className="career-tree__node-year">{experience.date.split(' - ')[0]}</span>
                            <span className="career-tree__node-role">{experience.role}</span>
                            <span className="career-tree__node-company">{experience.company}</span>
                        </button>
                    );
                })}
            </div>

            {activeExperience && (
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="career-tree__detail"
                    aria-live="polite"
                >
                    <div>
                        <span className="career-tree__detail-label">{activeExperience.date}</span>
                        <h3>{activeExperience.role}</h3>
                        <p>{activeExperience.description}</p>
                    </div>
                    <div className="career-tree__skills">
                        {activeExperience.skills?.map((skill) => <span key={skill}>{skill}</span>)}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
