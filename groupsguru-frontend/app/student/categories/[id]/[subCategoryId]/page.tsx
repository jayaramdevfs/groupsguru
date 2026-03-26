"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { sectionApi } from "@/lib/sections";
import { subCategoryApi } from "@/lib/subcategories";
import { Section, SubCategory } from "@/lib/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Multilang } from "@/components/ui/Multilang";
import Link from "next/link";

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

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <Link
            href={`/student/categories/${categoryId}`}
            className="inline-flex items-center gap-2 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-6 hover:text-[#F59E0B] transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Subjects
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Section Selection</div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
                {subCategory ? (
                  <Multilang en={subCategory.name} te={subCategory.nameTe || subCategory.name} />
                ) : (
                  "Sections"
                )}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </header>

        {/* Section Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((sec) => (
              <Link 
                key={sec.id}
                href={`/student/categories/${categoryId}/${subCategoryId}/${sec.id}`} 
                className="group bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg hover:border-[#D97706]/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center text-lg font-mono font-bold text-[#D97706]">
                    {sec.sectionCode?.charAt(0) || sec.name.charAt(0)}
                  </div>
                  {sec.sectionCode && (
                    <span className="text-[10px] font-mono text-[#666666] border border-[#3A3A3A] px-2 py-1 rounded group-hover:border-[#D97706]/30 transition-colors">
                      {sec.sectionCode}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#E8E8E8] mb-2 group-hover:text-[#D97706] transition-colors">
                  <Multilang en={sec.name} te={sec.nameTe} />
                </h3>

                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8">
                  <Multilang 
                    en={sec.description || "In-depth topics and preparation material for this specific syllabus section."} 
                    te={sec.descriptionTe || "ఈ నిర్దిష్ట సిలబస్ విభాగానికి సంబంధించి లోతైన అంశాలు మరియు ప్రిపరేషన్ మెటీరియల్."} 
                  />
                </p>

                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse Topics
                  <svg className="ml-2 w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {sections.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg">
            <p className="text-[#666666] font-mono text-sm uppercase tracking-widest">No sections available yet</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
