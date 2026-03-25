"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { registryApi } from "@/lib/registry";
import { topicApi } from "@/lib/topics";
import { questionsApi } from "@/lib/questions";
import { MicroTopic, Topic, Question } from "@/lib/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import Link from "next/link";
import { Multilang } from "@/components/ui/Multilang";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

function QuestionCard({ question, language }: { question: Question; language: string }) {
  const [showAnswer, setShowAnswer] = useState(false);
  
  const qText = language === "te" && question.questionTextTe ? question.questionTextTe : question.questionTextEn;
  const optA = language === "te" && question.optionATe ? question.optionATe : question.optionAEn;
  const optB = language === "te" && question.optionBTe ? question.optionBTe : question.optionBEn;
  const optC = language === "te" && question.optionCTe ? question.optionCTe : question.optionCEn;
  const optD = language === "te" && question.optionDTe ? question.optionDTe : question.optionDEn;
  const explanation = language === "te" && question.explanationTe ? question.explanationTe : question.explanationEn;

  return (
    <div className="bg-white/5 border border-[#57534E]/40 rounded-2xl p-6 relative">
       <div className="flex justify-between items-start mb-4">
         <div className="flex gap-2 mb-2">
            <span className="text-[10px] font-bold px-2 py-1 rounded  ">{question.difficulty}</span>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/20 text-green-300">{question.questionType}</span>
         </div>
       </div>
       <div className="text-lg font-medium text-[#FAFAF9] mb-6" dangerouslySetInnerHTML={{ __html: qText || '' }} />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
         {['A', 'B', 'C', 'D'].map((letter, idx) => {
           const optText = [optA, optB, optC, optD][idx];
           const isCorrect = showAnswer && question.correctOption === letter;
           return (
             <div key={letter} className={`p-4 rounded-xl border flex gap-3 ${isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-200' : 'bg-white/[0.02] border-[#57534E]/40 text-[#FAFAF9]/80'}`}>
                <span className="font-bold opacity-50">{letter}.</span>
                <span dangerouslySetInnerHTML={{ __html: optText || '' }} />
             </div>
           );
         })}
       </div>
       <button onClick={() => setShowAnswer(!showAnswer)} className="px-4 py-2 bg-orange-500/20 text-[#F97316] rounded-lg hover:bg-orange-500/30 transition-colors text-sm font-bold">
         {showAnswer ? "Hide Answer" : "Reveal Answer"}
       </button>
       
       <AnimatePresence>
         {showAnswer && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-[#57534E]/40 overflow-hidden">
               <p className="text-sm text-green-400 font-bold mb-2">Correct Option: {question.correctOption}</p>
               {explanation && (
                 <div className="text-sm text-[#FAFAF9]/70" dangerouslySetInnerHTML={{ __html: explanation }} />
               )}
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}

function MicroTopicCard({ mt, language, index }: { mt: MicroTopic; language: string; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleExpand = async () => {
    if (!expanded && questions.length === 0 && !isLoading) {
      setIsLoading(true);
      try {
        const fetchedQuestions = await questionsApi.getByMicroTopicId(mt.microTopicId);
        setQuestions(fetchedQuestions || []);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
         setIsLoading(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ ...spring, delay: index * 0.05 }}
      className="w-full flex-col relative overflow-hidden bg-white/[0.03] border border-white/5 rounded-xl cursor-pointer group hover:bg-white/[0.05] transition-all"
      onClick={handleExpand}
    >
        <div className="flex flex-col md:flex-row items-center gap-6 p-8 relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5  group-hover:bg-orange-500/10 transition-all pointer-events-none" />
           <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#44403C] border border-[#57534E]/40 flex items-center justify-center font-bold text-xl text-[#F97316]">
             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>
           </div>
           <div className="flex-1 w-full relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                 <span className="text-[#F97316] font-mono text-[10px] font-bold px-2 py-0.5 border border-[#57534E]/40 rounded-full">{mt.microTopicId}</span>
                 {mt.subject && <span className="text-[#F97316] text-[10px] font-bold px-2 py-0.5 border border-[#57534E]/40 rounded-full bg-orange-500/20">{mt.subject}</span>}
                 {mt.paper && <span className=" text-[10px] font-bold px-2 py-0.5 border  rounded-full ">{mt.paper}</span>}
              </div>
              <h3 className="text-xl font-bold text-[#FAFAF9] mb-2">{mt.topicName || "Atomic Topic"}</h3>
              <p className="text-sm text-[#FAFAF9]/60 leading-relaxed mb-3">{mt.microTopicText}</p>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-xs font-semibold text-[#FAFAF9]/30">
                 {mt.groupApplicability && <span>🎯 {mt.groupApplicability}</span>}
                 {mt.dataConfidence && <span>✓ Confidence: {mt.dataConfidence.toUpperCase()}</span>}
              </div>
           </div>
           
           <div className="shrink-0 pl-4 z-10">
             <div className={`p-2 rounded-full bg-white/5 text-[#FAFAF9]/50 transition-transform ${expanded ? 'rotate-180' : ''}`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
             </div>
           </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-8 pb-8 pt-0 mt-0"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="pt-8 border-t border-white/5">
                 {isLoading ? (
                   <div className="py-8 text-center text-[#FAFAF9]/50">
                      <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                   </div>
                 ) : questions.length === 0 ? (
                   <div className="py-8 text-center text-[#FAFAF9]/50">No questions mapped to this micro-topic yet.</div>
                 ) : (
                   <div className="flex flex-col gap-4">
                     <h4 className="text-lg font-bold text-[#F97316] mb-2">Practice Questions</h4>
                     {questions.map((q) => (
                       <QuestionCard key={q.id} question={q} language={language} />
                     ))}
                   </div>
                 )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
}

export default function StudentMicroTopics() {
  const params = useParams();
  const categoryId = Number(params.id);
  const subCategoryId = Number(params.subCategoryId);
  const sectionId = Number(params.sectionId);
  const topicId = Number(params.topicId);
  const { language } = useLanguage();

  const [microTopics, setMicroTopics] = useState<MicroTopic[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tops, mts] = await Promise.all([
        topicApi.getBySection(sectionId),
        registryApi.getMicroTopicsByTopic(topicId)
      ]);
      const currentTopic = tops.find((t) => t.id === topicId) || null;
      setTopic(currentTopic);
      setMicroTopics(mts || []);
    } catch (error) {
      console.error("Failed to fetch micro-topics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sectionId, topicId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayName = topic
    ? language === "te" && topic.nameTe
      ? topic.nameTe
      : topic.name
    : "Micro-Topics";

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-[#FAFAF9]">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <Link
            href={`/student/categories/${categoryId}/${subCategoryId}/${sectionId}`}
            className="inline-flex items-center gap-2 text-[#F97316] font-semibold mb-6 hover:text-[#F97316] transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Topics
          </Link>

          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight text-[#F97316]">
              {displayName}
            </h1>
            <LanguageToggle />
          </div>
          <p className="text-[18px] text-[#FAFAF9]/70 font-[600] max-w-2xl mx-auto">
            Atomic learning intelligence targeted for Groups exams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : microTopics.length === 0 ? (
            <div className="text-center py-20 text-[#FAFAF9]/50 bg-white/5 rounded-xl border border-[#57534E]/40 border-dashed">
              <div className="text-4xl mb-4">⚛️</div>
              <p className="text-xl font-semibold mb-2">No micro-topics found.</p>
              <p>Guru intelligence has no atomic data here yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {microTopics.map((mt, index) => (
                <MicroTopicCard key={mt.microTopicId} mt={mt} language={language} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
