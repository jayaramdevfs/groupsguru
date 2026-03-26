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
        ? "bg-[#3D9A5F]/10 text-[#3D9A5F] border-[#3D9A5F]/20" 
        : "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20"
    }`}>
      <span className={free ? "text-[#3D9A5F]/70" : "text-[#D97706]/70"}>
        {free ? "✓" : "⚡"}
      </span>
      {free ? (
        <Multilang en="Free Access" te="ఉచితం" />
      ) : (
        <span className="flex items-center gap-1 font-mono">
          <Multilang en="Premium" te="ప్రీమియం" /> · ₹{price}
        </span>
      )}
    </div>
  );
}
