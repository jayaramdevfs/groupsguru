"use client";

import { useEffect, useState } from "react";

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isCritical = timeLeft < 300; // less than 5 minutes

  return (
    <div className={`px-4 py-2 rounded border flex items-center gap-4 transition-colors ${
      isCritical 
        ? "bg-red-500/10 border-red-500/30 text-red-500" 
        : "bg-[#1E1E1E] border-[#3A3A3A] text-[#E8E8E8]"
    }`}>
      <div className="flex flex-col">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-40 leading-none mb-1 font-mono">Time Remaining</span>
        <span className="font-mono text-xl font-bold tabular-nums leading-none">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      {isCritical && (
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20" />
      )}
    </div>
  );
}
