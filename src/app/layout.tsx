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
  metadataBase: new URL('https://yash-dev.in'),
  title: {
    default: 'Yashavantha H - Creative Developer Portfolio',
    template: '%s | Yashavantha H',
  },
  description:
    'Interactive 3D portfolio showcasing creative development projects, skills, and experience. Built with Next.js, Three.js, and MediaPipe gesture controls.',
  keywords: [
    'Yashavantha H',
    'developer',
    'portfolio',
    'react',
    'next.js',
    'three.js',
    'creative',
    'interactive',
    '3D',
    'web developer',
    'frontend',
    'full stack',
    'javascript',
    'typescript',
  ],
  authors: [{ name: 'Yashavantha H', url: 'https://yash-dev.in' }],
  creator: 'Yashavantha H',
  alternates: {
    canonical: 'https://yash-dev.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yash-dev.in',
    title: 'Yashavantha H - Creative Developer Portfolio',
    description:
      'Interactive 3D portfolio with gesture controls. Explore projects, skills, and experience.',
    siteName: 'Yashavantha H Portfolio',
    images: [
      {
        url: 'https://yash-dev.in/og-image.png',
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
    images: ['https://yash-dev.in/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Yashavantha H',
              url: 'https://yash-dev.in',
              jobTitle: 'Creative Developer',
              description:
                'Creative Developer building immersive digital experiences with code, creativity, and a touch of magic.',
              sameAs: [],
              knowsAbout: [
                'React',
                'Next.js',
                'Three.js',
                'TypeScript',
                'JavaScript',
                'Node.js',
                'Web Development',
                'Frontend Development',
                'Full Stack Development',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Yashavantha H Portfolio',
              url: 'https://yash-dev.in',
              description:
                'Interactive 3D portfolio showcasing creative development projects, skills, and experience.',
            }),
          }}
        />
      </head>
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
