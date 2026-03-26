"use client";

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
    <div className="w-full">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = idx === currentIdx;
          const isAnswered = answeredIndices.includes(idx);
          const isFlagged = flaggedIndices.includes(idx);

          let style = "bg-[#141414] border-[#3A3A3A] text-[#666666] hover:border-[#A0A0A0]";
          if (isCurrent) style = "bg-[#D97706] border-[#D97706] text-white shadow-lg shadow-[#D97706]/10";
          else if (isAnswered) style = "bg-[#3D9A5F]/10 border-[#3D9A5F]/30 text-[#3D9A5F]";
          else if (isFlagged) style = "bg-[#C4901A]/10 border-[#C4901A]/30 text-[#C4901A]";

          return (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`w-full aspect-square rounded flex items-center justify-center font-mono font-bold text-[11px] transition-all border ${style}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-[#3A3A3A] space-y-3">
        <StatusKey color="bg-[#3D9A5F]" label="Answered" />
        <StatusKey color="bg-[#C4901A]" label="Marked" />
        <StatusKey color="bg-[#141414] border-[#3A3A3A]" label="Not Visited" />
      </div>
    </div>
  );
}

function StatusKey({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-sm border border-[#3A3A3A] ${color}`} />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#666666] font-mono">{label}</span>
    </div>
  );
}
