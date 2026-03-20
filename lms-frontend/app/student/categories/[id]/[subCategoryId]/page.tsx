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
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
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
            href={`/student/categories/${categoryId}`}
            className="inline-flex items-center gap-2 text-purple-400 font-semibold mb-6 hover:text-purple-300 transition-colors"
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
            <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
              {displayName}
            </h1>
            <LanguageToggle />
          </div>
          <p className="text-[18px] text-white/70 font-[600] max-w-2xl mx-auto">
            Explore sections to find the topics you want to master.
          </p>
        </motion.div>

        {/* Section Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
                {/* For now, section is the leaf — Sprint 5 will make this link to topics */}
                <div className="group relative block h-full p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 backdrop-blur-xl overflow-hidden cursor-default">
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-500/20">
                      {(language === "te" && sec.nameTe
                        ? sec.nameTe
                        : sec.name
                      ).charAt(0)}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                      {language === "te" && sec.nameTe ? sec.nameTe : sec.name}
                    </h3>

                    {sec.sectionCode && (
                      <span className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {sec.sectionCode}
                      </span>
                    )}

                    <p className="text-white/60 font-medium leading-relaxed">
                      {language === "te" && sec.descriptionTe
                        ? sec.descriptionTe
                        : sec.description || "Topics and study material for this section."}
                    </p>

                    {/* Sprint 5 will add a "Browse Topics" link here */}
                    <div className="mt-8 flex items-center text-indigo-400 font-bold">
                      <span className="text-white/40">Topics coming soon</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {sections.length === 0 && !isLoading && (
          <div className="text-center py-20 text-white/50 bg-white/5 rounded-[32px] border border-white/10 max-w-2xl mx-auto">
            <p className="text-xl font-semibold mb-2">No sections available yet.</p>
            <p>Sections for this subject are being prepared. Check back soon!</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
