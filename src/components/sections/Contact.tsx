'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { portfolioData } from '@/lib/data';
import { useState } from 'react';

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [result, setResult] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        const formData = new FormData(e.currentTarget);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify({
            ...object,
            access_key: "9d862ab4-f83c-4145-a2af-78006b3ad92e"
        });

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: json
            });

            const data = await response.json();

            if (data.success) {
                setStatus('success');
                e.currentTarget.reset();
            } else {
                setStatus('error');
                setResult(data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setStatus('error');
            setResult("Connectivity issue. Please check your internet or try again later.");
        }
    };

    return (
        <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="max-w-7xl w-full relative z-10"
            >
                <motion.h2
                    variants={fadeUp}
                    className="text-5xl md:text-7xl lg:text-9xl font-bold mb-16 tracking-tight uppercase"
                >
                    Connect
                </motion.h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                    {/* Left Column: Info & Links */}
                    <div className="flex flex-col h-full">
                        <motion.p
                            variants={fadeUp}
                            className="text-lg md:text-xl lg:text-2xl opacity-60 mb-12 leading-relaxed tracking-wide max-w-xl"
                        >
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                            Let's build something exceptional together.
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            className="space-y-6 mt-auto"
                        >
                            <motion.a
                                href={`mailto:${portfolioData.contact.email}`}
                                className="group flex items-baseline gap-4 border-b border-white/10 pb-4 hover:border-white/30 transition-all duration-300"
                            >
                                <span className="text-[10px] md:text-xs opacity-40 min-w-[80px] uppercase tracking-[0.2em]">Email</span>
                                <span className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight group-hover:opacity-100 opacity-80 transition-opacity truncate">
                                    {portfolioData.contact.email}
                                </span>
                            </motion.a>

                            <motion.a
                                href={portfolioData.contact.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-baseline gap-4 border-b border-white/10 pb-4 hover:border-white/30 transition-all duration-300"
                            >
                                <span className="text-[10px] md:text-xs opacity-40 min-w-[80px] uppercase tracking-[0.2em]">GitHub</span>
                                <span className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight group-hover:opacity-100 opacity-80 transition-opacity">
                                    irinemilton →
                                </span>
                            </motion.a>

                            <motion.a
                                href={portfolioData.contact.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-baseline gap-4 border-b border-white/10 pb-4 hover:border-white/30 transition-all duration-300"
                            >
                                <span className="text-[10px] md:text-xs opacity-40 min-w-[80px] uppercase tracking-[0.2em]">LinkedIn</span>
                                <span className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight group-hover:opacity-100 opacity-80 transition-opacity">
                                    Connect →
                                </span>
                            </motion.a>
                        </motion.div>
                    </div>

                    {/* Right Column: Form */}
                    <motion.div variants={fadeUp} className="relative min-h-[500px]">
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="space-y-12"
                        >
                            <div className="space-y-3 relative group">
                                <label htmlFor="name" className="text-[10px] uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    placeholder="What should I call you?"
                                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white focus:outline-none transition-all duration-500 placeholder:opacity-20 placeholder:font-light"
                                />
                            </div>

                            <div className="space-y-3 relative group">
                                <label htmlFor="email" className="text-[10px] uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    placeholder="Where can I reply to?"
                                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white focus:outline-none transition-all duration-500 placeholder:opacity-20 placeholder:font-light"
                                />
                            </div>

                            <div className="space-y-3 relative group">
                                <label htmlFor="message" className="text-[10px] uppercase tracking-[0.3em] opacity-40 group-focus-within:opacity-100 transition-opacity">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    required
                                    rows={4}
                                    placeholder="Tell me about your project or idea..."
                                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white focus:outline-none transition-all duration-500 placeholder:opacity-20 placeholder:font-light resize-none"
                                />
                            </div>

                            {status === 'error' && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-xs tracking-wider"
                                >
                                    {result}
                                </motion.p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="group relative w-full py-8 border border-white/20 rounded-full overflow-hidden transition-all hover:border-white/60 disabled:opacity-50"
                            >
                                <span className="relative z-10 text-xs font-semibold uppercase tracking-[0.3em] transition-colors group-hover:text-black">
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </span>
                                {/* Hover background effect */}
                                <motion.div
                                    className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.32,0.72,0,1]"
                                />
                            </button>
                        </motion.form>
                    </motion.div>
                </div>

                {/* Footer Copy */}
                <motion.div
                    variants={fadeUp}
                    className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 opacity-30 text-[10px] uppercase tracking-[0.2em]"
                >
                    <p>© {new Date().getFullYear()} {portfolioData.name}</p>
                    <p>Building with precision & purpose</p>
                </motion.div>
            </motion.div>

            {/* Success Modal / Pop-up Overlay */}
            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-[40px] backdrop-blur-2xl text-center relative overflow-hidden shadow-2xl shadow-black"
                        >
                            {/* Accent Circle */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl font-light" />

                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8 border border-white/5">
                                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                
                                <h3 className="text-3xl font-bold mb-4 tracking-tight uppercase">Message Received!</h3>
                                <p className="opacity-60 mb-10 leading-relaxed text-sm md:text-base">
                                    Thank you for reaching out. I've received your message and will reply soon!
                                </p>
                                
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="w-full py-5 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
