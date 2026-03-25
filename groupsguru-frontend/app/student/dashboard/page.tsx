"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { commissionApi } from "@/lib/commissions";
import { Commission } from "@/lib/types";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

export default function StudentDashboard() {
  const { logout } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommissions = useCallback(async () => {
    try {
      const data = await commissionApi.getAll();
      setCommissions(data);
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="min-h-screen py-10 px-6 md:px-12 w-full max-w-[92%] mx-auto text-[#FAFAF9] text-center">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className="text-[32px] md:text-[48px] font-[800] leading-tight mb-3 text-[#F97316]">
            Welcome Back
          </h1>
          <p className="text-base text-[#FAFAF9]/70 font-[600] max-w-2xl mx-auto">
            Select your target commission to start your intelligent preparation.
          </p>
        </motion.div>

        {/* Dynamic Commission Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {isLoading ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            commissions.map((comm, index) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/student/categories?commissionId=${comm.id}`}
                  className="group relative block h-full p-8 rounded-xl bg-white/5 border border-[#57534E]/40 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300  overflow-hidden text-left"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 mb-6 rounded-2xl bg-[#44403C] flex items-center justify-center text-2xl shadow-lg overflow-hidden font-bold">
                      {comm.imageUrl ? (
                        <img src={comm.imageUrl} alt={comm.name} className="w-full h-full object-cover" />
                      ) : (
                        comm.code.charAt(0)
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#F97316] transition-colors">
                      {comm.name}
                    </h3>
                    <p className="text-[#FAFAF9]/60 font-medium leading-relaxed">
                      {comm.description || `Browse categories for ${comm.code}`}
                    </p>
                    <div className="mt-8 flex items-center text-[#F97316] font-bold group/btn">
                      <span>Explore</span>
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
            ))
          )}
        </div>

        {/* Existing Utilities */}
        <h2 className="text-2xl font-bold mb-6 text-left pl-4">Tools & Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.4 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <Link
              href="/student/exams"
              className="group relative block h-full p-8 rounded-xl bg-white/5 border border-[#57534E]/40 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 overflow-hidden text-left"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-[#44403C] flex items-center justify-center text-2xl shadow-lg">
                  <svg className="w-6 h-6 text-[#F97316]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[#F97316] transition-colors">
                  Practice Exams
                </h3>
                <p className="text-[#FAFAF9]/60 font-medium leading-relaxed">
                  Take topic-wise, section-wise, and full-length mock tests.
                </p>
              </div>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.5 }}
          >
            <div className="group relative block h-full p-8 rounded-xl bg-white/[0.03] border border-[#57534E]/40  overflow-hidden opacity-60 cursor-default text-left">
              <div className="relative z-10">
                <div className="w-14 h-14 mb-6 rounded-2xl bg-[#44403C] flex items-center justify-center text-2xl shadow-lg">
                  <svg className="w-6 h-6 text-[#F97316]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">My Dashboard</h3>
                <p className="text-[#FAFAF9]/60 font-medium leading-relaxed">
                  Track your progress, scores, and study analytics.
                </p>
                <div className="mt-8">
                  <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-[#FAFAF9]/50 border border-[#57534E]/40">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
