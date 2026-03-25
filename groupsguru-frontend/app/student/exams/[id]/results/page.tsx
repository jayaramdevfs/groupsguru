"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { attemptsApi } from "@/lib/attempts";
import { ExamResult, QuestionResult, TopicAnalytics } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";

const spring = {  duration: 0.25, ease: "easeOut" as const };

export default function ExamResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // We need the attemptId. In a real app, we might pass it as a query param or fetch the latest attempt.
        // For now, let's assume the user just finished an attempt.
        // If we don't have attemptId, we can get the latest attempt for this exam.
        const myAttempts = await attemptsApi.getMyAttempts();
        const latestAttempt = myAttempts.find(a => a.examId === Number(id));
        
        if (latestAttempt) {
          const res = await attemptsApi.getResult(latestAttempt.id);
          setResult(res);
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#1C1917] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-[#1C1917] flex flex-col items-center justify-center p-6 text-center">
       <h1 className="text-4xl font-semibold mb-4">No Results Found</h1>
       <button 
          onClick={() => router.push("/student/dashboard")}
          className="px-8 py-4 bg-[#EA580C] rounded-2xl font-semibold"
       >
          Back to Dashboard
       </button>
    </div>
  );

  const { attempt, questions, topicAnalytics } = result;
  const maxMarks = questions.length; // Assuming 1 mark per question for simplicity in UI display

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="min-h-screen pt-10 pb-16 px-6 md:px-12 w-full max-w-[95%] mx-auto space-y-6 text-[#FAFAF9]">
        
        {/* Hero Section: Circular Progress & Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 border border-[#57534E]/40 p-8 rounded-[40px]  shadow-2xl shadow-orange-500/10">
           <div className="flex justify-center">
              <CircularProgress 
                percentage={((attempt.correctCount || 0) / questions.length) * 100} 
                score={attempt.totalMarks || 0}
                total={maxMarks}
              />
           </div>
           <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-[#F97316]">Exam Analysis</h1>
              <p className="text-[#FAFAF9]/50 font-bold  text-base leading-relaxed">
                Great job! You've completed the exam. Here's a detailed breakdown of your performance across different topics.
              </p>
              <div className="grid grid-cols-3 gap-3">
                 <StatCard label="Correct" value={attempt.correctCount || 0} color="emerald" />
                 <StatCard label="Wrong" value={attempt.wrongCount || 0} color="red" />
                 <StatCard label="Skipped" value={attempt.unattemptedCount || 0} color="zinc" />
              </div>
           </div>
        </div>

        {/* Topic Breakdown */}
        <div className="space-y-8">
           <h2 className="text-3xl font-semibold px-4">Topic Performance</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topicAnalytics.map((topic, i) => (
                <TopicCard key={i} topic={topic} index={i} />
              ))}
           </div>
        </div>

        {/* Question Review */}
        <div className="space-y-8">
           <h2 className="text-3xl font-semibold px-4">Question Review</h2>
           <div className="space-y-6">
              {questions.map((qr, i) => (
                <QuestionReviewCard key={i} qr={qr} index={i} />
              ))}
           </div>
        </div>

        <div className="flex justify-center pt-12">
           <button 
              onClick={() => router.push("/student/dashboard")}
              className="px-12 py-5 bg-[#EA580C] rounded-3xl font-semibold shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all text-xl"
           >
              Return to Dashboard
           </button>
        </div>

      </div>
    </ProtectedLayout>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    zinc: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
  };
  return (
    <div className={`p-4 rounded-2xl border text-center ${colors[color]}`}>
       <div className="text-2xl font-semibold mb-1">{value}</div>
       <div className="text-[8px] font-bold uppercase tracking-widest opacity-60 ">{label}</div>
    </div>
  );
}

