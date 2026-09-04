'use client';

const words = ['design.', 'prototype.', 'solve.', 'build.', 'develop.', 'ship.'];

export default function ScrollWords() {
    return (
        <div className="about-scroll-words" aria-label="I can design, prototype, solve, build, develop, and ship real-world solutions.">
            <div className="about-scroll-words__inner">
                <h2 className="about-scroll-words__prefix">
                    <span aria-hidden="true">I can&nbsp;</span>
                </h2>
                <ul aria-hidden="true" className="about-scroll-words__list">
                    {words.map((word) => (
                        <li key={word}>{word}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
