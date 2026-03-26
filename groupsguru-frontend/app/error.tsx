'use strict';
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#191919] text-[#E8E8E8] px-4 text-center">
      <h1 className="font-serif text-6xl mb-4 text-[#C74444]">Error</h1>
      <h2 className="text-2xl font-semibold mb-6">Something went wrong!</h2>
      <p className="max-w-md text-[#A0A0A0] mb-10">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-white rounded-md transition-colors font-medium border border-[#3A3A3A]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-8 py-3 bg-transparent border border-[#3A3A3A] hover:bg-[#2D2D2D] text-[#E8E8E8] rounded-md transition-colors font-medium"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
