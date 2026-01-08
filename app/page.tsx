import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            PIPcube Bus Ticket System
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Transparent, accountable, and rule-based cancellation & refund management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/tickets"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Tickets
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              View and manage your bus tickets
            </p>
            <span className="text-sm font-medium text-foreground hover:underline">
              View Tickets →
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Dashboard
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Overview of your tickets, cancellations, and refunds
            </p>
            <span className="text-sm font-medium text-foreground hover:underline">
              View Dashboard →
            </span>
          </Link>

          <Link
            href="/cancellations"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Cancellations
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Request ticket cancellations with transparent refund eligibility
            </p>
            <span className="text-sm font-medium text-foreground hover:underline">
              View Cancellations →
            </span>
          </Link>

          <Link
            href="/refunds"
            className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-3 text-foreground">
              Refunds
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Track refund status and processing timeline
            </p>
            <span className="text-sm font-medium text-foreground hover:underline">
              View Refunds →
            </span>
          </Link>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">
            About This System
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            PIPcube brings transparency and accountability to intercity bus ticket cancellations and refunds. 
            The system ensures:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>Clear refund rules</strong>: Know exactly how much refund you&apos;re eligible for
            </li>
            <li>
              <strong>Traceable cancellations</strong>: Every cancellation has a documented reason
            </li>
            <li>
              <strong>Refund transparency</strong>: See refund amount, eligibility, and processing timeline
            </li>
            <li>
              <strong>Operator accountability</strong>: Structured data and logs ensure policy compliance
            </li>
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-3 text-foreground">
            Cancellation Policy
          </h4>
          <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>• <strong>24+ hours before departure</strong>: 80% refund</li>
            <li>• <strong>2-24 hours before departure</strong>: 50% refund</li>
            <li>• <strong>Less than 2 hours before departure</strong>: No refund</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
