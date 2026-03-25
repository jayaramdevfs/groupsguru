"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { sectionApi } from "@/lib/sections";
import { subCategoryApi } from "@/lib/subcategories";
import { Section, SubCategory } from "@/lib/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import Link from "next/link";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

export default function StudentSections() {
  const params = useParams();
  const categoryId = Number(params.id);
  const subCategoryId = Number(params.subCategoryId);
  const { language } = useLanguage();

  const [sections, setSections] = useState<Section[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [secs, subs] = await Promise.all([
        sectionApi.getBySubCategory(subCategoryId),
        subCategoryApi.getByCategory(categoryId),
      ]);
      setSections(secs);
      setSubCategory(subs.find((s) => s.id === subCategoryId) || null);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const displayName = subCategory
    ? language === "te" && subCategory.nameTe
      ? subCategory.nameTe
      : subCategory.name
    : "Sections";

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
            href={`/student/categories/${categoryId}`}
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
            Back to Subjects
          </Link>

          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight text-[#F97316]">
              {displayName}
            </h1>
            <LanguageToggle />
          </div>
          <p className="text-[18px] text-[#FAFAF9]/70 font-[600] max-w-2xl mx-auto">
            Explore sections to find the topics you want to master.
          </p>
        </motion.div>

        {/* Section Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((sec, index) => (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Link href={`/student/categories/${categoryId}/${subCategoryId}/${sec.id}`} className="group relative block h-full p-8 rounded-xl bg-white/5 border border-[#57534E]/40 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300  overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-14 h-14 mb-6 rounded-2xl bg-[#44403C] flex items-center justify-center text-2xl font-bold shadow-lg">
                      {(language === "te" && sec.nameTe
                        ? sec.nameTe
                        : sec.name
                      ).charAt(0)}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#F97316] transition-colors">
                      {language === "te" && sec.nameTe ? sec.nameTe : sec.name}
                    </h3>

                    {sec.sectionCode && (
                      <span className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-bold bg-orange-500/20 text-[#F97316] border border-[#57534E]/40">
                        {sec.sectionCode}
                      </span>
                    )}

                    <p className="text-[#FAFAF9]/60 font-medium leading-relaxed">
                      {language === "te" && sec.descriptionTe
                        ? sec.descriptionTe
                        : sec.description || "Topics and study material for this section."}
                    </p>

                    <div className="mt-8 flex items-center text-[#F97316] font-bold group/btn">
                      <span>Browse Topics</span>
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
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {sections.length === 0 && !isLoading && (
          <div className="text-center py-20 text-[#FAFAF9]/50 bg-white/5 rounded-xl border border-[#57534E]/40 max-w-2xl mx-auto">
            <p className="text-xl font-semibold mb-2">No sections available yet.</p>
            <p>Sections for this subject are being prepared. Check back soon!</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
