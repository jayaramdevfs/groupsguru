"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback, use } from "react";
import { examsApi } from "@/lib/exams";
import { Exam } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";
import { useRouter } from "next/navigation";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function ExamDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!exam) {
    return (
      <ProtectedLayout requiredRole="STUDENT">
        <div className="min-h-screen py-32 text-center text-white/50">
          <p className="text-xl font-bold italic mb-4">Exam not found</p>
          <button onClick={() => router.back()} className="text-purple-400 font-bold hover:underline">
            Go back
          </button>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-4xl mx-auto text-white">
        
        {/* Exam Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold border border-purple-500/30 uppercase tracking-widest mb-6 translate-y-[-10px] scale-[0.9] origin-left">
            {exam.examType.replace('_', ' ')}
          </div>
          
          <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight mb-6 bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent italic">
            <Multilang en={exam.name} te={exam.nameTe} />
          </h1>
          
          <p className="text-[18px] text-white/70 font-[600] leading-relaxed max-w-2xl italic">
            <Multilang en={exam.description || ""} te={exam.descriptionTe || ""} />
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Questions", value: exam.totalQuestions, en: "Questions", te: "ప్రశ్నలు" },
            { label: "Duration", value: `${exam.durationMinutes}m`, en: "Duration", te: "సమయం" },
            { label: "Marks", value: exam.totalQuestions * exam.marksPerQuestion, en: "Total Marks", te: "మొత్తం మార్కులు" },
            { label: "Neg. Marking", value: exam.negativeMarking ? `-${exam.penaltyPerWrong}` : "No", en: "Negative", te: "నెగటివ్" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-[24px] bg-white/5 border border-white/10 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.2 + (i * 0.05) }}
            >
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2 italic">
                <Multilang en={stat.en} te={stat.te} />
              </p>
              <p className="text-2xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent italic">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Rules Section */}
        <motion.div
          className="p-8 md:p-12 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-3xl mb-12 shadow-2xl shadow-purple-500/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-8 flex items-center italic">
            <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mr-3 text-sm">!</span>
            <Multilang en="Exam Rules" te="పరీక్ష నిబంధనలు" />
          </h3>
          
          <ul className="space-y-6 text-white/70 font-[600]">
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-4 mt-0.5 text-xs">1</span>
              <p><Multilang en="Once you start, the timer cannot be paused." te="మొదలు పెట్టిన తర్వాత టైమర్ ఆగదు." /></p>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-4 mt-0.5 text-xs">2</span>
              <p><Multilang en="Each correct answer gives 1.0 mark." te="ప్రతి సరైన సమాధానానికి 1.0 మార్కు లభిస్తుంది." /></p>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-4 mt-0.5 text-xs">3</span>
              <p><Multilang en="Negative marking applies for incorrect attempts." te="తప్పు సమాధానాలకు నెగటివ్ మార్కింగ్ ఉంటుంది." /></p>
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mr-4 mt-0.5 text-xs">4</span>
              <p><Multilang en="The exam will auto-submit when the time expires." te="సమయం ముగిసినప్పుడు పరీక్ష ఆటోమేటిక్ గా సబ్మిట్ అవుతుంది." /></p>
            </li>
          </ul>
        </motion.div>

        {/* Start Button */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ ...spring, delay: 0.5 }}
           className="flex justify-center"
        >
          <button 
             onClick={() => router.push(`/student/exams/${id}/attempt`)}
            className="group relative px-12 py-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl shadow-2xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all duration-300 italic"
          >
            <span className="relative z-10 flex items-center">
              <Multilang en="Start Exam Now" te="పరీక్ష ప్రారంభించండి" />
              <svg className="ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
        
        <p className="text-center mt-6 text-white/40 font-bold italic">
          <Multilang en="Timer will start on next page" te="తదుపరి పేజీలో టైమర్ ప్రారంభమవుతుంది" />
        </p>

      </div>
    </ProtectedLayout>
  );
}
