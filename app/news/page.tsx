import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description: "News page using Incremental Static Regeneration (ISR)",
};

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-foreground">News</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
          This page uses Incremental Static Regeneration (ISR).
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          The page is statically generated but revalidated every 60 seconds. This
          balances performance with data freshness, making it ideal for news or
          event-based content.
        </p>
      </div>
    </div>
  );
}
