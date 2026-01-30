'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function AnalyticsTracker({ measurementId }: { measurementId: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!measurementId) return;

        const url = pathname + searchParams.toString();

        // Track page views
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('config', measurementId, {
                page_path: url,
            });
        }
    }, [pathname, searchParams, measurementId]);

    return null;
}

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
    useEffect(() => {
        if (!measurementId) return;

        // Load Google Analytics script
        const script1 = document.createElement('script');
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script1.async = true;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
                page_path: window.location.pathname,
            });
        `;
        document.head.appendChild(script2);

        return () => {
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, [measurementId]);

    return (
        <Suspense fallback={null}>
            <AnalyticsTracker measurementId={measurementId} />
        </Suspense>
    );
}

// Helper function to track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, eventParams);
    }
};
