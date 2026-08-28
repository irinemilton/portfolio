'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/lib/data';
import ConversationGlyph from './ConversationGlyph';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatBot({ 
    isOpen, 
    onClose, 
    activeSection = 'hero' 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    activeSection?: string;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Greeting based on time and section
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const hour = new Date().getHours();
            let greeting = "Hi there!";
            
            if (hour < 12) greeting = "Good morning!";
            else if (hour < 18) greeting = "Good afternoon!";
            else if (hour < 22) greeting = "Good evening!";
            else greeting = "Late night project browsing? I like your style!";

            let contextualIntro = " I'm Irine's AI assistant. Ask me anything about his skills, projects, or experience!";
            
            if (activeSection === 'projects') {
                contextualIntro = " I see you're checking out my projects! Want to know which one won a national hackathon?";
            } else if (activeSection === 'skills') {
                contextualIntro = " Checking out my tech stack? I specialize in Full-Stack and AI/ML. Ask me about my favorite tools!";
            } else if (activeSection === 'experience') {
                contextualIntro = " Looking at my journey? I've interned at IBM and Bluestock. Want details on my roles?";
            }

            const initialMessage = greeting + contextualIntro;

            setMessages([{
                id: 'init-' + Date.now(),
                text: initialMessage,
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    }, [isOpen, messages.length, activeSection]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            // Track user input via Web3Forms (Gmail)
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: "9d862ab4-f83c-4145-a2af-78006b3ad92e",
                    subject: "New Chatbot Inquiry",
                    from_name: "Irine AI Assistant",
                    message: text,
                })
            }).catch(e => console.error("Failed to track chatbot input:", e));

            // Call Groq API route
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await res.json();

            const botMessage: Message = {
                id: 'bot-' + Date.now(),
                text: data.response,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error communicating with AI:", error);
            const errorMessage: Message = {
                id: 'bot-error-' + Date.now(),
                text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const sectionMeta: Record<string, { label: string; note: string }> = {
        hero: {
            label: 'General Guide',
            note: 'Ask about skills, projects, experience, or contact details.',
        },
        about: {
            label: 'About',
            note: 'Background, approach, and what drives the work.',
        },
        skills: {
            label: 'Stack',
            note: 'Tools, frameworks, AI/ML work, and preferred tech.',
        },
        experience: {
            label: 'Journey',
            note: 'Roles, internships, and the highlights behind them.',
        },
        projects: {
            label: 'Selected Work',
            note: 'Case studies, build details, and outcomes.',
        },
        timeline: {
            label: 'Milestones',
            note: 'Progression, wins, and key turning points.',
        },
        contact: {
            label: 'Connect',
            note: 'Reach out, ask for links, or start a conversation.',
        },
    };

    const currentContext = sectionMeta[activeSection] ?? sectionMeta.hero;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#050505] text-white md:inset-auto md:bottom-24 md:right-6 md:h-[680px] md:w-[780px] md:border md:border-white/10 md:bg-black/90 md:shadow-2xl"
                >
                    <div className="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)_auto] md:grid-cols-[240px_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)_auto]">
                        {/* Header */}
                        <header className="col-span-full shrink-0 border-b border-white/10 bg-white/5 px-4 py-4 pt-[calc(1rem+env(safe-area-inset-top))] backdrop-blur-xl md:px-6 md:pt-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <ConversationGlyph className="h-5 w-5 shrink-0 text-white/75" />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="h-px w-5 bg-white/30" />
                                            <span className="truncate text-[10px] font-medium uppercase tracking-[0.28em] text-white/55 leading-none">
                                                Irine AI Assistant
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-[10px] uppercase tracking-[0.24em] text-white/30">
                                            {currentContext.label}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </header>

                        {/* Context Rail */}
                        <aside className="border-b border-white/10 px-4 py-4 md:border-b-0 md:border-r md:px-5 md:py-5">
                            <div className="space-y-4 md:space-y-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">Context</p>
                                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-white/75">
                                        {currentContext.label}
                                    </p>
                                    <p className="mt-3 max-w-[28ch] text-xs leading-6 text-white/45">
                                        {currentContext.note}
                                    </p>
                                </div>

                                <div className="border-t border-white/10 pt-4">
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">Prompt</p>
                                    <p className="mt-3 text-xs leading-6 text-white/45">
                                        Type freely or ask about the current section.
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Transcript */}
                        <main className="min-h-0 overflow-y-auto px-4 py-5 scrollbar-hide md:px-6 md:py-6">
                            <div className="space-y-4 md:space-y-5">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`w-full max-w-[94%] md:max-w-[82%] ${msg.sender === 'user' ? 'border-r border-white/15 pr-4 text-right' : 'border-l border-white/15 pl-4 text-left'}`}>
                                            <div className={`text-[10px] uppercase tracking-[0.32em] ${msg.sender === 'user' ? 'text-white/30' : 'text-white/35'}`}>
                                                {msg.sender === 'user' ? 'You' : 'Assistant'}
                                            </div>
                                            <p className="mt-2 text-sm leading-7 text-white/85 md:text-[15px]">
                                                {msg.text}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="border-l border-white/15 pl-4 text-left">
                                            <div className="text-[10px] uppercase tracking-[0.32em] text-white/35">
                                                Assistant
                                            </div>
                                            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-white/45">
                                                AI is thinking...
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </main>

                        {/* Composer */}
                        <footer className="col-span-full shrink-0 border-t border-white/10 bg-black/85 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-6 md:py-5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex flex-col gap-3 md:flex-row md:items-end"
                            >
                                <div className="flex-1">
                                    <label className="text-[10px] uppercase tracking-[0.35em] text-white/30" htmlFor="chat-input">
                                        Message
                                    </label>
                                    <input
                                        id="chat-input"
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Message Irine AI..."
                                        className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-sm text-white placeholder:text-white/30 focus:border-white/45 focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="flex h-12 min-w-[112px] items-center justify-center border border-white/15 bg-white px-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-black transition-colors hover:bg-white/90 disabled:opacity-50"
                                >
                                    {isTyping ? 'Sending' : 'Send'}
                                </button>
                            </form>
                        </footer>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
