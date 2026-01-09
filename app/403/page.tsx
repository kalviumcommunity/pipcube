
import Link from 'next/link';

export default function Forbidden() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold text-red-600">403</h1>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Access Denied</h2>
            <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>

            <div className="mt-8">
                <Link href="/dashboard" className="text-blue-600 hover:underline">
                    &larr; Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
