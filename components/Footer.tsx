export default function Footer() {
  return (
    <footer className="mt-16 border-t border-orange-200/50 bg-white/50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center gap-4 text-sm text-gray-600 md:flex-row md:justify-center">
          <a
            href="/terms-of-service"
            className="hover:text-orange-600 transition-colors"
          >
            利用規約
          </a>
          <span className="hidden md:inline">|</span>
          <a
            href="/privacy-policy"
            className="hover:text-orange-600 transition-colors"
          >
            プライバシーポリシー
          </a>
          <span className="hidden md:inline">|</span>
          <p className="text-gray-500">
            © 2024 日々是Progressive Overload
          </p>
        </div>
      </div>
    </footer>
  );
}

