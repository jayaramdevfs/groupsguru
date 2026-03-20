"use client";

import { motion } from "framer-motion";

interface QuestionNavPanelProps {
  totalQuestions: number;
  currentIdx: number;
  onNavigate: (idx: number) => void;
  answeredIndices: number[];
  flaggedIndices: number[];
}

export default function QuestionNavPanel({ 
  totalQuestions, 
  currentIdx, 
  onNavigate, 
  answeredIndices,
  flaggedIndices
}: QuestionNavPanelProps) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] w-full backdrop-blur-xl">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 italic">Question Navigator</h3>
      
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIdx;
          const isAnswered = answeredIndices.includes(idx);
          const isFlagged = flaggedIndices.includes(idx);

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(idx)}
              className={`w-10 h-10 rounded-xl font-black italic text-xs transition-all border ${
                isCurrent 
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20" 
                  : isAnswered 
                    ? "bg-green-500/10 border-green-500/20 text-green-400" 
                    : isFlagged
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                      : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              {idx + 1}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
        <StatusKey color="bg-green-400" label="Answered" />
        <StatusKey color="bg-yellow-500" label="Marked for Review" />
        <StatusKey color="bg-white/5 border-white/10" label="Not Visited" />
      </div>
    </div>
  );
}

function StatusKey({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">{label}</span>
    </div>
  );
}
