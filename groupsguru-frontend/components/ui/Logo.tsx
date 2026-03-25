import React from "react";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  showWordmark?: boolean;
}

export function Logo({ size = "md", showWordmark = true }: LogoProps) {
  const sizeMap = {
    sm: { svg: "w-5 h-5", text: "text-base", gap: "gap-1.5" },
    md: { svg: "w-7 h-7", text: "text-xl", gap: "gap-2" },
    lg: { svg: "w-10 h-10", text: "text-3xl", gap: "gap-2.5" },
  };

  const { svg, text, gap } = sizeMap[size];

  return (
    <div className={`flex items-center ${gap}`}>
      {/* Geometric G mark — concentric arcs evoking hierarchy levels */}
      <svg
        className={`${svg} text-[#D97706]`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer arc */}
        <path
          d="M32 20c0 6.627-5.373 12-12 12S8 26.627 8 20 13.373 8 20 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Middle arc */}
        <path
          d="M28 20c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Inner arc */}
        <path
          d="M24 20c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        {/* Horizontal bar of G */}
        <line
          x1="20"
          y1="20"
          x2="32"
          y2="20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <div
          className={`${text} tracking-tight`}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="text-[#E8E8E8]">Groups</span>
          <span className="text-[#D97706]">Guru</span>
        </div>
      )}
    </div>
  );
}
