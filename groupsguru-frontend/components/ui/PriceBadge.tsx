"use client";

import { Multilang } from "./Multilang";

interface PriceBadgeProps {
  price: number | null;
  isFree?: boolean;
}

export default function PriceBadge({ price, isFree }: PriceBadgeProps) {
  const free = isFree || price === null || price === 0;

  return (
    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 border ${
      free 
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
        : "bg-purple-600/20 text-purple-400 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
    }`}>
      <span className={free ? "text-emerald-300" : "text-purple-300"}>
        {free ? "✓" : "⚡"}
      </span>
      {free ? (
        <Multilang en="Free Access" te="ఉచితం" />
      ) : (
        <span className="flex items-center gap-1">
          <Multilang en="Premium" te="ప్రీమియం" /> · ₹{price}
        </span>
      )}
    </div>
  );
}
