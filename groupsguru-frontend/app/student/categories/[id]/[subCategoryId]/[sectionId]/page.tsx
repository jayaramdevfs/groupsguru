"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { topicApi } from "@/lib/topics";
import { sectionApi } from "@/lib/sections";
import { Topic, Section } from "@/lib/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import Link from "next/link";
import { Multilang } from "@/components/ui/Multilang";
import { accessApi, AccessCheckResponse } from "@/lib/access";
import PaywallModal from "@/components/ui/PaywallModal";
import PriceBadge from "@/components/ui/PriceBadge";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

export default function StudentTopics() {
  const params = useParams();
  const categoryId = Number(params.id);
  const subCategoryId = Number(params.subCategoryId);
  const sectionId = Number(params.sectionId);
  const { language } = useLanguage();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [section, setSection] = useState<Section | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Paywall states
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [accessInfo, setAccessInfo] = useState<AccessCheckResponse | null>(null);
  const [loadingTopic, setLoadingTopic] = useState<Topic | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tops, secs] = await Promise.all([
        topicApi.getBySection(sectionId),
        sectionApi.getBySubCategory(subCategoryId),
      ]);
      setTopics(tops);
      setSection(secs.find((s) => s.id === sectionId) || null);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sectionId, subCategoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayName = section
    ? language === "te" && section.nameTe
      ? section.nameTe
      : section.name
    : "Topics";

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-[#FAFAF9]">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          {/* Back Link */}
          <Link
            href={`/student/categories/${categoryId}/${subCategoryId}`}
            className="inline-flex items-center gap-2 text-emerald-400 font-semibold mb-6 hover:text-emerald-300 transition-colors"
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
            Back to Sections
          </Link>

          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight text-[#F97316]">
              {displayName}
            </h1>
            <LanguageToggle />
          </div>
          <p className="text-[18px] text-[#FAFAF9]/70 font-[600] max-w-2xl mx-auto">
            Explore atomic topics to master this section.
          </p>
        </motion.div>

        {/* List Section for Topics */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-20 text-[#FAFAF9]/50 bg-white/5 rounded-xl border border-[#57534E]/40 border-dashed">
              <div className="text-4xl mb-4">🧠</div>
              <p className="text-xl font-semibold mb-2">No topics found.</p>
              <p>Topics for this section are still under construction.</p>
            </div>
          ) : (
            <AnimatePresence>
              {topics.map((top, index) => (
                <motion.div
                  key={top.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="w-full relative"
                >
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      setLoadingTopic(top);
                      try {
                        const check = await accessApi.checkAccess("TOPIC", top.id);
                        if (check.hasAccess) {
                          window.location.href = `/student/categories/${categoryId}/${subCategoryId}/${sectionId}/${top.id}`;
                        } else {
                          setAccessInfo(check);
                          setSelectedTopic(top);
                          setIsPaywallOpen(true);
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setLoadingTopic(null);
                      }
                    }}
                    className="w-full flex flex-col md:flex-row items-center gap-6 p-8 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden text-left"
                  >
                    {/* Background Glow on Hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5  group-hover:bg-emerald-500/10 transition-all" />

                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#44403C] border border-[#57534E]/40 flex items-center justify-center font-bold text-xl text-[#F97316]">
                      {top.topicCode || top.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 w-full relative z-10">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-[#FAFAF9] group-hover:text-emerald-300 transition-colors">
                          <Multilang en={top.name} te={top.nameTe} />
                        </h3>
                        <PriceBadge price={top.priceInr ?? null} isFree={top.accessType === "FREE"} />
                      </div>
                      {(top.description || top.descriptionTe) && (
                        <p className="text-sm font-medium text-[#FAFAF9]/40 line-clamp-2 max-w-2xl leading-relaxed">
                          <Multilang en={top.description || ""} te={top.descriptionTe || ""} />
                        </p>
                      )}
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="flex items-center text-[#F97316] font-bold group/btn">
                        {loadingTopic?.id === top.id ? (
                           <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Browse Micro-Topics</span>
                            <svg
                              className="ml-2 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
              </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        accessInfo={accessInfo}
        entityType="TOPIC"
        entityId={selectedTopic?.id || 0}
        entityName={selectedTopic?.name || "Topic"}
        onSuccess={() => {
          // Success! Refresh data or navigate
          if (selectedTopic) {
             window.location.href = `/student/categories/${categoryId}/${subCategoryId}/${sectionId}/${selectedTopic.id}`;
          }
        }}
      />
    </ProtectedLayout>
  );
}
