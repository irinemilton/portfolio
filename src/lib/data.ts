// Portfolio data and content

export interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    year: string;
}

export interface Repository {
    name: string;
    repo: string;
    description: string;
    category: string;
}

export const portfolioData = {
    name: "Irine Milton",
    title: "B.Tech CS | Full-Stack, AI & ML Enthusiast",
    tagline: "Building digital experiences with precision and purpose",

    about: {
        description: "I'm a Computer Science Engineering student at Christ College of Engineering, passionate about building impactful solutions. With a strong foundation in Full-Stack Development and AI/ML, I thrive on solving complex problems—whether it's building a fintech platform, an AI grievance system, or winning national hackathons.",
        highlights: [
            "Full-Stack Developer",
            "AI/ML Enthusiast",
            "Hackathon Winner",
            "Cloud Certified"
        ]
    },

    skills: [
        {
            category: "Frontend",
            items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "Framer Motion"]
        },
        {
            category: "Backend",
            items: ["Python", "Django", "Flask", "Node.js", "Spring Boot", "MySQL", "PostgreSQL"]
        },
        {
            category: "AI & Tools",
            items: ["Machine Learning", "OpenAI API", "Git/GitHub", "Docker", "AWS", "Linux"]
        },
    ],

    projects: [
        {
            id: 1,
            title: "CivicPulse AI",
            description: "Voice-first grievance platform utilizing OpenAI Whisper to transcribe, tag, and rank public grievances for government authorities. Built during Byte Quest 2026.",
            tech: ["React", "Node.js", "OpenAI Whisper", "AI/ML"],
            year: "2026"
        },
        {
            id: 2,
            title: "ICU Psychosis AI",
            description: "Award-winning early detection system using Computer Vision to identify behavioral distress signals in ICU patients. Winner at YODHA National Hackathon.",
            tech: ["Python", "Computer Vision", "Real-time Analytics"],
            year: "2026"
        },
        {
            id: 3,
            title: "Shopzye",
            description: "Full-stack e-commerce platform featuring JWT authentication, admin dashboard, and secure checkout flow.",
            tech: ["React", "Django", "MySQL", "Redux"],
            year: "2025"
        },
        {
            id: 4,
            title: "DeCIDE",
            description: "AI-powered truth assistant to combat misinformation by verifying text and media in real-time. Built for Gen AI Exchange Hackathon.",
            tech: ["Generative AI", "Google Cloud", "Hackathon"],
            year: "2025"
        }
    ],

    timeline: [
        {
            year: "2026",
            title: "Python Dev Intern",
            description: "Cognifyz Technologies | Developed scalable Python solutions and optimized backend logic."
        },
        {
            year: "2025",
            title: "SDE Intern",
            description: "Bluestock Fintech | Built Company Registration Module using React 19, Node.js, and PostgreSQL."
        },
        {
            year: "2025",
            title: "National Hackathon Winner",
            description: "YODHA 2026 | Secured 1st place (`₹15k`) for ICU Psychosis Detection System."
        },
        {
            year: "2025",
            title: "Front-End Intern",
            description: "CODEXINTERN | Crafted responsive interfaces and mastered React.js workflows."
        },
        {
            year: "2024 - Present",
            title: "B.Tech in Computer Science",
            description: "Christ College of Engineering | Active member of CODE & FOSS. Focusing on Algorithms, System Design, and AI/ML."
        },
        {
            year: "2024",
            title: "Higher Secondary (CS)",
            description: "Nirmala Matha Central School | Specialized in Computer Science with a strong foundation in programming logic."
        }
    ],

    repositories: [
        // AI & Advanced Systems
        {
            name: "Safe-Home",
            repo: "irinemilton/Safe-Home",
            description: "Concrete Health Guard AI - Hybrid structural health monitoring with Snowflake, Random Forest & MobileNetV2",
            category: "AI & Advanced Systems"
        },
        {
            name: "DICE",
            repo: "irinemilton/DICE",
            description: "Digital Information Credibility Engine - Fake news detection framework",
            category: "AI & Advanced Systems"
        },
        {
            name: "MapScribe-AI",
            repo: "Private",
            description: "AI-powered historical map text detection and recognition system",
            category: "AI & Advanced Systems"
        },
        {
            name: "HexaCoders-Dashboard",
            repo: "irinemilton/HexaCoders-Dashboard",
            description: "Centralized dashboard showcasing AI innovations and team projects",
            category: "AI & Advanced Systems"
        },
        // Full-Stack & Web Applications
        {
            name: "white-matrix-voting",
            repo: "irinemilton/white-matrix-voting",
            description: "Secure online voting platform with OAuth authentication and real-time data integrity",
            category: "Full-Stack & Web"
        },
        {
            name: "GigFlow",
            repo: "irinemilton/GigFlow",
            description: "Full-stack freelancing platform facilitating job postings and client interactions",
            category: "Full-Stack & Web"
        },
        {
            name: "Shopzye",
            repo: "irinemilton/shopzye",
            description: "E-commerce application with JWT authentication, order management & email resets",
            category: "Full-Stack & Web"
        },
        {
            name: "AgriConnect",
            repo: "irinemilton/AgriConnect",
            description: "Web application for farmers providing crop production guidance",
            category: "Full-Stack & Web"
        },
        {
            name: "ICU_MONITORING",
            repo: "irinemilton/ICU_MONITORING",
            description: "TypeScript-based healthcare monitoring system for critical patient data",
            category: "Full-Stack & Web"
        },
        // Java & SpringBoot Projects
        {
            name: "ShopSphere-1",
            repo: "irinemilton/ShopSphere-1",
            description: "E-commerce backend architecture using Java and Spring Boot",
            category: "Java & SpringBoot"
        },
        {
            name: "Task-Master",
            repo: "irinemilton/Task-Master",
            description: "Productivity-focused Todo app built with Spring Boot",
            category: "Java & SpringBoot"
        },
        {
            name: "Xpry",
            repo: "irinemilton/Xpry",
            description: "Food inventory management app tracking expiry dates to reduce waste",
            category: "Java & SpringBoot"
        },
        {
            name: "StudentManagementSystem",
            repo: "irinemilton/StudentManagementSysytem",
            description: "System for managing student records and academic data efficiently",
            category: "Java & SpringBoot"
        },
        // Utility & Fun Projects
        {
            name: "UselessForm.exe",
            repo: "irinemilton/UselessForm.exe",
            description: "Experimental trolling form with Shout-to-Scroll™ and noise-based navigation",
            category: "Utility & Fun"
        },
        {
            name: "text-translator",
            repo: "irinemilton/text-translator",
            description: "JavaScript-based utility for quick text translation across multiple languages",
            category: "Utility & Fun"
        },
        {
            name: "Random-String-Generator",
            repo: "irinemilton/Random-String-Generator",
            description: "Tool for generating secure passwords and custom random text strings",
            category: "Utility & Fun"
        },
        {
            name: "portfolio",
            repo: "irinemilton/portfolio",
            description: "Personal portfolio website source code built with TypeScript",
            category: "Utility & Fun"
        }
    ],

    contact: {
        email: "irinemilton009@gmail.com",
        github: "https://github.com/irinemilton",
        linkedin: "https://www.linkedin.com/in/irinemilton/",
        resume: "/resume.pdf"
    }
};
