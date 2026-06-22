import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { ToastContainer } from '@/components/ui/Toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aura AI — Spatial Intelligence & Interior Design Optimization SaaS',
  description: 'High-fidelity spatial analysis, occupancy heatmaps, and Generative AI room optimization dashboard for modern homes and commercial spaces.',
  keywords: ['AI Interior Design', 'Spatial Analysis', 'Room Layout Optimization', 'Computer Vision SaaS', 'Japandi Design'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <ToastContainer />
        </QueryProvider>
      </body>
    </html>
  );
}
