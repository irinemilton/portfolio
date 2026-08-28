'use client';

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";
import SmoothScroll from "@/components/ui/SmoothScroll";
import LoadingScreen from "@/components/ui/LoadingScreen";
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Disable SSR for Projects to prevent hydration errors
const Projects = dynamic(() => import("@/components/sections/Projects"), {
  ssr: false,
});

// Animated glowing section divider
const Divider = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 1 }}
    className="w-full flex flex-col items-center justify-center py-24 md:py-36 gap-6 relative overflow-hidden"
  >
    {/* Glowing orb */}
    <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="w-2 h-2 rounded-full bg-white/60 shadow-[0_0_20px_6px_rgba(255,255,255,0.2)]"
    />
    <div className="w-48 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
  </motion.div>
);

// Scroll reveal wrapper for each section
const RevealSection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <SmoothScroll>
        <main className="flex flex-col pb-32">
          <Hero />
          <Divider />
          <RevealSection><About /></RevealSection>
          <Divider />
          <RevealSection><Skills /></RevealSection>
          <Divider />
          <RevealSection><Experience /></RevealSection>
          <Divider />
          <RevealSection><Projects /></RevealSection>
          <Divider />
          <RevealSection><Timeline /></RevealSection>
          <Divider />
          <RevealSection><Contact /></RevealSection>
        </main>
      </SmoothScroll>
    </>
  );
}
