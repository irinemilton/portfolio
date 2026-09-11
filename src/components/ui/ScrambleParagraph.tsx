'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrambleParagraphProps {
    text: string;
}

export default function ScrambleParagraph({ text }: ScrambleParagraphProps) {
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const paragraph = paragraphRef.current;
        if (!paragraph) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(paragraph);
        return () => observer.disconnect();
    }, []);

    return (
        <p ref={paragraphRef} className={`about-scramble-paragraph ${isVisible ? 'about-scramble-paragraph--visible' : ''}`} aria-label={text}>
            {Array.from(text).map((character, index) => (
                <span
                    key={`${character}-${index}`}
                    aria-hidden="true"
                    style={{ '--scramble-index': index } as React.CSSProperties}
                >
                    {character}
                </span>
            ))}
        </p>
    );
}
