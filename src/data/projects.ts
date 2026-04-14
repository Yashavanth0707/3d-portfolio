import type { Project } from '@/types/portfolio.types';

export const projects: Project[] = [
  {
    id: 'instant-web-chat',
    title: 'Instant Web Chat',
    description: 'Real-time chat application with WebSocket-powered instant messaging',
    longDescription:
      'A full-featured real-time chat application built with React 19 and Socket.io. Features instant message delivery via WebSockets, persistent chat history using IndexedDB, smooth routing with React Router, and a polished UI built with Styled Components. Data fetching and caching are handled efficiently with TanStack Query, and forms are managed with React Hook Form for a seamless user experience.',
    image: '/instant-web-chat-img.png',
    tags: ['React', 'TypeScript', 'Socket.io', 'TanStack Query', 'Styled Components', 'IndexedDB'],
    link: 'https://instant-web-chat-frontend-pyhl.vercel.app/',
    github: 'https://github.com/Yashavanth0707/instant-web-chat-frontend/',
    color: '#a855f7',
  },
  {
    id: 'subtitle-translator',
    title: 'Subtitle Translator Extension',
    description: 'Browser extension that translates subtitles on Netflix and Prime Video in real time',
    longDescription:
      'A browser extension that intercepts and translates subtitles on streaming platforms like Netflix and Amazon Prime Video, allowing users to watch any content in their preferred language. Built with React for the extension popup UI, content scripts to intercept subtitle payloads, and Styled Components for isolated, scoped styling — all without disrupting the native streaming experience.',
    image: '',
    tags: ['React', 'JavaScript', 'Content Script', 'Styled Components', 'Browser Extension'],
    github: 'https://github.com/Yashavanth0707/subtitle-translator',
    color: '#22d3ee',
  },
  {
    id: 'video-downloader',
    title: 'Any Video Downloader',
    description: 'Browser extension + Node.js backend for downloading videos from 1000+ sites',
    longDescription:
      'A browser extension paired with a Node.js/Express backend that leverages yt-dlp to download videos from over 1000 supported websites. The React-based extension popup lets users trigger downloads directly from the browser, while the Express server handles format selection, quality options, and streams the downloaded content back — providing a seamless one-click download experience for any yt-dlp supported platform.',
    image: '',
    tags: ['React', 'Node.js', 'Express.js', 'yt-dlp', 'Browser Extension'],
    github: 'https://github.com/Yashavanth0707/any-video-downloader',
    color: '#f472b6',
  },
];
