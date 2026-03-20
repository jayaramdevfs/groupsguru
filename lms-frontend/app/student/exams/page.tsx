"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { examsApi } from "@/lib/exams";
import { Exam, ExamType } from "@/lib/types";
import Link from "next/link";
import { Multilang } from "@/components/ui/Multilang";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

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
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">
        
        {/* Header Section */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight mb-4 bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
            <Multilang en="Available Exams" te="అందుబాటులో ఉన్న పరీక్షలు" />
          </h1>
          <p className="text-[18px] text-white/70 font-[600] max-w-2xl mx-auto">
            <Multilang 
              en="Challenge yourself with our curated tests. Practice makes perfect." 
              te="మా రూపొందించిన పరీక్షలతో మిమ్మల్ని మీరు సవాలు చేసుకోండి. సాధన మనిషిని పరిపూర్ణుడిని చేస్తుంది." 
            />
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {EXAM_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${
                activeTab === type.id
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 scale-105"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <Multilang en={type.label} te={type.labelTe} />
            </button>
          ))}
        </div>

        {/* Exam Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                >
                  <Link 
                    href={`/student/exams/${exam.id}`}
                    className="group relative block h-full p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6">
                      <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30 uppercase tracking-wider">
                        {exam.examType.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/20">
                        {exam.subject?.charAt(0) || "E"}
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                        <Multilang en={exam.name} te={exam.nameTe} />
                      </h3>
                      
                      <p className="text-white/60 font-medium leading-relaxed mb-8 line-clamp-2">
                        <Multilang en={exam.description || ""} te={exam.descriptionTe || ""} />
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Questions</p>
                          <p className="text-lg font-bold text-white">{exam.totalQuestions}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Duration</p>
                          <p className="text-lg font-bold text-white">{exam.durationMinutes}m</p>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center text-purple-400 font-bold group/btn">
                        <Multilang en="View Details" te="వివరాలు చూడండి" />
                        <svg 
                          className="ml-2 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" 
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filteredExams.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-white/50 bg-white/5 rounded-[32px] border border-white/10 max-w-2xl mx-auto"
          >
            <p className="text-xl font-semibold mb-2">
              <Multilang en="No exams found." te="పరీక్షలు కనుగొనబడలేదు." />
            </p>
            <p>
              <Multilang 
                en="Try a different category or check back later." 
                te="వేరే వర్గాన్ని ప్రయత్నించండి లేదా తర్వాత మళ్ళీ చూడండి." 
              />
            </p>
          </motion.div>
        )}

      </div>
    </ProtectedLayout>
  );
}
