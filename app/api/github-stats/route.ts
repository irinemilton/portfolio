import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache the response for 1 hour to prevent rate limiting

interface Contribution {
    date: string;
    count: number;
    level: number;
}

async function fetchContributionsFromGitHub(username: string): Promise<Contribution[]> {
    const response = await fetch(`https://github.com/users/${username}/contributions`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Portfolio-App)',
            'Accept': 'text/html',
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub contributions page returned ${response.status}`);
    }

    const html = await response.text();

    const cells: Array<{ date: string; level: number }> = [];
    const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"/g;
    let cellMatch: RegExpExecArray | null;

    while ((cellMatch = cellRegex.exec(html)) !== null) {
        cells.push({ date: cellMatch[1], level: Number(cellMatch[2]) });
    }

    if (cells.length === 0) {
        throw new Error('No contribution day cells found in GitHub page');
    }

    const counts: number[] = [];
    const tooltipRegex = /for="contribution-day-component-[\d-]+"[^>]*>([\s\S]*?)<\/tool-tip>/g;
    let tipMatch: RegExpExecArray | null;

    while ((tipMatch = tooltipRegex.exec(html)) !== null) {
        const text = tipMatch[1].replace(/\s+/g, ' ').trim();
        const countMatch = text.match(/(\d+) contributions?/);
        counts.push(countMatch ? Number(countMatch[1]) : 0);
    }

    return cells
        .map((cell, index) => ({
            date: cell.date,
            level: cell.level,
            count: counts[index] ?? 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchContributionsLegacy(username: string): Promise<Contribution[]> {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);

    if (!response.ok) {
        throw new Error(`Legacy contributions API returned ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data?.contributions)) {
        throw new Error('Legacy contributions API returned an unexpected shape');
    }

    return (data.contributions as Contribution[])
        .sort((a, b) => a.date.localeCompare(b.date));
}

export async function GET() {
    try {
        const username = 'irinemilton';

        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App',
        };

        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }

        // Fetch user data
        const userResponse = await fetch(
            `https://api.github.com/users/${username}`,
            { headers }
        );

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();

        // Fetch repositories for language stats
        const reposResponse = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100`,
            { headers }
        );

        if (!reposResponse.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await reposResponse.json();

        // Calculate language statistics
        const languageStats: { [key: string]: number } = {};
        repos.forEach((repo: any) => {
            if (repo.language) {
                languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
            }
        });

        // Sort languages by usage
        const topLanguages = Object.entries(languageStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([language, count]) => ({
                language,
                count,
                percentage: ((count / repos.length) * 100).toFixed(1)
            }));

        const stats = {
            publicRepos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            totalStars: repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0),
            totalForks: repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0),
            topLanguages,
        };

        // Fetch contribution data so the graph can render in our theme.
        try {
            const contributions = await fetchContributionsFromGitHub(username);
            Object.assign(stats, { contributions });
        } catch (graphError) {
            console.error('[GitHub Stats API] GitHub scrape failed, trying fallback:', graphError);

            try {
                const contributions = await fetchContributionsLegacy(username);
                Object.assign(stats, { contributions });
            } catch (fallbackError) {
                console.error('[GitHub Stats API] Fallback also failed:', fallbackError);
                // Non-fatal error, continue without the graph
            }
        }

        return NextResponse.json(stats);
    } catch (error) {
        console.error('[GitHub Stats API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch GitHub stats' },
            { status: 500 }
        );
    }
}