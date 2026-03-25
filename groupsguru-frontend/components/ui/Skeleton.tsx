import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button";
}

export function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    card: "h-32 w-full rounded-[8px]",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-[8px]",
  };

  return (
    <div
      className={`bg-[#2D2D2D] animate-pulse ${variantClasses[variant]} ${className}`}
    />
  );
}
