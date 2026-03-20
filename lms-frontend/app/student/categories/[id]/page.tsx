"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { subCategoryApi } from "@/lib/subcategories";
import { categoryApi } from "@/lib/categories";
import { SubCategory, Category } from "@/lib/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import Link from "next/link";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function StudentSubCategories() {
  const params = useParams();
  const categoryId = Number(params.id);
  const { language } = useLanguage();

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subs, cats] = await Promise.all([
        subCategoryApi.getByCategory(categoryId),
        categoryApi.getAll(),
      ]);
      setSubCategories(subs);
      setCategory(cats.find((c) => c.id === categoryId) || null);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            href="/student/categories"
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
            Back to Categories
          </Link>

          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-[40px] md:text-[56px] font-[800] leading-tight bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
              {category?.name || "Subjects"}
            </h1>
            <LanguageToggle />
          </div>
          <p className="text-[18px] text-white/70 font-[600] max-w-2xl mx-auto">
            Choose a subject to dive into sections and topics.
          </p>
        </motion.div>

        {/* SubCategory Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subCategories.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/student/categories/${categoryId}/${sub.id}`}
                  className="group relative block h-full p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 backdrop-blur-xl overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/20">
                      {(language === "te" && sub.nameTe
                        ? sub.nameTe
                        : sub.name
                      ).charAt(0)}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                      {language === "te" && sub.nameTe ? sub.nameTe : sub.name}
                    </h3>

                    {sub.syllabusCode && (
                      <span className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {sub.syllabusCode}
                      </span>
                    )}

                    <p className="text-white/60 font-medium leading-relaxed">
                      {language === "te" && sub.descriptionTe
                        ? sub.descriptionTe
                        : sub.description || "Explore sections and topics under this subject."}
                    </p>

                    <div className="mt-8 flex items-center text-purple-400 font-bold group/btn">
                      <span>Browse Sections</span>
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

        {subCategories.length === 0 && !isLoading && (
          <div className="text-center py-20 text-white/50 bg-white/5 rounded-[32px] border border-white/10 max-w-2xl mx-auto">
            <p className="text-xl font-semibold mb-2">No subjects available yet.</p>
            <p>Content for this category is being prepared. Check back soon!</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
