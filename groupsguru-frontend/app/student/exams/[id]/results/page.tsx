"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { attemptsApi } from "@/lib/attempts";
import { ExamResult, QuestionResult, TopicAnalytics } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";
import Link from "next/link";

export default function ExamResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
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
    <div className="min-h-screen bg-[#191919] flex items-center justify-center">
       <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-[#191919] flex flex-col items-center justify-center p-6 text-center">
       <h1 className="text-4xl font-serif text-[#E8E8E8] mb-4">No Results Found</h1>
       <button 
          onClick={() => router.push("/student/dashboard")}
          className="px-8 py-3 bg-[#D97706] border border-[#D97706] rounded text-white font-bold uppercase tracking-widest text-xs hover:bg-[#F59E0B] transition-colors"
       >
          Back to Dashboard
       </button>
    </div>
  );

  const { attempt, questions, topicAnalytics } = result;
  const maxMarks = questions.length;

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[900px] mx-auto py-12 px-6 space-y-12">
        
        {/* Back Hook */}
        <Link
          href="/student/exams"
          className="inline-flex items-center gap-2 text-[#D97706] text-[10px] font-bold uppercase tracking-widest hover:text-[#F59E0B] transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Practice Center
        </Link>

        {/* Hero Section: Circular Progress & Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-[#1E1E1E] border border-[#3A3A3A] p-10 rounded-lg">
           <div className="flex justify-center">
              <CircularProgress 
                percentage={((attempt.correctCount || 0) / questions.length) * 100} 
                score={attempt.totalMarks || 0}
                total={maxMarks}
              />
           </div>
           <div className="space-y-6">
              <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-widest">
                Attempt Analysis
              </div>
              <h1 className="text-4xl font-serif text-[#E8E8E8]">Exam <span className="text-[#D97706]">Performance</span></h1>
              <p className="text-[#A0A0A0] leading-relaxed">
                <Multilang 
                  en="Review your results below to identify your strengths and areas for improvement." 
                  te="మీ బలాలు మరియు మెరుగుపరచవలసిన అంశాలను గుర్తించడానికి క్రింద మీ ఫలితాలను సమీక్షించండి." 
                />
              </p>
              <div className="grid grid-cols-3 gap-2">
                 <StatCard label="Correct" value={attempt.correctCount || 0} type="correct" />
                 <StatCard label="Wrong" value={attempt.wrongCount || 0} type="wrong" />
                 <StatCard label="Skipped" value={attempt.unattemptedCount || 0} type="skipped" />
              </div>
           </div>
        </div>

        {/* Topic Breakdown */}
        <div className="space-y-6">
           <h2 className="text-2xl font-serif text-[#E8E8E8] pb-4 border-b border-[#3A3A3A]">Topic Breakdown</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicAnalytics.map((topic, i) => (
                <TopicCard key={i} topic={topic} />
              ))}
           </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
           <h2 className="text-2xl font-serif text-[#E8E8E8] pb-4 border-b border-[#3A3A3A]">Detailed Review</h2>
           <div className="space-y-4">
              {questions.map((qr, i) => (
                <QuestionReviewCard key={i} qr={qr} index={i} />
              ))}
           </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
           <button 
              onClick={() => router.push("/student/dashboard")}
              className="inline-flex items-center gap-3 px-12 py-4 bg-[#D97706] border border-[#D97706] rounded text-white font-bold uppercase tracking-widest text-xs hover:bg-[#F59E0B] transition-colors"
           >
              Return to Dashboard
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
           </button>
        </div>

      </div>
    </ProtectedLayout>
  );
}

