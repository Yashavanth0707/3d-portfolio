export function Footer() {
  return (
    <footer className="relative z-10 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Yashavantha H. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
