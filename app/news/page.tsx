export const revalidate = 60;

export default function NewsPage() {
  console.log("ISR: News page revalidated");

  return (
    <div>
      <h1>News</h1>
      <p>This page uses Incremental Static Regeneration (ISR).</p>
    </div>
  );
}
