import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { GestureProvider } from '@/providers/GestureProvider';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/ui/SkipLink';
import { CanvasWrapper } from '@/components/three/canvas/CanvasWrapper';
import { MusicPrompt } from '@/components/ui/MusicPrompt';
import { MusicPlayer } from '@/components/ui/MusicPlayer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'Yashavantha H - Creative Developer Portfolio',
    template: '%s | Yashavantha H',
  },
  description:
    'Interactive 3D portfolio showcasing creative development projects, skills, and experience. Built with Next.js, Three.js, and MediaPipe gesture controls.',
  keywords: [
    'developer',
    'portfolio',
    'react',
    'three.js',
    'creative',
    'interactive',
    '3D',
    'web developer',
    'frontend',
    'full stack',
  ],
  authors: [{ name: 'Yashavantha H' }],
  creator: 'Yashavantha H',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yashavanthah.dev',
    title: 'Yashavantha H - Creative Developer Portfolio',
    description:
      'Interactive 3D portfolio with gesture controls. Explore projects, skills, and experience.',
    siteName: 'Yashavantha H Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yashavantha H Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yashavantha H - Creative Developer Portfolio',
    description:
      'Interactive 3D portfolio with gesture controls. Explore projects, skills, and experience.',
    creator: '@yashavanthah',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-[#0a0a0a] text-white overflow-x-hidden`}
      >
        <GestureProvider>
          <MusicPrompt />
          <SkipLink />
          <Header />
          <Navigation />
          <CanvasWrapper />
          {children}
          <Footer />
          <MusicPlayer />
        </GestureProvider>
      </body>
    </html>
  );
}
