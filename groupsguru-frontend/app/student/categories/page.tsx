"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { categoryApi } from "@/lib/categories";
import { Category } from "@/lib/types";
import Link from "next/link";
import { Multilang } from "@/components/ui/Multilang";
import { Landmark } from "lucide-react";

export default function StudentCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8 text-center sm:text-left">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-4">
            Browse Catalogue
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Exam <span className="text-[#D97706]">Categories</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl leading-relaxed mx-auto sm:mx-0">
            <Multilang 
              en="Select your target exam to explore subjects, sections, and topics curated for your success." 
              te="మీ లక్ష్య పరీక్షను ఎంచుకోండి మరియు సబ్జెక్టులు, సెక్షన్లు మరియు టాపిక్‌లను అన్వేషించండి."
            />
          </p>
        </header>

        {/* Category Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.id}
                href={`/student/categories/${cat.id}`}
                className="group bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg hover:border-[#D97706]/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center text-xl font-bold text-[#D97706]">
                    {cat.name.includes("APPSC") ? (
                      <Landmark className="w-6 h-6 text-[#D97706]" />
                    ) : cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      cat.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>
                
                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8">
                  {cat.description || "Comprehensive resources and practice tests tailored for this exam category."}
                </p>

                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse Subjects
                  <svg className="ml-2 w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {categories.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg">
            <p className="text-[#666666] font-mono text-sm uppercase tracking-widest">No categories available yet</p>
          </div>
        )}

      </div>
    </ProtectedLayout>
  );
}
