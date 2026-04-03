'use client';

import { useState, useEffect } from 'react';
import ChatBot from './ChatBot';
import ChatTrigger from './ChatTrigger';

export default function SharedChat() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        setMounted(true);

        const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'timeline', 'contact'];
        const observers = sections.map(id => {
            const el = document.getElementById(id);
            if (!el) return null;

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setActiveSection(id);
                }
            }, { threshold: 0.5 });

            observer.observe(el);
            return observer;
        });

        return () => {
            observers.forEach(obs => obs?.disconnect());
        };
    }, []);

    if (!mounted) return null;

    return (
        <>
            <ChatTrigger 
                onClick={() => setIsChatOpen(true)} 
                isOpen={isChatOpen} 
            />
            <ChatBot 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                activeSection={activeSection}
            />
        </>
    );
}
