import { Metadata } from 'next';

export const siteMetadata: Metadata = {
    title: 'Irine Milton | Full-Stack Developer & AI Enthusiast',
    description: 'B.Tech CS student passionate about Full-Stack Development and AI/ML. Winner of YODHA National Hackathon. Building impactful solutions with React, Next.js, Python, and AI.',
    keywords: [
        'Irine Milton',
        'Full-Stack Developer',
        'AI Engineer',
        'Machine Learning',
        'React Developer',
        'Next.js',
        'Python Developer',
        'Portfolio',
        'Web Developer',
        'Software Engineer',
        'Hackathon Winner',
        'YODHA',
        'Christ College of Engineering'
    ],
    authors: [{ name: 'Irine Milton' }],
    creator: 'Irine Milton',
    publisher: 'Irine Milton',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://irinemilton.vercel.app',
        siteName: 'Irine Milton Portfolio',
        title: 'Irine Milton | Full-Stack Developer & AI Enthusiast',
        description: 'B.Tech CS student passionate about Full-Stack Development and AI/ML. Winner of YODHA National Hackathon.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Irine Milton - Full-Stack Developer & AI Enthusiast',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Irine Milton | Full-Stack Developer & AI Enthusiast',
        description: 'B.Tech CS student passionate about Full-Stack Development and AI/ML. Winner of YODHA National Hackathon.',
        images: ['/og-image.png'],
        creator: '@irinemilton',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    verification: {
        google: 'your-google-verification-code',
    },
};

export const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Irine Milton',
    url: 'https://irinemilton.vercel.app',
    image: '/og-image.png',
    jobTitle: 'Full-Stack Developer & AI Enthusiast',
    worksFor: {
        '@type': 'Organization',
        name: 'Christ College of Engineering',
    },
    alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Christ College of Engineering',
    },
    sameAs: [
        'https://github.com/irinemilton',
        'https://www.linkedin.com/in/irinemilton/',
    ],
    knowsAbout: [
        'Full-Stack Development',
        'Artificial Intelligence',
        'Machine Learning',
        'React',
        'Next.js',
        'Python',
        'Django',
        'TypeScript',
    ],
};
