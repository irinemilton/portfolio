import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache the response for 1 hour to prevent rate limiting

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

        // Fetch contribution graph SVG
        try {
            // Using ssr-contributions-svg with explicit dark theme for better contrast
            const graphResponse = await fetch(`https://ssr-contributions-svg.vercel.app/_/${username}?chart=calendar&format=svg&theme=dark`);
            if (graphResponse.ok) {
                const graphSvg = await graphResponse.text();
                // Add the SVG to the stats object
                Object.assign(stats, { contributionGraph: graphSvg });
            }
        } catch (graphError) {
            console.error('[GitHub Stats API] Failed to fetch contribution graph:', graphError);
            // Non-fatal error, continue without the graph
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
