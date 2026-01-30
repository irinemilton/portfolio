import DynamicLogo from '@/components/ui/DynamicLogo';
import DynamicResume from '@/components/ui/DynamicResume';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import '../src/styles/globals.css';

import Cursor from '@/components/ui/Cursor';
import { siteMetadata, jsonLd } from '@/lib/metadata';

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased relative cursor-none">
        {/* JSON-LD for structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Cursor />
        <DynamicLogo />
        <DynamicResume />
        <ThemeToggle />
        <ServiceWorkerRegistration />
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />

        <div
          style={{
            backgroundImage: "url('/backsucces.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none'
          }}
        />
        {children}
      </body>
    </html>
  );
}
