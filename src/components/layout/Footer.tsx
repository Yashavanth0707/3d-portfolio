'use client';

export function Footer() {
  return (
    <footer className="relative z-10 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Yashavantha H. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm">
            Built with Next.js, Three.js & MediaPipe
          </p>
        </div>
      </div>
    </footer>
  );
}
