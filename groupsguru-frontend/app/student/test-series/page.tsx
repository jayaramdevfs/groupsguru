"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { testSeriesApi } from "@/lib/testSeries";
import { TestSeries, Exam } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentTestSeries() {
  const [seriesList, setSeriesList] = useState<TestSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeSeries, setActiveSeries] = useState<TestSeries | null>(null);
  const [seriesExams, setSeriesExams] = useState<Exam[]>([]);
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const series = await testSeriesApi.getAllStudent();
      setSeriesList(series || []);
    } catch (error) {
      console.error("Failed to fetch test series:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenSeries = async (ts: TestSeries) => {
    setActiveSeries(ts);
    // paywall mockup
    if (ts.accessType === "PAID") {
        // Assume user doesn't have access in this quick proto unless checking actual entitlement
        alert("This is a premium series. Razorpay checkout would trigger here for ₹" + ts.priceInr);
        return; // wait realistically student wouldn't be blocked just viewing exams, maybe blocked on Start
    }
    
    try {
      const exams = await testSeriesApi.getStudentSeriesExams(ts.id);
      setSeriesExams(exams || []);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
      setSeriesExams([]);
    }
    setIsExamsModalOpen(true);
  };

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D97706] mb-2">Practice Hub</div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
            Test <span className="text-[#D97706]">Series</span>
          </h1>
          <p className="text-[#A0A0A0] mt-4 max-w-2xl text-lg font-serif italic">
            "Master your subjects with targeted practice and full-length mocks."
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-1 md:col-span-2 flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : seriesList.length === 0 ? (
            <div className="col-span-1 md:col-span-2 text-center py-20 text-[#666666] bg-[#1E1E1E] rounded border border-[#3A3A3A] font-mono text-sm uppercase tracking-widest">
              No test series available yet. Check back soon.
            </div>
          ) : (
            seriesList.map((ts) => (
              <div
                key={ts.id}
                onClick={() => handleOpenSeries(ts)}
                className="group cursor-pointer flex flex-col p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] hover:border-[#D97706] transition-colors relative"
              >
                  {ts.accessType === "PAID" && (
                     <div className="absolute top-4 right-4 bg-[#C74444]/10 text-[#C74444] px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border border-[#C74444]/20 flex items-center gap-1">
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                         ₹{ts.priceInr}
                     </div>
                  )}

                  <div className="mb-4">
                     <span className="inline-block px-2 py-0.5 rounded bg-[#141414] text-[#A0A0A0] border border-[#3A3A3A] text-[9px] font-mono font-bold uppercase mb-3">
                        {ts.seriesType.replace('_', ' ')}
                     </span>
                     <h3 className="text-xl font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors line-clamp-2">
                        <Multilang en={ts.name} te={ts.nameTe} />
                     </h3>
                  </div>

                  <p className="text-sm text-[#A0A0A0] line-clamp-2 mb-6 flex-1">
                     <Multilang en={ts.description || ''} te={ts.descriptionTe || ''} />
                  </p>

                  <div className="pt-4 border-t border-[#3A3A3A] flex justify-between items-center text-sm font-mono text-[#A0A0A0]">
                     <span>{ts.totalExams} Exams</span>
                     <span className="text-[#D97706] group-hover:translate-x-1 transition-transform">
                        Explore →
                     </span>
                  </div>
              </div>
            ))
          )}
        </div>

        {/* Exams Modal */}
        <Modal 
          isOpen={isExamsModalOpen} 
          onClose={() => setIsExamsModalOpen(false)}
          title={`Series: ${activeSeries?.name}`}
        >
          <div className="pt-4 space-y-4">
             <p className="text-[#E8E8E8] text-sm mb-6"><Multilang en={activeSeries?.description||''} te={activeSeries?.descriptionTe||''} /></p>

             <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2">
                 {seriesExams.length === 0 ? (
                     <p className="text-[#666666] text-center font-mono text-sm py-4">No exams available in this series.</p>
                 ) : (
                     seriesExams.map((ex, i) => (
                         <div key={ex.id} className="p-4 border border-[#3A3A3A] rounded flex flex-col md:flex-row justify-between items-start md:items-center bg-[#141414] gap-4">
                             <div>
                                <h4 className="text-[#E8E8E8] text-base font-bold mb-1">
                                    <span className="text-[#D97706] mr-2">#{i+1}</span>
                                    <Multilang en={ex.name} te={ex.nameTe} />
                                </h4>
                                <div className="flex gap-4 text-xs font-mono text-[#A0A0A0]">
                                    <span>{ex.totalQuestions} Questions</span>
                                    <span>{ex.durationMinutes} Mins</span>
                                </div>
                             </div>
                             
                             <button 
                                onClick={() => router.push(`/student/exams/${ex.id}?practice=${activeSeries?.seriesType === 'PRACTICE'}`)}
                                className="px-5 py-2.5 rounded bg-[#2D2D2D] text-[#E8E8E8] font-bold text-xs uppercase tracking-widest hover:bg-[#D97706] hover:text-white transition-colors whitespace-nowrap"
                             >
                                 {activeSeries?.seriesType === 'PRACTICE' ? 'Practice Mode' : 'Start Exam'}
                             </button>
                         </div>
                     ))
                 )}
             </div>
          </div>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