function CircularProgress({ percentage, score, total }: { percentage: number, score: number, total: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
 
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
       <svg className="w-full h-full transform -rotate-90">
          <circle 
            cx="96" cy="96" r={radius} 
            stroke="currentColor" strokeWidth="12" fill="transparent"
            className="text-[#FAFAF9]/5"
          />
          <motion.circle 
            cx="96" cy="96" r={radius} 
            stroke="url(#gradient)" strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" as const }}
            strokeLinecap="round"
          />
          <defs>
             <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#F97316" />
             </linearGradient>
          </defs>
       </svg>
       <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-4xl font-semibold text-[#F97316]"
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-[#FAFAF9]/40 font-semibold text-[9px] uppercase tracking-widest mt-1">of {total} marks</span>
       </div>
    </div>
  );
}

function TopicCard({ topic, index }: { topic: TopicAnalytics, index: number }) {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 border border-[#57534E]/40 p-5 rounded-3xl hover:bg-white/[0.08] transition-all group"
    >
       <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold  text-[#FAFAF9]/90 group-hover:text-[#FAFAF9] transition-colors uppercase tracking-tight">{topic.topicName}</h3>
          <div className="text-xl font-semibold text-[#F97316]">{topic.hitRate.toFixed(0)}%</div>
       </div>
       <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-5">
          <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${topic.hitRate}%` }}
             className="h-full bg-[#EA580C] rounded-full"
          />
       </div>
       <div className="flex justify-between font-semibold text-[9px] uppercase tracking-widest text-[#FAFAF9]/40">
          <span>{topic.correctCount} C</span>
          <span>{topic.wrongCount} W</span>
          <span>{topic.unattemptedCount} S</span>
       </div>
    </motion.div>
  );
}

function QuestionReviewCard({ qr, index }: { qr: QuestionResult, index: number }) {
  const isSelected = !!qr.selectedOption;
  const isCorrect = qr.isCorrect;
  
  const borderColor = isCorrect ? "border-emerald-500/30 bg-emerald-500/[0.02]" : !isSelected ? "border-[#57534E]/40 bg-white/5" : "border-red-500/30 bg-red-500/[0.02]";
 
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 + (index * 0.1) }}
      className={`p-6 md:p-8 rounded-xl border ${borderColor}  space-y-4`}
    >
       <div className="flex justify-between items-start">
          <div className="space-y-1">
             <div className="text-[9px] font-bold uppercase tracking-widest text-[#FAFAF9]/40 ">Question {index + 1}</div>
             <h3 className="text-base font-bold  leading-relaxed">
                <Multilang en={qr.question.questionTextEn} te={qr.question.questionTextTe} />
             </h3>
          </div>
          {qr.isCorrect !== null && (
             <div className={`px-3 py-1.5 rounded-lg font-semibold text-[10px] uppercase tracking-widest ${isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                {isCorrect ? "Correct" : "Incorrect"}
             </div>
          )}
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ReviewOption label="A" en={qr.question.optionAEn} te={qr.question.optionATe} selected={qr.selectedOption === 'A'} correct={qr.question.correctOption === 'A'} />
          <ReviewOption label="B" en={qr.question.optionBEn} te={qr.question.optionBTe} selected={qr.selectedOption === 'B'} correct={qr.question.correctOption === 'B'} />
          <ReviewOption label="C" en={qr.question.optionCEn} te={qr.question.optionCTe} selected={qr.selectedOption === 'C'} correct={qr.question.correctOption === 'C'} />
          <ReviewOption label="D" en={qr.question.optionDEn} te={qr.question.optionDTe} selected={qr.selectedOption === 'D'} correct={qr.question.correctOption === 'D'} />
       </div>
 
       {(qr.question.explanationEn || qr.question.explanationTe) && (
          <div className="p-5 bg-white/5 border border-[#57534E]/40 rounded-2xl space-y-2">
             <div className="text-[9px] font-bold uppercase tracking-widest text-[#F97316] ">Explanation</div>
             <div className="text-[#FAFAF9]/50 font-bold  text-sm leading-relaxed">
                <Multilang en={qr.question.explanationEn || ""} te={qr.question.explanationTe || ""} />
             </div>
          </div>
       )}
    </motion.div>
  );
}

function ReviewOption({ label, en, te, selected, correct }: { label: string, en: string, te: string, selected: boolean, correct: boolean }) {
  let style = "bg-white/5 border-[#57534E]/40";
  if (correct) style = "bg-emerald-500/20 border-emerald-500/50 ring-2 ring-emerald-500/20";
  else if (selected && !correct) style = "bg-red-500/20 border-red-500/50";
 
  return (
    <div className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${style}`}>
       <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-xs shrink-0 ${
          correct ? "bg-emerald-500 text-[#FAFAF9]" : selected ? "bg-red-500 text-[#FAFAF9]" : "bg-white/5 text-[#FAFAF9]/40"
       }`}>
          {label}
       </div>
       <div>
          <div className="font-semibold  text-[#FAFAF9]/90 text-sm">{en}</div>
          <div className="text-[9px] font-bold mt-1 text-[#FAFAF9]/40">{te}</div>
       </div>
    </div>
  );
}