function StatCard({ label, value, type }: { label: string, value: number, type: 'correct' | 'wrong' | 'skipped' }) {
  const styles = {
    correct: "text-[#3D9A5F] border-[#3D9A5F]/20 bg-[#3D9A5F]/5",
    wrong: "text-[#EF4444] border-[#EF4444]/20 bg-[#EF4444]/5",
    skipped: "text-[#666666] border-[#3A3A3A] bg-[#141414]"
  };
  return (
    <div className={`p-4 rounded border text-center ${styles[type]}`}>
       <div className="text-xl font-bold font-mono mb-1">{value}</div>
       <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 font-mono">{label}</div>
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
            stroke="#3A3A3A" strokeWidth="8" fill="transparent"
          />
          <circle 
            cx="96" cy="96" r={radius} 
            stroke="#D97706" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
       </svg>
       <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-bold text-[#E8E8E8] font-mono leading-none">
            {score.toFixed(0)}
          </span>
          <span className="text-[#666666] font-bold text-[10px] uppercase tracking-widest mt-2 font-mono">Total Score</span>
          <span className="text-[#D97706] font-bold text-[10px] uppercase tracking-widest font-mono">of {total}</span>
       </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: TopicAnalytics }) {
  return (
    <div className="bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg group hover:border-[#D97706]/30 transition-colors">
       <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-[#E8E8E8] uppercase tracking-wider">{topic.topicName}</h3>
          <div className="text-lg font-bold text-[#D97706] font-mono">{topic.hitRate.toFixed(0)}%</div>
       </div>
       <div className="w-full h-1.5 bg-[#141414] border border-[#3A3A3A] rounded-full overflow-hidden mb-6">
          <div className="h-full bg-[#D97706]" style={{ width: `${topic.hitRate}%` }} />
       </div>
       <div className="flex justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-[#666666]">
          <span>{topic.correctCount} Correct</span>
          <span>{topic.wrongCount} Wrong</span>
       </div>
    </div>
  );
}

function QuestionReviewCard({ qr, index }: { qr: QuestionResult, index: number }) {
  const isSelected = !!qr.selectedOption;
  const isCorrect = qr.isCorrect;
  const statusColor = isCorrect ? "border-[#3D9A5F]/30 bg-[#3D9A5F]/5" : isSelected ? "border-[#EF4444]/30 bg-[#EF4444]/5" : "border-[#3A3A3A] bg-[#1E1E1E]";
 
  return (
    <div className={`p-8 rounded-lg border ${statusColor} space-y-6`}>
       <div className="flex justify-between items-start">
          <div className="space-y-2">
             <div className="text-[10px] font-bold uppercase tracking-widest text-[#666666] font-mono">Question {index + 1}</div>
             <h3 className="text-lg font-medium text-[#E8E8E8] leading-relaxed">
                <Multilang en={qr.question.questionTextEn} te={qr.question.questionTextTe} />
             </h3>
          </div>
          {qr.isCorrect !== null && (
             <div className={`px-3 py-1 rounded border font-bold text-[10px] uppercase tracking-widest font-mono ${isCorrect ? "border-[#3D9A5F]/30 text-[#3D9A5F]" : "border-[#EF4444]/30 text-[#EF4444]"}`}>
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
          <div className="p-6 bg-[#141414] border border-[#3A3A3A] rounded-lg">
             <div className="text-[10px] font-bold uppercase tracking-widest text-[#D97706] mb-3 font-mono">Explanation</div>
             <div className="text-[#A0A0A0] text-sm leading-relaxed">
                <Multilang en={qr.question.explanationEn || ""} te={qr.question.explanationTe || ""} />
             </div>
          </div>
       )}
    </div>
  );
}

function ReviewOption({ label, en, te, selected, correct }: { label: string, en: string, te: string, selected: boolean, correct: boolean }) {
  let style = "bg-[#1E1E1E] border-[#3A3A3A]";
  if (correct) style = "bg-[#3D9A5F]/10 border-[#3D9A5F] text-[#E8E8E8]";
  else if (selected && !correct) style = "bg-[#EF4444]/10 border-[#EF4444] text-[#E8E8E8]";
 
  return (
    <div className={`p-4 rounded border flex items-start gap-4 transition-colors ${style}`}>
       <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
          correct ? "bg-[#3D9A5F] border-[#3D9A5F] text-white" : selected ? "bg-[#EF4444] border-[#EF4444] text-white" : "bg-[#141414] border-[#3A3A3A] text-[#666666]"
       }`}>
          {label}
       </div>
       <div>
          <div className="font-medium text-sm mb-1">{en}</div>
          <div className="text-[11px] opacity-60">{te}</div>
       </div>
    </div>
  );
}
