import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache the response for 1 hour to prevent rate limiting

interface GitHubRepo {
    name: string;
    description: string | null;
    html_url: string;
    topics: string[];
    language: string | null;
    private: boolean;
}

export async function GET() {
    try {
        const username = 'irinemilton';
        console.log('[GitHub API] Fetching repos for:', username);

        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App',
        };

        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
            { headers }
        );

        console.log('[GitHub API] Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[GitHub API] GitHub Error Payload:', errorText);
            throw new Error(`GitHub responded with ${response.status}: ${errorText}`);
        }

        const repos: GitHubRepo[] = await response.json();
        const transformedRepos = repos
            .filter(repo => !repo.private)
            .map(repo => ({
                name: repo.name,
                repo: `${username}/${repo.name}`,
                description: repo.description || 'No description available',
                category: categorizeRepo(repo.topics, repo.language),
            }));

        return NextResponse.json(transformedRepos);
    } catch (error: any) {
        console.error('[GitHub API] Final Error Catch:', {
            name: error?.name,
            message: error?.message,
            stack: error?.stack
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch repositories', 
                details: error?.message || 'Unknown error occurred on the server'
            },
            { status: 500 }
        );
    }
}

function categorizeRepo(topics: string[], language: string | null): string {
    // Categorize based on topics and language
    const topicsLower = topics.map(t => t.toLowerCase());

    if (
        topicsLower.some(t => ['ai', 'ml', 'machine-learning', 'deep-learning', 'computer-vision'].includes(t)) ||
        topicsLower.includes('artificial-intelligence')
    ) {
        return 'AI & Advanced Systems';
    }

    if (
        language === 'Java' ||
        topicsLower.some(t => ['spring-boot', 'springboot', 'java'].includes(t))
    ) {
        return 'Java & SpringBoot';
    }

    if (
        topicsLower.some(t => ['react', 'nextjs', 'fullstack', 'web', 'django', 'flask'].includes(t)) ||
        ['TypeScript', 'JavaScript', 'Python'].includes(language || '')
    ) {
        return 'Full-Stack & Web';
    }

    return 'Utility & Fun';
}
