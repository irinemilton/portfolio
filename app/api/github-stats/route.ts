import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
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

        // User profile
        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();

        // Repo list
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
        if (!reposRes.ok) throw new Error('Failed to fetch repositories');
        const repos = await reposRes.json();

        // Language stats
        const languageStats: { [key: string]: number } = {};
        repos.forEach((repo: any) => {
            if (repo.language) {
                languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
            }
        });
        const topLanguages = Object.entries(languageStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([language, count]) => ({
                language,
                count,
                percentage: ((count / repos.length) * 100).toFixed(1),
            }));

        // Contributions (GraphQL preferred)
        let contributions: any[] = [];
        if (process.env.GITHUB_TOKEN) {
            const gqlQuery = `
                query ($login: String!) {
                    user(login: $login) {
                        contributionsCollection {
                            contributionCalendar {
                                weeks {
                                    contributionDays {
                                        date
                                        contributionCount
                                    }
                                }
                            }
                        }
                    }
                }
            `;
            const gqlRes = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: gqlQuery, variables: { login: username } }),
            });
            if (gqlRes.ok) {
                const gqlData = await gqlRes.json();
                const weeks = gqlData.data.user.contributionsCollection.contributionCalendar.weeks;
                contributions = weeks.flatMap((w: any) =>
                    w.contributionDays.map((d: any) => ({
                        date: d.date,
                        count: d.contributionCount,
                        level: 0,
                    }))
                );
            } else {
                console.warn('[GitHub Stats API] GraphQL contributions fetch failed');
            }
        } else {
            // Fallback to scraping or legacy API
            try {
                contributions = await fetchContributionsFromGitHub(username);
            } catch (scrapeError) {
                console.error('[GitHub Stats API] Scrape failed, trying legacy:', scrapeError);
                try {
                    contributions = await fetchContributionsLegacy(username);
                } catch (legacyError) {
                    console.error('[GitHub Stats API] Legacy fetch failed:', legacyError);
                }
            }
        }

        const stats = {
            publicRepos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            totalStars: repos.reduce((a: number, r: any) => a + r.stargazers_count, 0),
            totalForks: repos.reduce((a: number, r: any) => a + r.forks_count, 0),
            topLanguages,
            contributions,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('[GitHub Stats API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch GitHub stats' },
            { status: 500 }
        );
    }
}