'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { portfolioData } from '@/lib/data';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

// Helper to generate a comprehensive FAQ list from portfolioData
const generateFaqs = () => {
    const baseFaqs = [
        {
            q: "Who are you?",
            questions: ["who are you", "what is your name", "who am i talking to", "tell me about yourself", "your background"],
            a: `I'm ${portfolioData.name}, a ${portfolioData.title}. I'm currently a Computer Science student at Christ College of Engineering.`,
            tags: ["about", "profile", "bio", "identity", "name"]
        },
        {
            q: "What is your education?",
            questions: ["where do you study", "your education", "what is your degree", "college info", "study background"],
            a: `I am pursuing a B.Tech in Computer Science at Christ College of Engineering (2024-Present). I specialize in Algorithms, System Design, and AI/ML.`,
            tags: ["study", "college", "degree", "btech", "cs", "university"]
        },
        {
            q: "How can I contact you?",
            questions: ["how to reach you", "your email", "your linkedin", "contact info", "hire you"],
            a: `You can reach me at ${portfolioData.contact.email} or find me on LinkedIn: ${portfolioData.contact.linkedin}.`,
            tags: ["email", "linkedin", "contact", "reach", "message", "hire"]
        }
    ];

    // Add projects
    const projectFaqs = portfolioData.projects.map(p => ({
        q: `Tell me about ${p.title}`,
        questions: [`what is ${p.title}`, `how did you build ${p.title}`, `show me ${p.title}`, `details on ${p.title}`],
        a: `${p.title} (${p.year}): ${p.description}. Tech used: ${p.tech.join(', ')}.`,
        tags: ["project", p.title.toLowerCase(), ...p.tech.map(t => t.toLowerCase())]
    }));

    // Add experience/internships
    const experienceFaqs = portfolioData.experience.map(e => ({
        q: `What did you do at ${e.company}?`,
        questions: [`your role at ${e.company}`, `internship at ${e.company}`, `what was your work at ${e.company}`, `details on ${e.company}`],
        a: `I was an ${e.role} at ${e.company} (${e.date}). I ${e.description.substring(0, 150)}...`,
        tags: ["work", "experience", "internship", e.company.toLowerCase(), e.role.toLowerCase()]
    }));

    // Add skills
    const skillFaqs = portfolioData.skills.map(s => ({
        q: `What are your ${s.category} skills?`,
        questions: [`your ${s.category} stack`, `what ${s.category} tools do you use`, `skills in ${s.category}`, `${s.category} background`],
        a: `In ${s.category}, I'm proficient in: ${s.items.join(', ')}.`,
        tags: ["skill", s.category.toLowerCase(), ...s.items.map(i => i.toLowerCase())]
    }));

    // Add repositories
    const repoFaqs = portfolioData.repositories.map(r => ({
        q: `What is ${r.name}?`,
        questions: [`tell me about ${r.name}`, `what does ${r.name} do`, `details on repo ${r.name}`],
        a: `${r.name} is a ${r.category} project. ${r.description}.`,
        tags: ["repo", "github", r.name.toLowerCase(), r.category.toLowerCase()]
    }));

    return [...baseFaqs, ...projectFaqs, ...experienceFaqs, ...skillFaqs, ...repoFaqs];
};

const faqs = generateFaqs();

const fuse = new Fuse(faqs, {
    keys: [
        { name: 'q', weight: 0.5 },
        { name: 'questions', weight: 0.8 },
        { name: 'tags', weight: 0.4 }
    ],
    threshold: 0.45,
    distance: 100
});

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
    const [context, setContext] = useState<string | null>(null); // Memory for follow-ups
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Typing Simulation logic
    const simulateTyping = (text: string, messageId: string) => {
        let i = 0;
        const interval = setInterval(() => {
            setMessages(prev => prev.map(m => 
                m.id === messageId 
                    ? { ...m, text: text.substring(0, i + 1) } 
                    : m
            ));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, 30); // Speed of typing
    };

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

            const initialId = 'init-' + Date.now();
            setMessages([{
                id: initialId,
                text: "", // Start empty for typing
                sender: 'bot',
                timestamp: new Date()
            }]);
            
            setTimeout(() => {
                simulateTyping(greeting + contextualIntro, initialId);
            }, 500);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Actionable: Resume
    const handleResume = () => {
        window.open(portfolioData.contact.resume, '_blank');
        return "Opening my resume in a new tab for you! Let me know if you have any questions about my experience.";
    };

    // Level 3: Smart Fallback
    const fallbackAnswer = (query: string) => {
        if (query.includes("who")) return `I am ${portfolioData.name}, a Computer Science student and Full-Stack developer passionate about building real-world applications.`;
        if (query.includes("contact") || query.includes("reach")) return "You can reach me via the contact section below, or email me at " + portfolioData.contact.email;
        if (query.includes("help") || query.includes("what")) return "I can tell you about my projects, skills, and education! What are you interested in?";
        return "Try asking about my skills, projects, or education! I'm still learning and will get better as you talk to me.";
    };

    const handleSend = async (text: string = inputValue) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Track user input via Web3Forms (Gmail)
        try {
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
            });
        } catch (e) {
            // Silently fail to not interrupt user experience
            console.error("Failed to track chatbot input:", e);
        }

        // Memory & Logic Engine
        setTimeout(async () => {
            const query = text.toLowerCase();
            let response = "";

            // 1. Actionable: Resume
            if (query.includes('resume') || query.includes('cv') || query.includes('download')) {
                response = handleResume();
            } 
            // 2. Memory & Context
            else if (context && (query.includes('more') || query.includes('hardest') || query.includes('how') || query.includes('tech'))) {
                const lastProject = portfolioData.projects.find(p => p.title.toLowerCase().includes(context.toLowerCase()));
                if (lastProject) {
                    if (query.includes('tech')) response = `For ${lastProject.title}, I used ${lastProject.tech.join(', ')}.`;
                    else if (query.includes('hardest')) response = `The biggest challenge in ${lastProject.title} was ensuring real-time performance and scalability.`;
                    else response = `Beyond the basics, ${lastProject.title} was built durante a hackathon and focused on solving ${lastProject.description}.`;
                } else {
                    response = "Can you tell me more specifically what you're asking about? I forgot which project we were talking about!";
                }
            }
            // 3. Easter Eggs
            else if (query.includes('favorite') || query.includes('food') || query.includes('coffee') || query.includes('hobby')) {
                if (query.includes('food')) response = "I love exploring different cuisines, but a good Paneer Butter Masala is hard to beat!";
                else if (query.includes('coffee')) response = "Definitely a coffee person! It's the fuel behind most of these projects.";
                else response = "When I'm not coding, I love participating in hackathons and exploring new AI tools.";
            }
            // 4. Standard FAQ Match
            else {
                const results = fuse.search(text);
                if (results.length > 0) {
                    response = results[0].item.a;
                    // Store context for next turn
                    const match = results[0].item.tags.find(t => portfolioData.projects.some(p => p.title.toLowerCase() === t));
                    if (match) setContext(match);
                } else {
                    response = fallbackAnswer(query);
                }
            }

            const botMessageId = 'bot-' + Date.now();
            const botMessage: Message = {
                id: botMessageId,
                text: "", // Start typing
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            
            // Start simulated typing
            setTimeout(() => {
                simulateTyping(response, botMessageId);
            }, 100);
        }, 800); // Thinking... delay
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
                                    {msg.sender === 'bot' && msg.text === "" && <span className="animate-pulse">|</span>}
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
