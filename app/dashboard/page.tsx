import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard for tickets, cancellations, and refunds",
};

async function fetchData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    const [ticketsRes, cancellationsRes, refundsRes] = await Promise.all([
      fetch(`${baseUrl}/api/tickets?limit=5`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/cancellations?limit=5`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/refunds?limit=5`, { cache: "no-store" }),
    ]);

    const tickets = ticketsRes.ok ? await ticketsRes.json() : null;
    const cancellations = cancellationsRes.ok ? await cancellationsRes.json() : null;
    const refunds = refundsRes.ok ? await refundsRes.json() : null;

    return { tickets, cancellations, refunds };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { tickets: null, cancellations: null, refunds: null };
  }
}

export default async function DashboardPage() {
  const { tickets, cancellations, refunds } = await fetchData();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Tickets</h3>
            <p className="text-3xl font-bold text-foreground">
              {tickets?.pagination?.total ?? 0}
            </p>
            <Link
              href="/tickets"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              View all →
            </Link>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Cancellations</h3>
            <p className="text-3xl font-bold text-foreground">
              {cancellations?.pagination?.total ?? 0}
            </p>
            <Link
              href="/cancellations"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              View all →
            </Link>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Refunds</h3>
            <p className="text-3xl font-bold text-foreground">
              {refunds?.pagination?.total ?? 0}
            </p>
            <Link
              href="/refunds"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
            >
              View all →
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Tickets</h2>
            {tickets?.data?.length > 0 ? (
              <ul className="space-y-3">
                {tickets.data.slice(0, 3).map((ticket: any) => (
                  <li key={ticket.id} className="text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">Ticket #{ticket.id}</p>
                        <p className="text-zinc-600 dark:text-zinc-400">Seat: {ticket.seatNumber}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          ticket.status === "confirmed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">No tickets found</p>
            )}
            <Link
              href="/tickets"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
            >
              View all tickets →
            </Link>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Cancellations</h2>
            {cancellations?.data?.length > 0 ? (
              <ul className="space-y-3">
                {cancellations.data.slice(0, 3).map((cancellation: any) => (
                  <li key={cancellation.id} className="text-sm">
                    <div>
                      <p className="font-medium text-foreground">Ticket #{cancellation.ticketId}</p>
                      <p className="text-zinc-600 dark:text-zinc-400 truncate">
                        {cancellation.reason}
                      </p>
                      {cancellation.refundEligibility && (
                        <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                          Refund: ${cancellation.refundAmount}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">No cancellations found</p>
            )}
            <Link
              href="/cancellations"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
            >
              View all cancellations →
            </Link>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Refunds</h2>
            {refunds?.data?.length > 0 ? (
              <ul className="space-y-3">
                {refunds.data.slice(0, 3).map((refund: any) => (
                  <li key={refund.id} className="text-sm">
                    <div>
                      <p className="font-medium text-foreground">Refund #{refund.id}</p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Amount: ${refund.refundAmount}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs mt-1 inline-block ${
                          refund.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : refund.status === "processing"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400"
                        }`}
                      >
                        {refund.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">No refunds found</p>
            )}
            <Link
              href="/refunds"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
            >
              View all refunds →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
