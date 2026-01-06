export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-200/50 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
        {/* アプリ名 */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            日々是Progressive Overload
          </h1>
        </div>
      </div>
    </header>
  );
}

