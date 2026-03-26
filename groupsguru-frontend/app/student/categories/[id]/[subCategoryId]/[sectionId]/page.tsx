"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
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

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <Link
            href={`/student/categories/${categoryId}/${subCategoryId}`}
            className="inline-flex items-center gap-2 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-6 hover:text-[#F59E0B] transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Sections
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Topic Selection</div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
                {section ? (
                  <Multilang en={section.name} te={section.nameTe || section.name} />
                ) : (
                  "Topics"
                )}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </header>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-20 bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg">
              <p className="text-[#666666] font-mono text-sm uppercase tracking-widest">No topics available yet</p>
            </div>
          ) : (
            topics.map((top) => (
              <button 
                key={top.id}
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
                className="w-full text-left group bg-[#1E1E1E] border border-[#3A3A3A] p-5 rounded-lg hover:border-[#D97706]/50 transition-colors flex flex-col sm:flex-row sm:items-center gap-6"
              >
                <div className="w-12 h-12 shrink-0 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center font-mono font-bold text-lg text-[#D97706]">
                  {top.topicCode || top.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors truncate">
                      <Multilang en={top.name} te={top.nameTe} />
                    </h3>
                    <PriceBadge price={top.priceInr ?? 0} isFree={top.accessType === "FREE"} />
                  </div>
                  {(top.description || top.descriptionTe) && (
                    <p className="text-sm text-[#A0A0A0] line-clamp-1">
                      <Multilang en={top.description || ""} te={top.descriptionTe || ""} />
                    </p>
                  )}
                </div>

                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">
                  {loadingTopic?.id === top.id ? (
                    <div className="w-4 h-4 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Micro-Topics →"
                  )}
                </div>
              </button>
            ))
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
          if (selectedTopic) {
             window.location.href = `/student/categories/${categoryId}/${subCategoryId}/${sectionId}/${selectedTopic.id}`;
          }
        }}
      />
    </ProtectedLayout>
  );
}
