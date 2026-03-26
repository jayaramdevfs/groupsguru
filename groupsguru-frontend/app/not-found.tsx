import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#191919] text-[#E8E8E8] px-4 text-center">
      <h1 className="font-serif text-8xl mb-4 text-[#D97706]">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="max-w-md text-[#A0A0A0] mb-10">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-white rounded-md transition-colors font-medium border border-[#3A3A3A]"
      >
        Go Back Home
      </Link>
    </div>
  );
}
