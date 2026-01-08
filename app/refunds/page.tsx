import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Refunds",
  description: "Track refund status and processing timeline",
};

async function getRefunds() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/refunds?limit=20`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching refunds:", error);
    return null;
  }
}

export default async function RefundsPage() {
  const refundsData = await getRefunds();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Refunds</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Track your refund status and processing timeline
          </p>
        </div>

        {refundsData?.data?.length > 0 ? (
          <div className="space-y-4">
            {refundsData.data.map((refund: any) => (
              <div
                key={refund.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Refund #{refund.id}
                    </h3>
                    <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      <p>Ticket ID: {refund.ticketId}</p>
                      <p>
                        <strong>Original Amount:</strong> ${refund.originalAmount.toFixed(2)}
                      </p>
                      <p>
                        <strong>Refund Amount:</strong> ${refund.refundAmount.toFixed(2)} ({refund.refundPercentage}%)
                      </p>
                      <p>
                        <strong>Reason:</strong> {refund.reason}
                      </p>
                      <p>Created: {new Date(refund.createdAt).toLocaleString()}</p>
                      {refund.expectedCompletionDate && (
                        <p>
                          <strong>Expected Completion:</strong>{" "}
                          {new Date(refund.expectedCompletionDate).toLocaleDateString()}
                        </p>
                      )}
                      {refund.processedAt && (
                        <p>
                          <strong>Processed:</strong>{" "}
                          {new Date(refund.processedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      refund.status === "completed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : refund.status === "processing"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : refund.status === "pending"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {refund.status}
                  </span>
                </div>

                {refund.status === "processing" && refund.expectedCompletionDate && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Your refund is being processed and will be completed by{" "}
                      <strong>
                        {new Date(refund.expectedCompletionDate).toLocaleDateString()}
                      </strong>
                      .
                    </p>
                  </div>
                )}

                {refund.status === "completed" && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Refund completed successfully!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <p className="text-zinc-600 dark:text-zinc-400">
              No refunds found. Refunds for eligible cancellations will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
