"use client";

import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export default function TypographyPreview() {
  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-16">

      <h1 className="text-4xl font-bold text-center">
        Typography Comparison Preview
      </h1>

      {/* Inter */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-purple-400">
          1️⃣ Inter (Premium SaaS Style)
        </h2>
        <div className={`${inter.className} space-y-2`}>
          <h1 className="text-4xl font-extrabold">
            PREMIUM LMS PLATFORM
          </h1>
          <p className="text-lg font-semibold">
            Smooth, modern, clean interface for enterprise systems.
          </p>
        </div>
      </div>

      {/* Roboto Mono */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-pink-400">
          2️⃣ Roboto Mono (Monospace / Robot Style)
        </h2>
        <div className={`${robotoMono.className} space-y-2`}>
          <h1 className="text-4xl font-bold">
            PREMIUM LMS PLATFORM
          </h1>
          <p className="text-lg">
            Clean technical terminal-like appearance.
          </p>
        </div>
      </div>

      {/* System Font */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-400">
          3️⃣ System UI (iPhone-like)
        </h2>
        <div className="space-y-2 font-semibold">
          <h1 className="text-4xl">
            PREMIUM LMS PLATFORM
          </h1>
          <p className="text-lg">
            Apple-style clean modern typography feel.
          </p>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}