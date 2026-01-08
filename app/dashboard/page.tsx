import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard page using Server-Side Rendering (SSR)",
};

export default async function DashboardPage() {
  // Example: Fetch data on every request
  // In a real application, replace this with your actual API endpoint
  let data = null;
  let error = null;

  try {
    // Uncomment and replace with your actual API endpoint
    // const response = await fetch("https://api.example.com/data", {
    //   cache: "no-store",
    // });
    // data = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch data";
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-foreground">Dashboard</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
          This page uses Server-Side Rendering (SSR).
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
          The page is rendered on every request, ensuring data freshness. This is
          ideal for dashboards and analytics that require real-time or frequently
          changing data.
        </p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        )}
        {data && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-600 dark:text-green-400">
              Data loaded successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
