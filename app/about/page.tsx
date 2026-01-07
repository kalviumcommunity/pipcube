export const revalidate = false;

export default function AboutPage() {
  console.log("SSG: About page rendered at build time");

  return (
    <div>
      <h1>About Page</h1>
      <p>This page uses Static Site Generation (SSG).</p>
    </div>
  );
}
