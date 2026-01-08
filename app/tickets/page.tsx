import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tickets",
  description: "View and manage your bus tickets",
};

async function getTickets() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/tickets?limit=20`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return null;
  }
}

export default async function TicketsPage() {
  const ticketsData = await getTickets();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Tickets</h1>
        </div>

        {ticketsData?.data?.length > 0 ? (
          <div className="space-y-4">
            {ticketsData.data.map((ticket: any) => (
              <div
                key={ticket.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Ticket #{ticket.id}
                    </h3>
                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <p>Seat Number: {ticket.seatNumber}</p>
                      <p>Price: ${ticket.price.toFixed(2)}</p>
                      <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ticket.status === "confirmed"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    {ticket.status === "confirmed" && (
                      <a
                        href={`/cancellations?ticketId=${ticket.id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Cancel Ticket
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <p className="text-zinc-600 dark:text-zinc-400">
              No tickets found. Tickets will appear here once booked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
