"use client";

import { Multilang } from "./Multilang";

interface PriceBadgeProps {
  price: number | null;
  isFree?: boolean;
}

export default function PriceBadge({ price, isFree }: PriceBadgeProps) {
  const free = isFree || price === null || price === 0;

  return (
    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border ${
      free 
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
        : "bg-[#EA580C] text-[#F97316] border-[#57534E]/40 shadow-md"
    }`}>
      <span className={free ? "text-emerald-300" : "text-[#F97316]"}>
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
