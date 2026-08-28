'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/lib/data';

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
                    className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-[100] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <span className="text-xs font-bold">IM</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] opacity-100 uppercase tracking-tighter text-white/50">Irine AI Thinking...</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                        ? 'bg-white text-black rounded-tr-none' 
                                        : 'bg-white/10 text-white border border-white/10 rounded-tl-none'
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
                                <div className="bg-white/10 text-white/50 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1 text-[10px] uppercase tracking-tighter">
                                    AI is thinking...
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions (Dynamic) */}
                    <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
                        {getSuggestions().map((suggestion, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(suggestion)}
                                className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all opacity-70 hover:opacity-100"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Message Irine AI..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                            />
                            <button 
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="p-3 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center"
                            >
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 2.5L2.5 9.16667L8.33333 11.6667L10.8333 17.5L17.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
