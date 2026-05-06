export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="text-sm font-medium text-gray-700">AI Product Studio</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI Product Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/api/health" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              API Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
