import DynamicLogo from '@/components/ui/DynamicLogo';
import '../src/styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased relative">
        <DynamicLogo />
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
