import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Welcome to PIPcube
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            A Next.js application demonstrating different rendering strategies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Static (SSG)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Generated at build time for maximum performance
            </p>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:underline"
            >
              View About Page →
            </Link>
          </div>

          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Dynamic (SSR)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Rendered on every request for fresh data
            </p>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground hover:underline"
            >
              View Dashboard →
            </Link>
          </div>

          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Hybrid (ISR)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Static with periodic revalidation
            </p>
            <Link
              href="/news"
              className="text-sm font-medium text-foreground hover:underline"
            >
              View News Page →
            </Link>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">
            About This Project
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            This project demonstrates three different Next.js rendering
            strategies:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Static Site Generation (SSG)</strong>: Pages are
              pre-rendered at build time
            </li>
            <li>
              <strong>Server-Side Rendering (SSR)</strong>: Pages are rendered
              on each request
            </li>
            <li>
              <strong>Incremental Static Regeneration (ISR)</strong>: Static
              pages with periodic updates
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
