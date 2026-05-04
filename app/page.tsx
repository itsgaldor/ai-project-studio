export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            AI Product Studio
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            AI-powered platform for product discovery, intake processing, and deliverable generation.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-zinc-500 dark:text-zinc-400 w-full max-w-sm">
          <a href="/api/health" className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            <span className="text-green-500">●</span>
            <span className="font-mono">GET /api/health</span>
          </a>
          <a href="/api/projects" className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            <span className="text-blue-500">●</span>
            <span className="font-mono">GET /api/projects</span>
          </a>
        </div>
        <p className="text-xs text-zinc-400">
          See <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">API.md</code> for full documentation.
        </p>
      </main>
    </div>
  );
}
