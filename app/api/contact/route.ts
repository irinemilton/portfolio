import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        const clientId = process.env.GMAIL_CLIENT_ID;
        const clientSecret = process.env.GMAIL_CLIENT_SECRET;
        const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
        const recipient = process.env.GMAIL_RECIPIENT;

        if (!clientId || !clientSecret || !refreshToken || !recipient) {
            console.error('Missing Gmail environment variables.');

            return NextResponse.json(
                {
                    success: false,
                    message: 'Email service is not configured.',
                },
                { status: 500 }
            );
        }

        const oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        const gmail = google.gmail({
            version: 'v1',
            auth: oauth2Client,
        });

        const subject = `Portfolio Contact: ${name}`;

        const emailBody = [
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            'Message:',
            message,
        ].join('\n');

        const rawMessage = [
            `To: ${recipient}`,
            `From: ${recipient}`,
            `Reply-To: ${email}`,
            `Subject: ${subject}`,
            'Content-Type: text/plain; charset=utf-8',
            '',
            emailBody,
        ].join('\r\n');

        const encodedMessage = Buffer.from(rawMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully.',
        });
    } catch (error) {
        console.error('Gmail API Error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Could not send your message. Please try again.',
            },
            { status: 500 }
        );
    }
}
