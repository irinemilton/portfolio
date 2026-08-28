'use client';

interface ConversationGlyphProps {
    className?: string;
}

export default function ConversationGlyph({ className = '' }: ConversationGlyphProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M5 7H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M10 17H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M8 10.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M12 10.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M16 10.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
    );
}
