import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
      <div className="absolute top-40 right-40 w-44 h-44 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed" />
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-slow" />

      {/* Main Glass Panel */}
      <div className="glass-panel relative w-full max-w-6xl rounded-3xl p-8 md:p-12 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-indigo-900 bg-indigo-100 rounded-full">
              PIPcube System
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 heading-gradient">
              Dashboard <br /> Interface
            </h1>
            <p className="text-lg text-slate-600 max-w-md">
              Transparent, accountable, and rule-based cancellation & refund management.
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-6 md:mt-0">
            <button className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl shadow-lg hover:shadow-xl hover:from-violet-600 hover:to-indigo-600 transition-all duration-200 transform hover:-translate-y-1">
              <span>View Documentation</span>
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
          </div>
        </div>

        {/* Dashboard Grid (Floating Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

          <Link href="/tickets" className="glass-card group block p-6 rounded-2xl">
            <div className="w-12 h-12 mb-4 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🎫
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Tickets</h2>
            <p className="text-sm text-slate-500 mb-4">View and manage your bus tickets</p>
            <div className="flex items-center text-sm font-semibold text-blue-600">
              Access <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          <Link href="/dashboard" className="glass-card group block p-6 rounded-2xl lg:translate-y-8">
            {/* Translate-y for staggered look */}
            <div className="w-12 h-12 mb-4 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📊
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Dashboard</h2>
            <p className="text-sm text-slate-500 mb-4">Overview of cancellations & refunds</p>
            <div className="flex items-center text-sm font-semibold text-violet-600">
              View Stats <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          <Link href="/cancellations" className="glass-card group block p-6 rounded-2xl">
            <div className="w-12 h-12 mb-4 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ❌
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Cancellations</h2>
            <p className="text-sm text-slate-500 mb-4">Request and track cancellations</p>
            <div className="flex items-center text-sm font-semibold text-pink-600">
              Manage <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          <Link href="/refunds" className="glass-card group block p-6 rounded-2xl lg:translate-y-8">
            <div className="w-12 h-12 mb-4 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Refunds</h2>
            <p className="text-sm text-slate-500 mb-4">Check status and eligibility</p>
            <div className="flex items-center text-sm font-semibold text-emerald-600">
              Track <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        </div>

        {/* Info / Policy Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm border border-white/60">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
              Policy Highlights
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex justify-between">
                <span>24+ hrs before</span>
                <span className="font-semibold text-green-600">80% Refund</span>
              </li>
              <li className="flex justify-between">
                <span>2-24 hrs before</span>
                <span className="font-semibold text-yellow-600">50% Refund</span>
              </li>
              <li className="flex justify-between">
                <span>&lt; 2 hrs before</span>
                <span className="font-semibold text-red-500">No Refund</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm border border-white/60">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-violet-500 mr-2"></span>
              System Features
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-violet-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Traceable cancellation reasons
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-violet-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Automated eligibility checks
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-violet-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Operator accountability logs
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
