'use client';

import dynamic from 'next/dynamic';

const MainCanvas = dynamic(
  () => import('./MainCanvas').then((mod) => mod.MainCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full" />
            <div className="absolute inset-0 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 text-sm animate-pulse">Loading experience...</p>
        </div>
      </div>
    ),
  }
);

export function CanvasWrapper() {
  return <MainCanvas />;
}
