"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { attemptsApi } from "@/lib/attempts";
import { AttemptStartResponse, Question } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";
import ExamTimer from "@/components/exam/ExamTimer";
import QuestionNavPanel from "@/components/exam/QuestionNavPanel";
import Modal from "@/components/ui/Modal";

const spring = { type: "spring" as const, stiffness: 420, damping: 24, mass: 0.8 };

export default function ExamAttemptPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<AttemptStartResponse | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId -> option (A/B/C/D)
  const [flagged, setFlagged] = useState<number[]>([]); // list of indices
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const startAttempt = async () => {
      try {
        const res = await attemptsApi.start(Number(id));
        setData(res);
      } catch (error) {
        console.error("Failed to start exam:", error);
        router.push(`/student/exams/${id}`);
      }
    };
    startAttempt();
  }, [id, router]);

  const currentQuestion = data?.questions[currentIdx];

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleFlag = () => {
    setFlagged(prev => 
      prev.includes(currentIdx) ? prev.filter(i => i !== currentIdx) : [...prev, currentIdx]
    );
  };

  const handleSubmit = useCallback(async () => {
    if (!data || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        answers: data.questions.map(q => ({
          questionId: q.id,
          selectedOption: answers[q.id] || null
        }))
      };
      await attemptsApi.submit(data.attemptId, payload);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push(`/student/exams/${id}/results`);
      }, 3000);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSubmitting(false);
    }
  }, [data, answers, isSubmitting, router]);

  const answeredIndices = useMemo(() => {
    if (!data) return [];
    return data.questions
      .map((q, i) => answers[q.id] ? i : -1)
      .filter(i => i !== -1);
  }, [data, answers]);

  if (!data) return (
    <div className="min-h-screen bg-[#0f051d] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isSubmitted) return (
     <div className="min-h-screen bg-[#0f051d] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-8"
        >
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </motion.div>
        <h1 className="text-4xl font-black italic mb-4">Exam Submitted!</h1>
        <p className="text-white/40 font-bold mb-12">Redirecting to your dashboard...</p>
     </div>
  );

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        <div className="h-[92%] w-[92%] text-white flex flex-col overflow-hidden">
        
        {/* Horizontal Split Layout */}
        <div className="flex-1 flex gap-6 overflow-hidden">
           
           {/* Main Quiz Area (Left) */}
           <div className="flex-1 flex flex-col overflow-hidden bg-[#12081f]/40 border border-white/10 rounded-2xl backdrop-blur-3xl">
              
              {/* Fixed Header */}
              <div className="flex justify-between items-center p-3 border-b border-white/10 shrink-0 bg-white/5">
                 <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-purple-500 rounded-full" />
                    <div>
                       <h2 className="text-sm font-black italic">
                          <Multilang en={data.examName} te={data.examNameTe} />
                       </h2>
                       <p className="text-[8px] font-black uppercase tracking-widest text-white/40 italic"> Question {currentIdx + 1}/{data.questions.length}</p>
                    </div>
                 </div>
                 <ExamTimer durationMinutes={data.durationMinutes} onTimeUp={handleSubmit} />
              </div>

              {/* Scrollable Content (Question & Options) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                 <motion.div 
                   key={currentIdx}
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="flex flex-col gap-4"
                 >
                    <div className="text-sm md:text-base font-bold italic leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 text-white/90">
                       <Multilang en={currentQuestion?.questionTextEn || ""} te={currentQuestion?.questionTextTe || ""} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <OptionCard label="A" en={currentQuestion?.optionAEn || ""} te={currentQuestion?.optionATe || ""} isSelected={answers[currentQuestion?.id || 0] === 'A'} onClick={() => handleSelectOption('A')} />
                      <OptionCard label="B" en={currentQuestion?.optionBEn || ""} te={currentQuestion?.optionBTe || ""} isSelected={answers[currentQuestion?.id || 0] === 'B'} onClick={() => handleSelectOption('B')} />
                      <OptionCard label="C" en={currentQuestion?.optionCEn || ""} te={currentQuestion?.optionCTe || ""} isSelected={answers[currentQuestion?.id || 0] === 'C'} onClick={() => handleSelectOption('C')} />
                      <OptionCard label="D" en={currentQuestion?.optionDEn || ""} te={currentQuestion?.optionDTe || ""} isSelected={answers[currentQuestion?.id || 0] === 'D'} onClick={() => handleSelectOption('D')} />
                    </div>
                 </motion.div>
              </div>

              {/* Fixed Footer (Always Visible) */}
              <div className="flex justify-between items-center p-3 border-t border-white/10 shrink-0 bg-white/5">
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} 
                      disabled={currentIdx === 0} 
                      className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl font-bold italic text-[10px] hover:bg-white/10 disabled:opacity-20"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))} 
                      disabled={currentIdx === data.questions.length - 1} 
                      className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl font-bold italic text-[10px] hover:bg-white/10 disabled:opacity-20"
                    >
                      Next
                    </button>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={handleFlag} 
                     className={`px-5 py-2 rounded-xl font-bold italic text-[10px] transition-all ${
                       flagged.includes(currentIdx) ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10" : "bg-white/5 border border-white/10 text-white/40"
                     }`}
                   >
                     Mark
                   </button>
                   <button 
                     onClick={() => setIsSubmitModalOpen(true)} 
                     className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-black italic text-[10px] shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
                   >
                     Submit
                   </button>
                 </div>
              </div>
           </div>

           {/* Sidebar (Right) */}
           <div className="w-72 flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">
              <QuestionNavPanel totalQuestions={data.questions.length} currentIdx={currentIdx} onNavigate={setCurrentIdx} answeredIndices={answeredIndices} flaggedIndices={flagged} />
              <div className="bg-white/5 border border-white/10 p-4 rounded-[24px] w-full backdrop-blur-xl">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3 italic">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xl font-black italic">{answeredIndices.length}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Answered</div>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="text-xl font-black italic">{data.questions.length - answeredIndices.length}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Remaining</div>
                   </div>
                </div>
              </div>
           </div>

        </div>

        {/* Confirmation Modal */}
        <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Review Submission">
          <div className="space-y-8">
             <div className="p-8 bg-purple-500/10 border border-purple-500/20 rounded-[32px] text-center">
                <div className="text-5xl font-black italic text-purple-400 mb-2">{answeredIndices.length} / {data.questions.length}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Questions Answered</div>
             </div>
             <p className="text-white/60 italic font-bold text-center px-6">Are you sure you want to submit your exam? Once submitted, you cannot change your answers.</p>
             <div className="flex gap-4">
               <button onClick={() => setIsSubmitModalOpen(false)} className="flex-1 py-4 bg-white/5 rounded-2xl font-bold italic">Back to Quiz</button>
               <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black italic disabled:opacity-50">{isSubmitting ? "Submitting..." : "Yes, Submit Now"}</button>
             </div>
          </div>
        </Modal>

        </div>
      </div>
    </ProtectedLayout>
  );
}

function OptionCard({ label, en, te, isSelected, onClick }: { label: string, en: string, te: string, isSelected: boolean, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01, x: 2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`p-4 rounded-2xl border text-left transition-all ${
        isSelected 
          ? "bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-500/20" 
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black italic text-sm ${
          isSelected ? "bg-white text-purple-600" : "bg-purple-500/20 text-purple-400"
        }`}>
          {label}
        </div>
        <div className="flex-1">
          <div className={`font-semibold italic ${isSelected ? "text-white" : "text-white/80"}`}>{en}</div>
          <div className={`text-[10px] font-bold mt-1 ${isSelected ? "text-white/70" : "text-white/40"}`}>{te}</div>
        </div>
      </div>
    </motion.button>
  );
}
