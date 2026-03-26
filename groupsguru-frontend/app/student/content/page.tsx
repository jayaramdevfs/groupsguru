"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { contentApi } from "@/lib/content";
import { StudyMaterial } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Download, Search, ChevronRight, Home, Filter, Clock, FileText, Sparkles, LayoutGrid, List, ArrowRight } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export default function StudentContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subject") || "ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await contentApi.getAllPublished(0, 500);
      const data = Array.isArray(all) ? all : (all.content || []);
      setMaterials(data);
      
      const uniqueSubjects = Array.from(new Set(data.map((m: StudyMaterial) => m.subject).filter(Boolean))) as string[];
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error("Failed to fetch study materials", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSubject = selectedSubject === "ALL" || m.subject === selectedSubject;
      const matchSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (m.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSubject && matchSearch;
    });
  }, [materials, selectedSubject, searchTerm]);

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="min-h-screen bg-[#111110] text-[#E8E8E8] flex flex-col">
        {/* Refined Industrial Workspace Header */}
        <header className="relative pt-12 pb-10 px-8 border-b border-[#2A2A28] bg-gradient-to-b from-[#141413] to-[#111110] overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D97706]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
            <div className="flex-1">
              <nav className="flex items-center gap-2.5 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#444444] mb-6">
                <Link href="/student/dashboard" className="hover:text-[#D97706] transition-all flex items-center gap-1.5 focus:outline-none">
                  <Home size={12} /> Root
                </Link>
                <div className="w-1 h-1 rounded-full bg-[#2A2A28]" />
                <span className="text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 border border-[#D97706]/20 rounded text-[9px]">Vault</span>
              </nav>

              <div className="flex items-center gap-4 mb-4 group">
                 <div className="p-2.5 bg-[#D97706] rounded-xl shadow-xl shadow-[#D97706]/10 transition-all group-hover:bg-[#F59E0B]">
                   <Sparkles size={20} className="text-white" />
                 </div>
                 <div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-none mb-2">
                       Knowledge <span className="text-[#D97706]">Vault</span>
                    </h1>
                    <div className="h-0.5 w-24 bg-gradient-to-r from-[#D97706] to-transparent rounded-full opacity-40" />
                 </div>
              </div>
              <p className="text-[#666666] max-w-lg text-sm md:text-base font-light leading-relaxed">
                High-density registry of predictive study modules and synchronized exam dictionary assets.
              </p>
            </div>

            {/* Standard Registry Search Node */}
            <div className="w-full lg:max-w-md group">
               <div className="relative">
                  <Search className="absolute left-5 text-[#444444] group-focus-within:text-[#D97706] transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Retrieve data node..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#191918] border border-[#2A2A28] rounded-xl pl-12 pr-6 py-3.5 text-sm text-white placeholder:text-[#3A3A3A] focus:border-[#D97706]/50 outline-none transition-all shadow-lg"
                  />
               </div>
            </div>
          </div>
        </header>

        {/* Docked Taxonomy Registry Bar */}
        <div className="sticky top-0 z-40 bg-[#111110]/95 backdrop-blur-3xl border-b border-[#2A2A28] px-8 py-3 shadow-md">
           <div className="max-w-[1400px] mx-auto flex items-center gap-8">
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-[#444444] uppercase tracking-[0.3em] shrink-0 border-r border-[#2A2A28] pr-6 hidden md:flex">
                <Filter size={12} /> Index
              </div>
              
              <div className="relative">
                 <button 
                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   className="bg-[#191918] border border-[#2A2A28] rounded-lg px-5 py-2 pr-10 text-[10px] font-mono font-bold text-[#CCCCCC] uppercase tracking-widest outline-none hover:border-[#D97706]/40 transition-all shadow-xl min-w-[200px] text-left group"
                 >
                    <span className="text-[#D97706]/50 mr-2">#</span>
                    <span className="truncate">{selectedSubject === "ALL" ? "GLOBAL REGISTRY" : selectedSubject}</span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] group-hover:text-[#D97706] transition-colors">
                      <ChevronRight size={12} className={cn("transition-transform duration-300", isDropdownOpen ? "-rotate-90" : "rotate-90")} />
                    </div>
                 </button>

                 {isDropdownOpen && (
                   <>
                     <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                     <div className="absolute top-full left-0 mt-2 w-full bg-[#191918] border border-[#2A2A28] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                       <button 
                         onClick={() => { setSelectedSubject("ALL"); setIsDropdownOpen(false); }}
                         className={cn(
                           "w-full text-left px-5 py-2.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-colors border-b border-[#2A2A28]/30",
                           selectedSubject === "ALL" ? "text-[#D97706] bg-[#D97706]/5" : "text-[#777777] hover:bg-[#1C1C1C] hover:text-[#E8E8E8]"
                         )}
                       >
                         00. GLOBAL REGISTRY
                       </button>
                       <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                         {subjects.sort().map(subject => (
                           <button 
                             key={subject}
                             onClick={() => { setSelectedSubject(subject); setIsDropdownOpen(false); }}
                             className={cn(
                               "w-full text-left px-5 py-2.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-colors",
                               selectedSubject === subject ? "text-[#D97706] bg-[#D97706]/5" : "text-[#777777] hover:bg-[#1C1C1C] hover:text-[#E8E8E8]"
                             )}
                           >
                             {subject}
                           </button>
                         ))}
                       </div>
                     </div>
                   </>
                 )}
              </div>
           </div>
        </div>

        {/* Registry Scroller */}
        <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-10 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-30 grayscale">
               <div className="w-12 h-12 border border-[#D97706]/10 border-t-[#D97706] rounded-full animate-spin" />
               <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.4em] animate-pulse">Syncing Registry...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-serif text-white tracking-tight flex items-center gap-4">
                    {selectedSubject === 'ALL' ? 'Complete Index' : selectedSubject}
                    <span className="text-[10px] font-mono font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 border border-[#D97706]/20 rounded-md">
                       {filteredMaterials.length} Nodes
                    </span>
                 </h2>
              </div>

              {filteredMaterials.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredMaterials.map((material, idx) => (
                    <div 
                      key={material.id}
                      className="group flex items-center gap-5 bg-[#141413] border border-[#2A2A28] hover:border-[#D97706]/40 p-3 pl-6 rounded-xl transition-all cursor-pointer shadow-sm"
                      onClick={() => router.push(`/student/content/${material.id}`)}
                      style={{ animation: `nodeAppear 0.3s ease-out ${idx * 0.01}s both` }}
                    >
                       <div className="w-9 h-9 bg-[#191918] border border-[#2A2A28] rounded-lg flex items-center justify-center text-[#444444] group-hover:bg-[#D97706] group-hover:text-white transition-all shadow-inner shrink-0">
                          <FileText size={16} />
                       </div>

                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-0.5">
                             <h3 className="text-sm font-bold text-white group-hover:text-[#D97706] transition-colors truncate">
                                {material.title}
                             </h3>
                             {material.subject && material.subject !== selectedSubject && (
                               <span className="px-1.5 py-0.5 bg-[#191918] border border-[#2A2A28] rounded text-[8px] font-mono font-bold text-[#666666] uppercase tracking-wider shrink-0">
                                  {material.subject}
                               </span>
                             )}
                          </div>
                          <p className="text-[#666666] text-xs line-clamp-1 font-light leading-none">
                             {material.description || "Intelligence data node optimized for predictive exam domain coverage."}
                          </p>
                       </div>

                       <div className="flex items-center gap-6 pr-2 shrink-0 hidden sm:flex">
                          <div className="flex flex-col items-end w-20">
                             <span className="text-[7px] font-mono font-bold text-[#333333] uppercase tracking-widest leading-none">Weight</span>
                             <span className="text-[10px] text-[#555555] font-mono">{formatFileSize(material.fileSize)}</span>
                          </div>
                          <Link 
                            href={contentApi.downloadUrl(material.id)} 
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-[#444444] hover:text-[#D97706] transition-colors focus:outline-none"
                          >
                             <Download size={16} />
                          </Link>
                          <ArrowRight size={14} className="text-[#2A2A28] group-hover:text-[#D97706] group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-[#141413]/50 border border-dashed border-[#2A2A28] rounded-3xl py-32 text-center">
                  <Search size={48} className="text-[#2A2A28] mb-2" />
                  <div>
                    <p className="text-xl font-serif text-white mb-2">Registry Entry Missing</p>
                    <button 
                      onClick={() => {setSearchTerm(""); setSelectedSubject("ALL");}}
                      className="text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-widest hover:text-white hover:bg-[#D97706]/10 px-5 py-2.5 border border-[#D97706]/20 rounded-lg transition-all"
                    >
                      Reset Directory
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style jsx global>{`
        @keyframes nodeAppear {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2A2A28; border-radius: 10px; }
      `}</style>
    </ProtectedLayout>
  );
}
