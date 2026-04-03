import DynamicLogo from '@/components/ui/DynamicLogo';
import DynamicResume from '@/components/ui/DynamicResume';
import NavigationMenu from '@/components/ui/NavigationMenu';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import '../src/styles/globals.css';
import { Inter, Outfit } from 'next/font/google';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

import Cursor from '@/components/ui/Cursor';
import SharedChat from '@/components/ui/SharedChat';
import { siteMetadata, jsonLd } from '@/lib/metadata';

export const metadata = siteMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} bg-black text-white antialiased relative cursor-none`}>
        {/* JSON-LD for structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Cursor />
        <DynamicLogo />
        <DynamicResume />
        <NavigationMenu />
        <ServiceWorkerRegistration />
        <GoogleAnalytics measurementId="G-49XKMX0FSN" />

        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <Image
            src="/backsucces.jpg"
            alt="Background"
            fill
            priority
            className="object-cover fixed"
            sizes="100vw"
            quality={85}
          />
        </div>
        {children}
        <SharedChat />
      </body>
    </html>
  );
}
