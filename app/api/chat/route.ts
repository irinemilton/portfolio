import { NextResponse } from 'next/server';
import { portfolioData } from '@/lib/data';

async function forwardChatMessage(message: string) {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
        console.error('WEB3FORMS_ACCESS_KEY is not configured.');
        return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            body: new URLSearchParams({
                access_key: accessKey,
                subject: 'New Chatbot Inquiry',
                from_name: 'Irine AI Assistant',
                message,
            }).toString(),
            signal: controller.signal,
        });
        const responseText = await response.text();
        let result: { success?: boolean; message?: string };

        try {
            result = JSON.parse(responseText);
        } catch {
            console.error('Web3Forms returned a non-JSON response:', response.status, responseText.slice(0, 300));
            return;
        }

        if (!response.ok || !result.success) {
            console.error('Web3Forms rejected chatbot message:', result);
        }
    } catch (error) {
        console.error('Chatbot email forwarding failed:', error instanceof Error ? error.message : error);
    } finally {
        clearTimeout(timeout);
    }
}

export async function POST(req: Request) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error("OPENROUTER_API_KEY is not set in environment variables.");
        return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    try {
        const { messages } = await req.json();

        const latestUserMessage = [...messages]
            .reverse()
            .find((message: { sender: string; text: string }) => message.sender === 'user');

        if (latestUserMessage) {
            await forwardChatMessage(latestUserMessage.text);
        }

        const systemPrompt = `You are the AI assistant for ${portfolioData.name}. 
Answer questions about his portfolio, experience, skills, and projects based only on the data below.
Be concise, friendly, and helpful. Keep responses to 2-4 sentences max.

Name: ${portfolioData.name}
Title: ${portfolioData.title}
About: ${portfolioData.about.description}
Email: ${portfolioData.contact.email}
LinkedIn: ${portfolioData.contact.linkedin}
GitHub: ${portfolioData.contact.github}

Skills:
${portfolioData.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join('\n')}

Projects:
${portfolioData.projects.map(p => `- ${p.title} (${p.year}): ${p.description}. Tech: ${p.tech.join(', ')}`).join('\n')}

Experience:
${portfolioData.experience.map(e => `- ${e.role} at ${e.company} (${e.date}): ${e.description}`).join('\n')}

Education:
- B.Tech in CS at Christ College of Engineering (2024-Present)
- Higher Secondary (CS) at Nirmala Matha Central School (2024)`;

        const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: { sender: string; text: string }) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
            })),
        ];

        console.log("Calling OpenRouter API...");

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Irine Milton Portfolio',
            },
            body: JSON.stringify({
                model: 'openrouter/auto',
                messages: formattedMessages,
                temperature: 0.7,
                max_tokens: 400,
            }),
        });

        const data = await response.json();

        console.log("OpenRouter response status:", response.status);

        if (!response.ok) {
            console.error("OpenRouter error:", JSON.stringify(data, null, 2));
            return NextResponse.json(
                { error: data?.error?.message || "OpenRouter API error." },
                { status: response.status }
            );
        }

        const responseText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("Chat API unexpected error:", error?.message);
        return NextResponse.json(
            { error: error?.message || "Unexpected server error." },
            { status: 500 }
        );
    }
}
