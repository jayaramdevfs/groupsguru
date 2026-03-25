"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { commissionApi } from "@/lib/commissions";
import { Commission } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";

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
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-4">
            Preparation Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Welcome to <span className="text-[#D97706]">GroupsGuru</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl leading-relaxed">
            <Multilang 
              en="Select your target commission to start your intelligent preparation. Your path to excellence begins with structured study." 
              te="మీ ప్రిపరేషన్‌ను ప్రారంభించడానికి మీ లక్ష్య కమిషన్‌ను ఎంచుకోండి. క్రమబద్ధమైన అధ్యయనంతో మీ ప్రయాణం ప్రారంభమవుతుంది."
            />
          </p>
        </header>

        {/* Dynamic Commission Section */}
        <section className="mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-6 flex items-center gap-4">
            TARGET COMMISSIONS
            <span className="flex-1 h-[1px] bg-[#3A3A3A]"></span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-full py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              commissions.map((comm) => (
                <Link
                  key={comm.id}
                  href={`/student/categories?commissionId=${comm.id}`}
                  className="group bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg hover:border-[#D97706]/50 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center text-xl font-bold text-[#D97706]">
                      {comm.imageUrl ? (
                        <img src={comm.imageUrl} alt={comm.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        comm.code.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">{comm.name}</h3>
                      <div className="text-[10px] text-[#666666] font-mono">{comm.code}</div>
                    </div>
                  </div>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
                    {comm.description || `Browse topics and categories for ${comm.code}.`}
                  </p>
                  <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Preparation 
                    <svg className="ml-2 w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Secondary Navigation */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-6 flex items-center gap-4">
            ADDITIONAL TOOLS
            <span className="flex-1 h-[1px] bg-[#3A3A3A]"></span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/student/exams"
              className="group bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg hover:border-[#D97706]/50 transition-colors"
            >
              <div className="w-10 h-10 mb-6 flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100">
                📝
              </div>
              <h3 className="text-lg font-bold text-[#E8E8E8] mb-2 group-hover:text-[#D97706] transition-colors">
                Practice Exams
              </h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Topic-wise, section-wise, and full-length mock tests to sharpen your skills.
              </p>
            </Link>

            <div className="bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg opacity-40 cursor-default">
              <div className="w-10 h-10 mb-6 flex items-center justify-center text-2xl grayscale opacity-60">
                📊
              </div>
              <h3 className="text-lg font-bold text-[#E8E8E8] mb-2">Performance</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Detailed analytics of your exam attempts and topic mastery coming soon.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#3A3A3A] text-center">
          <p className="text-[10px] font-mono text-[#666666] uppercase tracking-[0.3em]">
            Empowering Your Success Through Intelligence
          </p>
        </footer>

      </div>
    </ProtectedLayout>
  );
}

