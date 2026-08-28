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

    // Quick Buttons
    const getSuggestions = () => {
        if (activeSection === 'projects') return ["Tell me about CivicPulse", "Hackathon victories?", "Most complex project?"];
        if (activeSection === 'skills') return ["Backend tech stack?", "Design tools?", "AI experience?"];
        return ["Skills", "Projects", "About Me", "Download Resume"];
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col overflow-hidden bg-black text-white md:inset-auto md:bottom-24 md:right-6 md:h-[620px] md:w-[420px] md:rounded-none md:border md:border-white/10 md:bg-black/80 md:backdrop-blur-xl md:shadow-2xl"
                >
                    {/* Header */}
                    <div className="shrink-0 border-b border-white/10 bg-white/5 px-5 py-5 pt-[calc(1.25rem+env(safe-area-inset-top))] backdrop-blur-xl md:px-6 md:pt-6">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                            <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                                <ConversationGlyph className="h-5 w-5 shrink-0 text-white/75" />
                                <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                                    <div className="h-px w-3 bg-green-500 animate-pulse" />
                                    <span className="truncate text-[10px] md:text-[11px] font-medium uppercase tracking-[0.24em] text-white/50 leading-none">
                                        Irine AI Thinking...
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-1 min-h-0 flex-col">
                        {/* Messages */}
                        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-8 md:px-6 md:py-8 scrollbar-hide">
                            <div className="h-2 md:h-4" />
                            <div className="space-y-5 md:space-y-6">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`w-fit max-w-[92%] rounded-none border px-5 py-4 text-[15px] leading-7 md:max-w-[84%] md:text-sm ${
                                            msg.sender === 'user'
                                                ? 'border-white bg-white text-black'
                                                : 'border-white/10 bg-white/10 text-white'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="rounded-none border border-white/10 bg-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-white/50">
                                            AI is thinking...
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="shrink-0 border-t border-white/10 bg-white/[0.03] px-5 py-4 md:px-6 md:py-5">
                            <div className="flex flex-wrap items-center gap-2.5 md:flex-nowrap md:overflow-x-auto scrollbar-hide">
                                {getSuggestions().map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(suggestion)}
                                        className="flex h-9 items-center whitespace-nowrap rounded-none border border-white/10 bg-white/5 px-4 text-[10px] uppercase tracking-[0.24em] text-white/70 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="shrink-0 border-t border-white/10 bg-black/80 px-5 py-5 md:px-6 md:py-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Message Irine AI..."
                                    className="flex-1 rounded-none border border-white/10 bg-white/5 px-4 py-3 text-sm leading-none text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-white text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.5 2.5L2.5 9.16667L8.33333 11.6667L10.8333 17.5L17.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
