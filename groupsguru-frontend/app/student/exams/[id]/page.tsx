"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { Suspense, useEffect, useState, useCallback, use } from "react";
import { examsApi } from "@/lib/exams";
import { Exam } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ExamDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isPracticeMode = searchParams.get("practice") === "true";
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchExam = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await examsApi.getById(parseInt(id));
      setExam(data);
    } catch (error) {
      console.error("Failed to fetch exam:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExam();
  }, [fetchExam]);

  if (isLoading) {
    return (
      <ProtectedLayout requiredRole="STUDENT">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!exam) {
    return (
      <ProtectedLayout requiredRole="STUDENT">
        <div className="max-w-[900px] mx-auto py-32 text-center text-[#666666]">
          <p className="text-xl font-bold font-mono uppercase tracking-widest mb-4">Exam not found</p>
          <button onClick={() => router.back()} className="text-[#D97706] font-bold hover:underline">
            Go back
          </button>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Back Hook */}
        <Link
          href="/student/exams"
          className="inline-flex items-center gap-2 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-8 hover:text-[#F59E0B] transition-colors"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Practice Center
        </Link>

        {/* Exam Header */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-widest">
              {exam.examType.replace('_', ' ')}
            </div>
            {isPracticeMode && (
              <div className="inline-block px-2 py-0.5 rounded border border-[#4ade80]/30 bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-bold uppercase tracking-widest">
                PRACTICE MODE
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            <Multilang en={exam.name} te={exam.nameTe} />
          </h1>
          
          <p className="text-[#A0A0A0] max-w-2xl leading-relaxed text-lg font-medium">
            <Multilang en={exam.description || "Comprehensive assessment designed for competitive exam standards."} te={exam.descriptionTe || "పోటీ పరీక్షల ప్రమాణాల కోసం రూపొందించబడిన సమగ్ర అంచనా."} />
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Questions", value: exam.totalQuestions, en: "Questions", te: "ప్రశ్నలు" },
            { label: "Duration", value: `${exam.durationMinutes}m`, en: "Duration", te: "సమయం" },
            { label: "Marks", value: exam.totalQuestions * exam.marksPerQuestion, en: "Total Marks", te: "మార్కులు" },
            { label: "Neg. Marking", value: exam.negativeMarking ? `-${exam.penaltyPerWrong}` : "No", en: "Negative", te: "నెగటివ్" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] text-center"
            >
              <p className="text-[10px] uppercase tracking-widest text-[#666666] font-bold mb-2">
                <Multilang en={stat.en} te={stat.te} />
              </p>
              <p className="text-2xl font-bold text-[#D97706] font-mono">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Rules Section */}
        <div className="p-6 md:p-8 rounded-lg bg-[#141414] border border-[#3A3A3A] mb-12">
          <h3 className="text-lg font-bold text-[#E8E8E8] mb-6 flex items-center">
            <span className="w-1.5 h-1.5 bg-[#D97706] rounded-full mr-3"></span>
            <Multilang en="Exam Instructions" te="పరీక్ష సూచనలు" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              { en: "Once you start, the timer cannot be paused.", te: "మొదలు పెట్టిన తర్వాత టైమర్ ఆగదు." },
              { en: "Each correct answer gives 1.0 mark.", te: "ప్రతి సరైన సమాధానానికి 1.0 మార్కు లభిస్తుంది." },
              { en: "Negative marking applies for incorrect attempts.", te: "తప్పు సమాధానాలకు నెగటివ్ మార్కింగ్ ఉంటుంది." },
              { en: "The exam will auto-submit when the time expires.", te: "సమయం ముగిసినప్పుడు పరీక్ష ఆటోమేటిక్ గా సబ్మిట్ అవుతుంది." }
            ].map((rule, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-[10px] font-mono text-[#666666] pt-0.5">0{idx + 1}</span>
                <p className="text-sm font-medium text-[#A0A0A0] leading-relaxed">
                  <Multilang en={rule.en} te={rule.te} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button 
             onClick={() => router.push(`/student/exams/${id}/attempt${isPracticeMode ? '?practice=true' : ''}`)}
             className="inline-flex items-center gap-3 px-12 py-5 rounded bg-[#D97706] border border-[#D97706] hover:bg-[#F59E0B] hover:border-[#F59E0B] text-white font-bold text-lg transition-colors group"
          >
            <Multilang en={isPracticeMode ? "Start Practice Now" : "Start Exam Now"} te={isPracticeMode ? "ప్రాక్టీస్ ప్రారంభించండి" : "పరీక్ష ప్రారంభించండి"} />
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <p className="mt-6 text-[#666666] font-bold text-[10px] uppercase tracking-widest">
            <Multilang en="Timer will start on next page" te="తదుపరి పేజీలో టైమర్ ప్రారంభమవుతుంది" />
          </p>
        </div>

      </div>
    </ProtectedLayout>
  );
}

export default function ExamDetail({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-[#191919] flex items-center justify-center">
         <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
       </div>
    }>
       <ExamDetailContent params={params} />
    </Suspense>
  )
}
