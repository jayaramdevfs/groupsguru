"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback, useMemo } from "react";
import { examsApi } from "@/lib/exams";
import { Exam, ExamType } from "@/lib/types";
import Link from "next/link";
import { Multilang } from "@/components/ui/Multilang";

const EXAM_TYPES: { id: ExamType | "ALL"; label: string; labelTe: string }[] = [
  { id: "ALL", label: "All Exams", labelTe: "అన్ని పరీక్షలు" },
  { id: "TOPIC_WISE", label: "Topic Wise", labelTe: "టాపిక్ వారీగా" },
  { id: "SECTION_WISE", label: "Section Wise", labelTe: "సెక్షన్ వారీగా" },
  { id: "SUBJECT_WISE", label: "Subject Wise", labelTe: "సబ్జెక్ట్ వారీగా" },
  { id: "FULL_LENGTH_TEST", label: "Full Length", labelTe: "పూర్తి స్థాయి" },
];

export default function StudentExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ExamType | "ALL">("ALL");

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await examsApi.getAll();
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const filteredExams = useMemo(() => {
    if (activeTab === "ALL") return exams;
    return exams.filter((e) => e.examType === activeTab);
  }, [exams, activeTab]);

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8 text-center sm:text-left">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-4">
            Practice Center
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Available <span className="text-[#D97706]">Exams</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl leading-relaxed mx-auto sm:mx-0">
            <Multilang 
              en="Challenge yourself with our curated tests. Practice makes perfect." 
              te="మా రూపొందించిన పరీక్షలతో మిమ్మల్ని మీరు సవాలు చేసుకోండి. సాధన మనిషిని పరిపూర్ణుడిని చేస్తుంది." 
            />
          </p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-8 border-b border-[#3A3A3A] pb-6">
          {EXAM_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-4 py-2 rounded border transition-colors text-[11px] font-bold uppercase tracking-wider ${
                activeTab === type.id
                  ? "bg-[#D97706] text-white border-[#D97706]"
                  : "bg-[#141414] text-[#666666] border-[#3A3A3A] hover:border-[#D97706]/30 hover:text-[#A0A0A0]"
              }`}
            >
              <Multilang en={type.label} te={type.labelTe} />
            </button>
          ))}
        </div>

        {/* Exam Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredExams.map((exam) => (
              <Link 
                key={exam.id}
                href={`/student/exams/${exam.id}`}
                className="group p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] hover:border-[#D97706]/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center text-xl font-bold text-[#D97706] font-mono">
                    {exam.subject?.charAt(0) || "E"}
                  </div>
                  <div className="px-2 py-1 rounded border border-[#3A3A3A] bg-[#141414] text-[#666666] text-[10px] font-mono uppercase tracking-wider group-hover:border-[#D97706]/30 transition-colors">
                    {exam.examType.replace('_', ' ')}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#E8E8E8] mb-2 group-hover:text-[#D97706] transition-colors">
                  <Multilang en={exam.name} te={exam.nameTe} />
                </h3>
                
                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8 line-clamp-2">
                  <Multilang en={exam.description || "Comprehensive test designed to evaluate your understanding of this topic."} te={exam.descriptionTe || "ఈ అంశంపై మీ అవగాహనను అంచనా వేయడానికి రూపొందించబడిన సమగ్ర పరీక్ష."} />
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#3A3A3A] mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#666666] font-bold mb-1">Questions</p>
                    <p className="text-lg font-bold text-[#E8E8E8] font-mono">{exam.totalQuestions}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#666666] font-bold mb-1">Duration</p>
                    <p className="text-lg font-bold text-[#E8E8E8] font-mono">{exam.durationMinutes}m</p>
                  </div>
                </div>

                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D97706]">
                  View Details
                  <svg 
                    className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && filteredExams.length === 0 && (
          <div className="text-center py-20 text-[#666666] bg-[#1E1E1E] rounded-lg border border-[#3A3A3A]">
            <p className="text-sm font-mono uppercase tracking-widest mb-2">No exams found</p>
            <p className="text-xs">
              <Multilang 
                en="Try a different category or check back later." 
                te="వేరే వర్గాన్ని ప్రయత్నించండి లేదా తర్వాత మళ్ళీ చూడండి." 
              />
            </p>
          </div>
        )}

      </div>
    </ProtectedLayout>
  );
}
