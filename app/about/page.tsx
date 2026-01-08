import type { Metadata } from "next";

export const revalidate = false;

export const metadata: Metadata = {
  title: "About",
  description: "About page using Static Site Generation (SSG)",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-foreground">About Page</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
          This page uses Static Site Generation (SSG).
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          The content is generated at build time, resulting in very fast load times
          and excellent scalability. This is ideal for pages with content that
          doesn&apos;t change frequently.
        </p>
      </div>
    </div>
  );
}
