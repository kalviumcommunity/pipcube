
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">PIPcube</span>
        </h1>

        <p className="mt-3 text-2xl">
          Complete Cancellation, Refund & Routing Demo
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Authentication &rarr;</h3>
            <p className="mt-4 text-xl">
              <Link href="/login" className="text-blue-500 underline">Login</Link> to access protected routes.
            </p>
          </div>

          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Protected Dashboard &rarr;</h3>
            <p className="mt-4 text-xl">
              View your <Link href="/dashboard" className="text-blue-500 underline">Dashboard</Link> (Requires Login).
            </p>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        Powered by Next.js App Router
      </footer>
    </div>
  );
}
