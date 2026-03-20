"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 transition-colors ${
      isCritical ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
    }`}>
      <span className="text-[10px] font-black uppercase tracking-widest italic">Time Left</span>
      <span className="font-mono text-xl font-black tabular-nums">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      {isCritical && (
        <motion.div 
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-red-500"
        />
      )}
    </div>
  );
}
