import DynamicLogo from '@/components/ui/DynamicLogo';
import DynamicResume from '@/components/ui/DynamicResume';
import '../src/styles/globals.css';

import Cursor from '@/components/ui/Cursor'; // Import Cursor

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased relative cursor-none"> {/* Hide default cursor */}
        <Cursor />
        <DynamicLogo />
        <DynamicResume />
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
