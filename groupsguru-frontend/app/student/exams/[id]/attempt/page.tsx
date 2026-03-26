"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { attemptsApi } from "@/lib/attempts";
import { AttemptStartResponse } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";
import ExamTimer from "@/components/exam/ExamTimer";
import QuestionNavPanel from "@/components/exam/QuestionNavPanel";
import Modal from "@/components/ui/Modal";

function ExamAttemptContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPracticeMode = searchParams.get("practice") === "true";
  const [data, setData] = useState<AttemptStartResponse | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // questionId -> option (A/B/C/D)
  const [flagged, setFlagged] = useState<number[]>([]); // list of indices
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [practiceResults, setPracticeResults] = useState<Record<number, any>>({});
  const [isChecking, setIsChecking] = useState(false);

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
    if (!currentQuestion || (isPracticeMode && practiceResults[currentQuestion.id])) return;
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleCheckAnswer = async () => {
    if (!currentQuestion || !answers[currentQuestion.id] || isChecking) return;
    setIsChecking(true);
    try {
      const result = await attemptsApi.practiceAnswer(Number(id), {
        questionId: currentQuestion.id,
        selectedOption: answers[currentQuestion.id]
      });
      setPracticeResults(prev => ({ ...prev, [currentQuestion.id]: result }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
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
  }, [data, answers, isSubmitting, router, id]);

  const answeredIndices = useMemo(() => {
    if (!data) return [];
    return data.questions
      .map((q, i) => answers[q.id] ? i : -1)
      .filter(i => i !== -1);
  }, [data, answers]);

  if (!data) return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center">
       <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isSubmitted) return (
     <div className="min-h-screen bg-[#191919] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#D97706]/10 border border-[#D97706]/30 rounded-full flex items-center justify-center text-[#D97706] mb-8">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-4xl font-serif text-[#E8E8E8] mb-4">Exam Submitted</h1>
        <p className="text-[#666666] font-mono text-xs uppercase tracking-[0.2em] mb-12">Redirecting to results view...</p>
     </div>
  );

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="h-[calc(100vh-48px)] flex items-center justify-center overflow-hidden">
        <div className="h-full w-full max-w-[1400px] flex flex-col overflow-hidden bg-[#191919]">
        
        {/* Horizontal Split Layout */}
        <div className="flex-1 flex gap-0 overflow-hidden">
           
           {/* Main Quiz Area (Left) */}
           <div className="flex-1 flex flex-col overflow-hidden border-r border-[#3A3A3A]">
              
              {/* Fixed Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-[#3A3A3A] shrink-0 bg-[#141414]">
                 <div className="flex items-center gap-4">
                    <div className="w-1 h-8 bg-[#D97706] rounded-full" />
                    <div>
                       <h2 className="text-xl font-serif text-[#E8E8E8]">
                          <Multilang en={data.examName} te={data.examNameTe} />
                          {isPracticeMode && <span className="ml-3 text-[10px] bg-[#D97706]/20 text-[#D97706] font-mono px-2 py-1 rounded">PRACTICE MODE</span>}
                       </h2>
                       <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666666]">
                          Question <span className="text-[#D97706]">{currentIdx + 1}</span> of {data.questions.length}
                       </p>
                    </div>
                 </div>
                 <ExamTimer durationMinutes={data.durationMinutes} onTimeUp={handleSubmit} />
              </div>

              {/* Scrollable Content (Question & Options) */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#191919]">
                 <div className="flex flex-col gap-8 max-w-[800px] mx-auto">
                    <div className="text-xl font-medium leading-relaxed bg-[#1E1E1E] p-8 rounded-lg border border-[#3A3A3A] text-[#E8E8E8]">
                       <Multilang en={currentQuestion?.questionTextEn || ""} te={currentQuestion?.questionTextTe || ""} />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => {
                        const ansProp = `option${opt}En` as keyof typeof currentQuestion;
                        const ansTeProp = `option${opt}Te` as keyof typeof currentQuestion;
                        
                        let isCorrect = false;
                        let isWrongSelected = false;
                        if (isPracticeMode && practiceResults[currentQuestion?.id || 0]) {
                           const res = practiceResults[currentQuestion?.id || 0];
                           isCorrect = res.correctOption === opt;
                           isWrongSelected = !res.isCorrect && answers[currentQuestion?.id || 0] === opt;
                        }

                        return (
                          <OptionCard 
                            key={opt}
                            label={opt} 
                            en={String(currentQuestion?.[ansProp] || "")} 
                            te={String(currentQuestion?.[ansTeProp] || "")} 
                            isSelected={answers[currentQuestion?.id || 0] === opt} 
                            isCorrect={isCorrect}
                            isWrongSelected={isWrongSelected}
                            isDisabled={isPracticeMode && !!practiceResults[currentQuestion?.id || 0]}
                            onClick={() => handleSelectOption(opt)} 
                          />
                        )
                      })}
                    </div>
                    {isPracticeMode && !practiceResults[currentQuestion?.id || 0] && (
                      <button 
                        onClick={handleCheckAnswer}
                        disabled={!answers[currentQuestion?.id || 0] || isChecking}
                        className="mt-2 py-3 px-6 rounded bg-[#3D9A5F] text-white font-bold text-sm tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#32814f] transition-colors self-start"
                      >
                        {isChecking ? "Checking..." : "Check Answer"}
                      </button>
                    )}
                    {isPracticeMode && practiceResults[currentQuestion?.id || 0] && (
                      <div className={`mt-2 p-5 rounded-lg border ${practiceResults[currentQuestion!.id].isCorrect ? 'border-[#3D9A5F] bg-[#3D9A5F]/10' : 'border-[#C74444] bg-[#C74444]/10'}`}>
                        <div className={`font-bold mb-3 ${practiceResults[currentQuestion!.id].isCorrect ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                          {practiceResults[currentQuestion!.id].isCorrect ? "Correct!" : `Incorrect. The correct answer was ${practiceResults[currentQuestion!.id].correctOption}.`}
                        </div>
                        <div className="text-[#E8E8E8] text-sm leading-relaxed border-t border-[#3A3A3A]/30 pt-3">
                          <Multilang 
                            en={practiceResults[currentQuestion!.id].explanationEn || "No explanation provided."} 
                            te={practiceResults[currentQuestion!.id].explanationTe || "వివరణ లేదు."} 
                          />
                        </div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Fixed Footer (Always Visible) */}
              <div className="flex justify-between items-center px-8 py-4 border-t border-[#3A3A3A] shrink-0 bg-[#141414]">
                 <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} 
                      disabled={currentIdx === 0} 
                      className="inline-flex items-center gap-2 px-6 py-2 bg-[#1E1E1E] border border-[#3A3A3A] rounded text-[#E8E8E8] text-[11px] font-bold uppercase tracking-widest hover:bg-[#363636] disabled:opacity-20 transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      Previous
                    </button>
                    <button 
                      onClick={() => setCurrentIdx(prev => Math.min(data.questions.length - 1, prev + 1))} 
                      disabled={currentIdx === data.questions.length - 1} 
                      className="inline-flex items-center gap-2 px-6 py-2 bg-[#1E1E1E] border border-[#3A3A3A] rounded text-[#E8E8E8] text-[11px] font-bold uppercase tracking-widest hover:bg-[#363636] disabled:opacity-20 transition-colors"
                    >
                      Next
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={handleFlag} 
                      className={`px-6 py-2 rounded text-[11px] font-bold uppercase tracking-widest transition-all border ${
                        flagged.includes(currentIdx) 
                          ? "bg-[#C4901A] text-white border-[#C4901A]" 
                          : "bg-[#1E1E1E] border-[#3A3A3A] text-[#666666] hover:text-[#A0A0A0]"
                      }`}
                    >
                      {flagged.includes(currentIdx) ? "Marked" : "Mark"}
                    </button>
                    <button 
                      onClick={() => setIsSubmitModalOpen(true)} 
                      className="px-8 py-2 bg-[#D97706] border border-[#D97706] rounded text-white font-bold text-[11px] uppercase tracking-widest hover:bg-[#F59E0B] transition-colors shadow-lg shadow-[#D97706]/10"
                    >
                      Submit Exam
                    </button>
                 </div>
              </div>
           </div>

           {/* Sidebar (Right) */}
           <div className="w-80 flex flex-col gap-0 overflow-y-auto bg-[#1E1E1E]">
              <div className="p-6 border-b border-[#3A3A3A]">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-6">Question Palette</h3>
                <QuestionNavPanel totalQuestions={data.questions.length} currentIdx={currentIdx} onNavigate={setCurrentIdx} answeredIndices={answeredIndices} flaggedIndices={flagged} />
              </div>
              
              <div className="p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-4">Summary</h3>
                <div className="grid grid-cols-1 gap-2">
                   <div className="p-4 bg-[#141414] border border-[#3A3A3A] rounded flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-[#A0A0A0]">Answered</span>
                      <span className="text-lg font-bold text-[#3D9A5F] font-mono">{answeredIndices.length}</span>
                   </div>
                   <div className="p-4 bg-[#141414] border border-[#3A3A3A] rounded flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-[#A0A0A0]">Not Visited</span>
                      <span className="text-lg font-bold text-[#666666] font-mono">{data.questions.length - answeredIndices.length}</span>
                   </div>
                   <div className="p-4 bg-[#141414] border border-[#3A3A3A] rounded flex justify-between items-center">
                      <span className="text-[11px] font-bold uppercase text-[#A0A0A0]">Marked</span>
                      <span className="text-lg font-bold text-[#C4901A] font-mono">{flagged.length}</span>
                   </div>
                </div>
              </div>
           </div>

        </div>

        {/* Confirmation Modal */}
        <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Confirm Submission">
          <div className="space-y-6">
             <div className="p-6 bg-[#141414] border border-[#3A3A3A] rounded-lg text-center">
                <div className="text-3xl font-bold text-[#D97706] font-mono mb-1">{answeredIndices.length} / {data.questions.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666]">Questions Answered</div>
             </div>
             <p className="text-[#A0A0A0] text-center px-4 text-sm leading-relaxed">
               Are you sure you want to finalize your exam? Once submitted, your scores will be evaluated and you cannot modify your answers.
             </p>
             <div className="flex gap-3">
               <button onClick={() => setIsSubmitModalOpen(false)} className="flex-1 py-3 bg-[#1E1E1E] border border-[#3A3A3A] rounded font-bold text-[11px] uppercase tracking-widest text-[#E8E8E8] hover:bg-[#363636] transition-colors">Return to Quiz</button>
               <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 bg-[#D97706] border border-[#D97706] rounded font-bold text-[11px] uppercase tracking-widest text-white hover:bg-[#F59E0B] disabled:opacity-50 transition-colors shadow-lg shadow-[#D97706]/10">
                 {isSubmitting ? "Submitting..." : "Yes, Submit Now"}
               </button>
             </div>
          </div>
        </Modal>

        </div>
      </div>
    </ProtectedLayout>
  );
}

export default function ExamAttemptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#191919] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExamAttemptContent />
    </Suspense>
  );
}

function OptionCard({ label, en, te, isSelected, isCorrect, isWrongSelected, isDisabled, onClick }: { label: string, en: string, te: string, isSelected: boolean, isCorrect?: boolean, isWrongSelected?: boolean, isDisabled?: boolean, onClick: () => void }) {
  let baseClasses = "bg-[#1E1E1E] border-[#3A3A3A] hover:border-[#666666]";
  let labelBg = "bg-[#141414] border-[#3A3A3A] text-[#666666]";
  let textColor = "text-[#A0A0A0]";
  let teColor = "text-[#666666]";

  if (isCorrect) {
    baseClasses = "bg-[#3D9A5F]/10 border-[#3D9A5F] shadow-[0_0_20px_rgba(61,154,95,0.1)]";
    labelBg = "bg-[#3D9A5F] border-[#3D9A5F] text-white";
    textColor = "text-[#E8E8E8]";
    teColor = "text-[#4ade80]";
  } else if (isWrongSelected) {
    baseClasses = "bg-[#C74444]/10 border-[#C74444]";
    labelBg = "bg-[#C74444] border-[#C74444] text-white";
    textColor = "text-[#E8E8E8]";
    teColor = "text-[#f87171]";
  } else if (isSelected) {
    baseClasses = "bg-[#D97706]/10 border-[#D97706] shadow-[0_0_20px_rgba(217,119,6,0.05)]";
    labelBg = "bg-[#D97706] border-[#D97706] text-white";
    textColor = "text-[#E8E8E8]";
    teColor = "text-[#D97706]";
  }

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={`p-5 rounded-lg border text-left transition-all flex items-start gap-5 ${baseClasses} ${isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <div className={`w-10 h-10 shrink-0 rounded border flex items-center justify-center font-bold text-sm font-mono ${labelBg}`}>
        {label}
      </div>
      <div className="flex-1 pt-1">
        <div className={`text-lg font-medium mb-1 transition-colors ${textColor}`}>{en}</div>
        <div className={`text-sm font-medium transition-colors ${teColor}`}>{te}</div>
      </div>
    </button>
  );
}
