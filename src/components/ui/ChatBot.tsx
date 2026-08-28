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

            let contextualIntro = " I'm Irine's AI assistant. Ask me about skills, projects, or experience.";

            if (activeSection === 'projects') {
                contextualIntro = " I can help with project details.";
            } else if (activeSection === 'skills') {
                contextualIntro = " I can talk through the tech stack.";
            } else if (activeSection === 'experience') {
                contextualIntro = " I can walk through the journey.";
            } else if (activeSection === 'resume') {
                contextualIntro = " I can show the resume preview.";
            } else if (activeSection === 'contact') {
                contextualIntro = " I can share contact details.";
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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed inset-4 z-[100] flex overflow-hidden rounded-[24px] border border-white/10 bg-black/90 text-white shadow-[0_24px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl md:inset-auto md:bottom-6 md:right-6 md:h-[560px] md:w-[390px] md:rounded-[32px]"
                >
                    <div className="flex h-full min-h-0 flex-col">
                        <header className="shrink-0 border-b border-white/10 bg-white/5 px-6 py-4 pt-[calc(1.25rem+env(safe-area-inset-top))] md:px-5 md:pt-5">
                            <div className="flex items-center justify-between gap-5">
                                <div className="flex min-w-0 items-center gap-3 pl-1">
                                    <ConversationGlyph className="h-5 w-5 shrink-0 text-white/75" />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="h-px w-5 bg-white/30" />
                                            <span className="truncate text-[10px] font-medium uppercase tracking-[0.28em] text-white/55 leading-none">
                                                Irine AI Assistant
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </header>

                        <main className="flex-1 min-h-0 overflow-y-auto px-6 py-5 scrollbar-hide md:px-5 md:py-5">
                            <div className="space-y-5">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`w-full max-w-[92%] ${msg.sender === 'user' ? 'border-r border-white/15 pr-5 text-right' : 'border-l border-white/15 pl-5 text-left'}`}>
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

                        <footer className="shrink-0 border-t border-white/10 bg-black/85 px-6 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:px-5 md:py-5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-end gap-2"
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
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/15 bg-white text-black transition-colors hover:bg-white/90 disabled:opacity-50"
                                >
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.5 2.5L2.5 9.16667L8.33333 11.6667L10.8333 17.5L17.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </form>
                        </footer>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
