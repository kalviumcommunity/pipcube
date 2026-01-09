
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <h1 className="text-9xl font-bold text-gray-800">404</h1>
            <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
                Page Not Found
            </div>
            <div className="mt-5 text-center">
                <p className="text-gray-600 text-xl font-medium mb-8">The page you are looking for does not exist.</p>
                <Link href="/" className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring">
                    <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                    <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
                        Go Home
                    </span>
                </Link>
            </div>
        </div>
    );
}
