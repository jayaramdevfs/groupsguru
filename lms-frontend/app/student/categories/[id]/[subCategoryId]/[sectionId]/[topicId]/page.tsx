"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { registryApi } from "@/lib/registry";
import { topicApi } from "@/lib/topics";
import { MicroTopic, Topic } from "@/lib/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import Link from "next/link";
import { Multilang } from "@/components/ui/Multilang";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

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
      const [tops, mtData] = await Promise.all([
        topicApi.getBySection(sectionId),
        registryApi.getPublicMicroTopics(0, 500) // fetch all for now and filter manually if topic search is missing on backend
      ]);
      const currentTopic = tops.find((t) => t.id === topicId) || null;
      setTopic(currentTopic);
      
      // Filter microTopics that belong to this topic
      setMicroTopics(mtData.content.filter(mt => mt.topicId === topicId));
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
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          {/* Back Link */}
          <Link
            href={`/student/categories/${categoryId}/${subCategoryId}/${sectionId}`}
            className="inline-flex items-center gap-2 text-cyan-400 font-semibold mb-6 hover:text-cyan-300 transition-colors"
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
            <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight bg-gradient-to-r from-white via-white to-cyan-400 bg-clip-text text-transparent">
              {displayName}
            </h1>
            <LanguageToggle />
          </div>
          <p className="text-[18px] text-white/70 font-[600] max-w-2xl mx-auto">
            Atomic learning intelligence targeted for Groups exams.
          </p>
        </motion.div>

        {/* List Section for Micro-Topics */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : microTopics.length === 0 ? (
            <div className="text-center py-20 text-white/50 bg-white/5 rounded-[32px] border border-white/10 border-dashed">
              <div className="text-4xl mb-4">⚛️</div>
              <p className="text-xl font-semibold mb-2">No micro-topics found.</p>
              <p>Guru intelligence has no atomic data here yet.</p>
            </div>
          ) : (
            <AnimatePresence>
              {microTopics.map((mt, index) => (
                <motion.div
                  key={mt.microTopicId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="w-full flex flex-col md:flex-row items-center gap-6 p-8 rounded-[32px] bg-white/[0.03] border border-white/5 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] group-hover:bg-cyan-500/10 transition-all" />
                  
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-black text-xl text-cyan-300">
                    ⚛️
                  </div>

                  <div className="flex-1 w-full relative z-10">
                     <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-cyan-400 font-mono text-[10px] font-bold px-2 py-0.5 border border-cyan-400/20 rounded-full">{mt.microTopicId}</span>
                        <span className="text-purple-400 text-[10px] font-bold px-2 py-0.5 border border-purple-400/20 rounded-full bg-purple-400/5">{mt.subject}</span>
                        {mt.paper && <span className="text-blue-400 text-[10px] font-bold px-2 py-0.5 border border-blue-400/20 rounded-full bg-blue-400/5">{mt.paper}</span>}
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">{mt.topicName || "Atomic Topic"}</h3>
                     <p className="text-sm text-white/60 leading-relaxed mb-3">{mt.microTopicText}</p>
                     
                     <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-xs font-semibold text-white/30">
                        {mt.groupApplicability && <span>🎯 {mt.groupApplicability}</span>}
                        {mt.dataConfidence && <span>✓ Confidence: {mt.dataConfidence.toUpperCase()}</span>}
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
