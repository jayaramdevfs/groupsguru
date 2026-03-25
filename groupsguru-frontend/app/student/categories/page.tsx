"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { categoryApi } from "@/lib/categories";
import { Category } from "@/lib/types";
import Link from "next/link";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

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
      <div className="min-h-screen py-10 px-6 md:px-12 w-full max-w-[92%] mx-auto text-[#FAFAF9] text-center">
        
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className="text-[32px] md:text-[48px] font-[800] leading-tight mb-3 text-[#F97316]">
            What are you preparing for?
          </h1>
          <p className="text-base text-[#FAFAF9]/70 font-[600] max-w-2xl mx-auto">
            Select a category to explore sub-categories, papers, and courses tailored for your success.
          </p>
        </motion.div>

        {/* Category Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Link 
                  href={`/student/categories/${cat.id}`}
                  className="group relative block h-full p-6 rounded-xl bg-white/5 border border-[#57534E]/40 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300  overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 mb-6 rounded-2xl bg-[#44403C] flex items-center justify-center text-2xl font-bold shadow-lg">
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        cat.name.charAt(0)
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#F97316] transition-colors">
                      {cat.name}
                    </h3>
                    
                    <p className="text-[#FAFAF9]/60 font-medium leading-relaxed">
                      {cat.description || "Explore available resources and tests for this category."}
                    </p>

                    <div className="mt-8 flex items-center text-[#F97316] font-bold group/btn">
                      <span>Browse Papers</span>
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
          </div>
        )}

        {categories.length === 0 && !isLoading && (
          <div className="text-center py-20 text-[#FAFAF9]/50 bg-white/5 rounded-xl border border-[#57534E]/40 max-w-2xl mx-auto">
            <p className="text-xl font-semibold mb-2">No categories available yet.</p>
            <p>Our team is working hard to bring you the best content. Please check back soon!</p>
          </div>
        )}

      </div>
    </ProtectedLayout>
  );
}
