import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cancellations",
  description: "View cancellation requests and refund eligibility",
};

async function getCancellations() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/cancellations?limit=20`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching cancellations:", error);
    return null;
  }
}

export default async function CancellationsPage() {
  const cancellationsData = await getCancellations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Cancellations</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            View your cancellation requests and refund eligibility
          </p>
        </div>

        {cancellationsData?.data?.length > 0 ? (
          <div className="space-y-4">
            {cancellationsData.data.map((cancellation: any) => (
              <div
                key={cancellation.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Cancellation #{cancellation.id}
                    </h3>
                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <p>Ticket ID: {cancellation.ticketId}</p>
                      <p>
                        <strong>Reason:</strong> {cancellation.reason}
                      </p>
                      <p>
                        <strong>Cancelled by:</strong> {cancellation.cancelledBy}
                      </p>
                      <p>
                        <strong>Policy:</strong> {cancellation.cancellationPolicy}
                      </p>
                      <p>Created: {new Date(cancellation.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cancellation.status === "processed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : cancellation.status === "pending"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {cancellation.status}
                  </span>
                </div>
                
                {cancellation.refundEligibility ? (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Refund Eligible
                        </p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-1">
                          ${cancellation.refundAmount?.toFixed(2) ?? "0.00"}
                        </p>
                      </div>
                      {cancellation.status === "processed" && (
                        <a
                          href={`/refunds?cancellationId=${cancellation.id}`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Request Refund
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Not eligible for refund
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <p className="text-zinc-600 dark:text-zinc-400">
              No cancellations found. Cancelled tickets will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
