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

// Disable SSR for Projects to prevent hydration errors
const Projects = dynamic(() => import("@/components/sections/Projects"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <SmoothScroll>
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Timeline />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
