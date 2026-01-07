export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  console.log("SSR: Dashboard rendered on every request");

  await fetch("https://api.example.com/data", {
    cache: "no-store",
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>This page uses Server-Side Rendering (SSR).</p>
    </div>
  );
}
