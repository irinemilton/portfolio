import { NextResponse } from 'next/server';

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

        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-App',
                },
            }
        );

        console.log('[GitHub API] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[GitHub API] Error response:', errorText);
            throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
        }

        const repos: GitHubRepo[] = await response.json();
        console.log('[GitHub API] Fetched repos count:', repos.length);

        // Transform GitHub repos to match our Repository interface
        const transformedRepos = repos
            .filter(repo => !repo.private) // Filter out private repos
            .map(repo => ({
                name: repo.name,
                repo: `${username}/${repo.name}`,
                description: repo.description || 'No description available',
                category: categorizeRepo(repo.topics, repo.language),
            }));

        console.log('[GitHub API] Transformed repos count:', transformedRepos.length);
        return NextResponse.json(transformedRepos);
    } catch (error) {
        console.error('[GitHub API] Error fetching repos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch repositories', details: error instanceof Error ? error.message : 'Unknown error' },
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
