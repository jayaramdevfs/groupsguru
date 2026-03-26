"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
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

function QuestionCard({ question, language }: { question: Question; language: string }) {
  const [showAnswer, setShowAnswer] = useState(false);
  
  const qText = language === "te" && question.questionTextTe ? question.questionTextTe : question.questionTextEn;
  const optA = language === "te" && question.optionATe ? question.optionATe : question.optionAEn;
  const optB = language === "te" && question.optionBTe ? question.optionBTe : question.optionBEn;
  const optC = language === "te" && question.optionCTe ? question.optionCTe : question.optionCEn;
  const optD = language === "te" && question.optionDTe ? question.optionDTe : question.optionDEn;
  const explanation = language === "te" && question.explanationTe ? question.explanationTe : question.explanationEn;

  return (
    <div className="bg-[#141414] border border-[#3A3A3A] rounded p-6">
       <div className="flex justify-between items-start mb-6">
         <div className="flex gap-2">
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#3A3A3A] text-[#666666] uppercase tracking-widest">
              {question.difficulty}
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/5 text-[#D97706] uppercase tracking-widest">
              {question.questionType}
            </span>
         </div>
       </div>
       
       <div className="text-base font-bold text-[#E8E8E8] mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: qText || '' }} />
       
       <div className="grid grid-cols-1 gap-3 mb-8">
         {['A', 'B', 'C', 'D'].map((letter, idx) => {
           const optText = [optA, optB, optC, optD][idx];
           const isCorrect = showAnswer && question.correctOption === letter;
           return (
             <div key={letter} className={`p-4 rounded border flex gap-4 transition-colors ${isCorrect ? 'bg-[#10B981]/5 border-[#10B981]/40 text-[#10B981]' : 'bg-[#191919] border-[#3A3A3A] text-[#A0A0A0]'}`}>
                <span className="font-mono font-bold opacity-40 text-xs">{letter}</span>
                <span className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: optText || '' }} />
             </div>
           );
         })}
       </div>
       
       <button 
         onClick={() => setShowAnswer(!showAnswer)} 
         className="px-4 py-2 bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30 rounded hover:bg-[#D97706]/20 transition-colors text-[10px] font-mono font-bold uppercase tracking-[0.2em]"
       >
         {showAnswer ? "HIDE_RATIONALE" : "REVEAL_PROTOCOL"}
       </button>
       
       {showAnswer && (
          <div className="mt-8 pt-8 border-t border-[#3A3A3A]">
             <div className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-[0.2em] mb-4">Verification: VECTOR_{question.correctOption}</div>
             {explanation && (
               <div className="text-sm text-[#E8E8E8] leading-relaxed bg-[#191919] p-6 rounded border border-[#3A3A3A] font-mono whitespace-pre-line" dangerouslySetInnerHTML={{ __html: explanation }} />
             )}
          </div>
       )}
    </div>
  );
}

function MicroTopicCard({ mt, language }: { mt: MicroTopic; language: string; index: number }) {
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
    <div className={`w-full overflow-hidden bg-[#1C1C1C] border border-[#3A3A3A] rounded transition-colors ${expanded ? 'border-[#666666]' : 'hover:border-[#666666]'}`}>
        <button 
          className="w-full flex flex-col sm:flex-row sm:items-center gap-6 p-6 text-left"
          onClick={handleExpand}
        >
           <div className="w-10 h-10 shrink-0 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center font-mono font-bold text-xs text-[#D97706]">
             L4
           </div>
           
           <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                 <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em]">{mt.microTopicId}</span>
                 {mt.paper && <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 border border-[#3A3A3A] rounded text-[#666666] uppercase tracking-widest">{mt.paper}</span>}
              </div>
              <h3 className="text-xl font-bold text-[#E8E8E8] mb-1">{mt.topicName || "Atomic Topic"}</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed line-clamp-2">{mt.microTopicText}</p>
           </div>
           
           <div className="shrink-0">
              <div className={`p-2 rounded text-[#666666] transition-transform ${expanded ? 'rotate-180 text-[#D97706]' : ''}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
           </div>
        </button>

        {expanded && (
          <div className="px-6 pb-8 pt-8 border-t border-[#3A3A3A]">
             <div className="flex items-center gap-4 mb-8">
               <div className="h-px flex-1 bg-[#3A3A3A]"></div>
               <div className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#666666]">Assessment Inventory</div>
               <div className="h-px flex-1 bg-[#3A3A3A]"></div>
             </div>

             {isLoading ? (
               <div className="py-12 flex flex-col items-center gap-4">
                  <div className="w-6 h-6 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest">Querying Corpus...</span>
               </div>
             ) : questions.length === 0 ? (
               <div className="py-12 text-center text-[#666666] font-mono text-[10px] uppercase tracking-[0.2em] bg-[#141414] rounded border border-[#3A3A3A]">
                 // ASSESSMENT_EMPTY
               </div>
             ) : (
               <div className="space-y-6">
                 {questions.map((q) => (
                   <QuestionCard key={q.id} question={q} language={language} />
                 ))}
               </div>
             )}
          </div>
        )}
    </div>
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

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div className="flex-1">
             <Link
              href={`/student/categories/${categoryId}/${subCategoryId}/${sectionId}`}
              className="inline-flex items-center gap-2 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-6 hover:opacity-70 transition-opacity"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Level_03 Root
            </Link>

            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Knowledge Subset_v2</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              {topic ? (
                <Multilang en={topic.name} te={topic.nameTe || topic.name} />
              ) : (
                "Micro-Topics"
              )}
            </h1>
          </div>
          <LanguageToggle />
        </header>

        {/* Micro-Topic Grid */}
        <div className="pb-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Parsing Subset...</span>
            </div>
          ) : microTopics.length === 0 ? (
            <div className="text-center py-20 bg-[#1C1C1C] border border-[#3A3A3A] rounded">
               <p className="text-[#666666] font-mono text-[10px] uppercase tracking-[0.2em]">// INDEX_EMPTY</p>
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
