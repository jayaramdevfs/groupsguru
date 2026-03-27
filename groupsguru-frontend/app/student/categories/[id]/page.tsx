"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { subCategoryApi } from "@/lib/subcategories";
import { categoryApi } from "@/lib/categories";
import { SubCategory, Category } from "@/lib/types";
import { useLanguage } from "@/app/context/LanguageContext";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Multilang } from "@/components/ui/Multilang";
import Link from "next/link";

export default function StudentSubCategories() {
  const params = useParams();
  const categoryId = Number(params.id);
  const { language } = useLanguage();

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("PRELIMS");

  const filteredSubs = subCategories.filter(s => 
    !s.phase || s.phase === activeTab || s.phase === "BOTH"
  );

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
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <Link
            href="/student/categories"
            className="inline-flex items-center gap-2 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-6 hover:text-[#F59E0B] transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Categories
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Subject Selection</div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
                {category ? (
                  <Multilang en={category.name} te={category.nameTe || category.name} />
                ) : (
                  "Subjects"
                )}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </header>

        {/* Phase Tabs */}
        {!isLoading && subCategories.length > 0 && (
          <div className="flex space-x-2 mb-8 border-b border-[#3A3A3A]">
            {["PRELIMS", "MAINS"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors border-b-2 ${
                  activeTab === tab 
                    ? "border-[#D97706] text-[#D97706]" 
                    : "border-transparent text-[#666666] hover:text-[#A0A0A0]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* SubCategory Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSubs.map((sub) => (
              <Link
                key={sub.id}
                href={`/student/categories/${categoryId}/${sub.id}`}
                className="group bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg hover:border-[#D97706]/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center text-lg font-mono font-bold text-[#D97706]">
                    {sub.syllabusCode || sub.name.charAt(0)}
                  </div>
                  {sub.syllabusCode && (
                    <span className="text-[10px] font-mono text-[#666666] border border-[#3A3A3A] px-2 py-1 rounded group-hover:border-[#D97706]/30 transition-colors">
                      {sub.syllabusCode}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-[#E8E8E8] mb-2 group-hover:text-[#D97706] transition-colors">
                  <Multilang en={sub.name} te={sub.nameTe} />
                </h3>

                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8">
                  <Multilang 
                    en={sub.description || "Comprehensive coverage of sections and modules under this subject."} 
                    te={sub.descriptionTe || "ఈ సబ్జెక్టు కింద ఉన్న విభాగాల వివరణాత్మక కవరేజీ."} 
                  />
                </p>

                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse Sections
                  <svg className="ml-2 w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredSubs.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg">
            <p className="text-[#666666] font-mono text-sm uppercase tracking-widest">No subjects available for this phase</p>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
