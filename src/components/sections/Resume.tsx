'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { portfolioData } from '@/lib/data';

export default function Resume() {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const resumeHref = portfolioData.contact.resume;
    const downloadName = 'Irine_Milton_Resume.pdf';
    const previewSrc = `${resumeHref}#view=FitH&toolbar=0&navpanes=0`;

    useEffect(() => {
        if (!isPreviewOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsPreviewOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isPreviewOpen]);

    return (
        <section id="resume" className="min-h-screen w-full flex items-center justify-center px-6 py-32 md:py-48 relative z-10 bg-black/40 backdrop-blur-sm overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-12 items-start"
            >
                <div className="space-y-8 lg:sticky lg:top-28">
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Resume</p>
                        <h2 className="max-w-xl text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.92] text-balance">
                            View the resume without leaving the portfolio.
                        </h2>
                        <p className="max-w-xl text-base md:text-lg text-white/55 leading-relaxed">
                            Tap the preview to open the full document in place, then grab a polished copy with a stylized download action.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPreviewOpen(true)}
                            className="group inline-flex items-center gap-3 border border-white/15 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.3em] text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                        >
                            <span>Open Preview</span>
                            <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                        </button>

                        <a
                            href={resumeHref}
                            download={downloadName}
                            className="group relative inline-flex items-center gap-3 overflow-hidden border border-white/20 bg-white px-5 py-4 text-xs uppercase tracking-[0.3em] text-black transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <span className="absolute inset-0 -translate-x-full bg-black/5 transition-transform duration-700 group-hover:translate-x-full" />
                            <span className="relative">Download PDF</span>
                            <span className="relative text-lg">↓</span>
                        </a>
                    </div>


                </div>

                <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="group relative"
                >
                    <div className="flex items-center justify-between px-4 pb-4 text-[10px] uppercase tracking-[0.35em] text-white/35 md:px-5">
                        <span>Live Preview</span>
                        <span>Touch to Open</span>
                    </div>

                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                        <div className="relative aspect-[8.5/11]">
                            <iframe
                                src={previewSrc}
                                title="Resume preview"
                                className="pointer-events-none absolute inset-0 h-full w-full scale-[0.96] origin-top-left bg-white"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                            <button
                                type="button"
                                aria-label="Open resume preview"
                                onClick={() => setIsPreviewOpen(true)}
                                className="absolute inset-0 z-10"
                            />
                            <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                                <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Tap to preview</p>
                                <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Irine Milton Resume</h3>
                                <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                                    A live preview stays inside the portfolio; the full document opens in a modal.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(event) => {
                            if (event.target === event.currentTarget) {
                                setIsPreviewOpen(false);
                            }
                        }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 px-4 py-4 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.35 }}
                            className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Resume viewer</p>
                                    <p className="mt-1 text-sm text-white/70">In-portfolio preview</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <a
                                        href={resumeHref}
                                        download={downloadName}
                                        className="inline-flex items-center gap-2 border border-white/15 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-black transition-colors hover:bg-white/90"
                                    >
                                        Download
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setIsPreviewOpen(false)}
                                        className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
                                        aria-label="Close resume preview"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="min-h-0 flex-1 bg-white">
                                <iframe
                                    src={`${resumeHref}#view=FitH&toolbar=1&navpanes=0`}
                                    title="Resume full view"
                                    className="h-full w-full"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
