'use client';

import dynamic from 'next/dynamic';

const MainCanvas = dynamic(
  () => import('./MainCanvas').then((mod) => mod.MainCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    ),
  }
);

export function CanvasWrapper() {
  return <MainCanvas />;
}
