import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ASENZO — Growth Operating System',
  description: 'ASENZO Founder Growth Operating System',
};

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground font-sans h-screen overflow-hidden selection:bg-primary selection:text-primary-foreground antialiased box-border">
        <div className="flex h-screen w-screen overflow-hidden bg-background">
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto hide-scrollbar bg-background relative flex flex-col min-w-0">
            <Topbar />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
