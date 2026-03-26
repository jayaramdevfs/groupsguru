"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { contentApi } from "@/lib/content";
import { StudyMaterial } from "@/lib/types";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import ReactMarkdown from "react-markdown";
import { 
  ChevronLeft, 
  Menu, 
  X, 
  BookOpen, 
  Download, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Maximize2,
  FileText,
  Clock
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function StudentReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [relatedMaterials, setRelatedMaterials] = useState<StudyMaterial[]>([]);
  const [allMaterials, setAllMaterials] = useState<StudyMaterial[]>([]);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get all to find current and related
      const all = await contentApi.getAllPublished(0, 500);
      const data = Array.isArray(all) ? all : (all.content || []);
      setAllMaterials(data);

      const current = data.find((m: StudyMaterial) => m.id === parseInt(id));
      if (current) {
        setMaterial(current);
        try {
          const text = await contentApi.getContent(current.id);
          setContent(text);
        } catch (err) {
          console.error("Failed to fetch markdown content", err);
          setContent("### ⚠️ Load Error\nUnable to retrieve the content for this knowledge node. Please ensure your connection is stable or try downloading the PDF version.");
        }

        // Find related (same subject)
        if (current.subject) {
          setRelatedMaterials(data.filter((m: StudyMaterial) => m.subject === current.subject));
        }
      }
    } catch (error) {
      console.error("Reader failed to load", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const goToNext = () => {
    const currentIndex = relatedMaterials.findIndex(m => m.id === parseInt(id));
    if (currentIndex < relatedMaterials.length - 1) {
      router.push(`/student/content/${relatedMaterials[currentIndex + 1].id}`);
    }
  };

  const goToPrev = () => {
    const currentIndex = relatedMaterials.findIndex(m => m.id === parseInt(id));
    if (currentIndex > 0) {
      router.push(`/student/content/${relatedMaterials[currentIndex - 1].id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-2 border-[#D97706]/20 border-t-[#D97706] rounded-full animate-spin"></div>
        <p className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] animate-pulse whitespace-nowrap">
          Initializing Knowledge Node...
        </p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-6 text-center px-6">
        <X size={48} className="text-[#C74444]" />
        <div>
          <h2 className="text-xl font-bold text-[#E8E8E8] mb-2">Asset Not Found</h2>
          <p className="text-[#A0A0A0] text-sm max-w-md mx-auto">The requested study material could not be located in the global library.</p>
        </div>
        <button 
          onClick={() => router.push('/student/content')}
          className="mt-4 px-6 py-2 bg-[#1C1C1C] border border-[#2A2A28] rounded-lg text-xs font-mono font-bold text-[#D97706] uppercase tracking-widest hover:border-[#D97706]/30 transition-all"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="h-screen bg-[#111110] flex flex-col overflow-hidden text-[#E8E8E8]">
        {/* Modern Top Workspace Header */}
        <header className="h-14 bg-[#141413] border-b border-[#2A2A28] flex items-center justify-between px-6 shrink-0 z-40 backdrop-blur-md bg-opacity-80">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push('/student/content')}
              className="p-2 text-[#666666] hover:text-[#D97706] hover:bg-[#1C1C1C] rounded-xl transition-all"
              title="Return to Library"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-[#D97706]/10 flex items-center justify-center border border-[#D97706]/20">
                  <BookOpen size={16} className="text-[#D97706]" />
               </div>
               <div className="hidden sm:block">
                  <h1 className="text-xs font-bold text-[#E8E8E8] tracking-tight truncate max-w-[300px]">{material.title}</h1>
                  <p className="text-[9px] font-mono text-[#666666] uppercase tracking-widest">{material.subject || "CORE REPOSITORY"}</p>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => window.open(contentApi.downloadUrl(material.id), '_blank')}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[#2A2A28] rounded-lg text-[10px] font-mono font-bold text-[#888888] hover:text-white hover:border-[#D97706]/50 transition-all bg-[#191918]"
             >
                <Download size={12} /> Resource PDF
             </button>
             <button 
               className="px-4 py-1.5 bg-[#D97706] hover:bg-[#F59E0B] text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-[#D97706]/10 flex items-center gap-2"
             >
               <CheckCircle size={12} /> Mark Finished
             </button>
          </div>
        </header>

        {/* Multi-Pane Workspace Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Permanent Course Navigation Sidebar (Collapsible) */}
          <aside 
            className={cn(
              "h-full bg-[#141413] border-r border-[#2A2A28] flex flex-col transition-all duration-500 ease-in-out z-30 shadow-2xl relative",
              isSidebarOpen ? "w-[300px]" : "w-0 overflow-hidden border-none"
            )}
          >
            <div className="p-5 border-b border-[#2A2A28] flex justify-between items-center bg-[#191918]">
               <h2 className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em]">Course Modules</h2>
               <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-[#2A2A28] rounded-md transition-colors">
                 <Maximize2 size={14} className="text-[#666666]" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-[#141413]/50">
               {relatedMaterials.map((m) => (
                 <button
                   key={m.id}
                   onClick={() => router.push(`/student/content/${m.id}`)}
                   className={cn(
                     "w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 group relative overflow-hidden",
                     m.id === material.id 
                       ? "bg-[#D97706]/10 border-[#D97706]/40 shadow-inner translate-x-1" 
                       : "bg-transparent border-transparent hover:bg-[#1C1C1C] hover:border-[#3D3D3A]"
                   )}
                 >
                   {m.id === material.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706]" />}
                   <div className={cn(
                     "mt-0.5 p-1 rounded-full",
                     m.id === material.id ? "text-[#D97706]" : "text-[#3A3A3A] group-hover:text-[#888888]"
                   )}>
                     <div className="w-1.5 h-1.5 rounded-full bg-current" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-[11px] font-bold leading-relaxed line-clamp-2",
                        m.id === material.id ? "text-white" : "text-[#888888]"
                      )}>
                        {m.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8px] font-mono font-bold text-[#555555] uppercase tracking-wider">{m.fileType || 'MD'}</span>
                        <div className="w-0.5 h-0.5 rounded-full bg-[#3A3A3A]"></div>
                        <span className="text-[8px] font-mono font-bold text-[#555555] uppercase tracking-wider">Note</span>
                      </div>
                   </div>
                 </button>
               ))}
            </div>
          </aside>

          {/* Expanded Reading Surface */}
          <main className="flex-1 relative flex flex-col bg-[#111110] overflow-hidden">
            
            {/* Expansion Trigger */}
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-6 left-6 p-2 bg-[#191918] border border-[#2A2A28] rounded-lg text-[#666666] hover:text-[#D97706] transition-all z-40 shadow-2xl group flex items-center gap-2 pr-4"
              >
                <Menu size={18} />
                <span className="text-[10px] font-mono font-bold text-[#666666] group-hover:text-[#D97706] uppercase tracking-widest">Index</span>
              </button>
            )}

            {/* True Widescreen Content Scroller */}
            <div className="flex-1 overflow-y-auto px-8 py-16 md:px-24 md:py-24 lg:px-32 custom-scrollbar scroll-smooth">
               
                {/* Refined Contextual Workspace Header */}
                <div className="max-w-[1400px] mx-auto w-full mb-12">
                   <nav className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#444444] mb-8">
                      <Link href="/student/content" className="hover:text-[#D97706] transition-all flex items-center gap-2">
                        <ArrowLeft size={12} /> VAULT
                      </Link>
                      <div className="w-1 h-1 rounded-full bg-[#2A2A28]" />
                      <span className="text-[#D97706]">NODE ID: {material.id}</span>
                   </nav>

                   <div className="inline-flex items-center gap-2 px-2 py-1 bg-[#D97706]/10 border border-[#D97706]/20 rounded-md mb-6 shadow-sm">
                      <span className="w-1 h-1 bg-[#D97706] rounded-full animate-pulse shadow-[0_0_6px_#D97706]" />
                      <span className="text-[9px] font-mono font-bold text-[#D97706] uppercase tracking-[0.2em]">{material.subject || "CORE KNOWLEDGE NODE"}</span>
                   </div>

                   <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight tracking-tight border-l-4 border-[#D97706] pl-6 max-w-4xl">
                     {material.title}
                   </h1>
                </div>

                {/* Main Content Area - Absolute Contrast Policy */}
                <div className="max-w-[1400px] mx-auto w-full">
                  <div className="prose prose-invert max-w-none">
                     <div className="text-[#F3F4F6] font-normal leading-relaxed text-sm md:text-base space-y-8">
                        {content ? (
                          <ReactMarkdown 
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl md:text-3xl font-bold text-white mt-12 mb-6 pb-2 border-b border-[#2A2A28]" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg md:text-2xl font-bold text-white mt-10 mb-5 flex items-center gap-3 before:content-[''] before:block before:w-6 before:h-0.5 before:bg-[#D97706] rounded-sm" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-base md:text-xl font-bold text-[#D97706] mt-8 mb-4 px-4 py-1.5 bg-[#D97706]/5 border-l-2 border-[#D97706] rounded-r-xl" {...props} />,
                              p: ({node, ...props}) => <p className="mb-6 leading-relaxed text-[#F3F4F6]" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-4 marker:text-[#D97706] md:pl-10 text-[#F3F4F6]" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-4 marker:text-[#888888] marker:font-mono marker:text-sm md:pl-10 text-[#F3F4F6]" {...props} />,
                              li: ({node, ...props}) => <li className="pl-3 leading-relaxed text-[#F3F4F6]" {...props} />,
                              code: ({node, ...props}) => <code className="bg-[#1C1C1C] border border-[#2A2A28] rounded-lg px-3 py-1 text-[#D97706] text-sm font-mono" {...props} />,
                              blockquote: ({node, ...props}) => (
                                <blockquote className="border-l-4 border-[#D97706] pl-8 italic text-[#E8E8E8] bg-[#191918] py-12 pr-10 rounded-r-2xl my-12 shadow-lg relative group-hover:brightness-105 transition-all">
                                   <div className="absolute top-4 right-8 text-[#D97706]/10 font-serif text-6xl leading-none select-none">"</div>
                                   <div className="relative z-10">{props.children}</div>
                                </blockquote>
                              ),
                              table: ({node, ...props}) => (
                                <div className="overflow-x-auto my-12 border border-[#2A2A28] rounded-2xl shadow-lg overflow-hidden bg-[#141413] p-1">
                                  <table className="w-full border-collapse" {...props} />
                                </div>
                              ),
                              th: ({node, ...props}) => <th className="border-b border-[#2A2A28] bg-[#191918] p-6 text-left text-[10px] font-mono font-bold uppercase tracking-widest text-[#888888]" {...props} />,
                              td: ({node, ...props}) => <td className="border-b border-[#2A2A28] p-6 text-base text-[#F3F4F6] font-normal" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-white bg-[#D97706] px-2 py-0.5 rounded shadow-sm" {...props} />,
                              em: ({node, ...props}) => <span className="italic text-[#E8E8E8]" {...props} />,
                            }}
                          >
                            {content}
                          </ReactMarkdown>
                        ) : (
                          <div className="py-40 flex flex-col items-center justify-center text-center opacity-30 gap-8 grayscale">
                             <div className="relative">
                                <div className="w-20 h-20 border-[2px] border-[#D97706]/10 rounded-full"></div>
                                <div className="absolute inset-0 w-20 h-20 border-t-[2px] border-[#D97706] rounded-full animate-spin"></div>
                             </div>
                             <p className="text-base font-mono font-bold uppercase tracking-[0.3em] animate-pulse">Synchronizing Node...</p>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Pro Dashboard Navigation Footer */}
                  <div className="mt-60 pt-24 border-t border-[#2A2A28] flex flex-col xl:flex-row items-center justify-between gap-12 pb-60">
                     <button 
                       onClick={goToPrev}
                       disabled={relatedMaterials.findIndex(m => m.id === material.id) === 0}
                       className="group flex items-center gap-10 text-left disabled:opacity-20 disabled:pointer-events-none w-full xl:w-1/2"
                     >
                       <div className="p-10 bg-[#141413] border border-[#2A2A28] rounded-[2.5rem] group-hover:border-[#D97706]/50 shadow-2xl transition-all active:scale-95 group-hover:-translate-x-4">
                          <ArrowLeft size={48} className="text-[#444444] group-hover:text-[#D97706]" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[13px] font-mono font-bold text-[#444444] uppercase tracking-[0.5em] mb-4">Registry Prev</p>
                          <p className="text-3xl md:text-5xl font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors leading-tight line-clamp-1">Previous Asset</p>
                       </div>
                     </button>

                     <button 
                       onClick={goToNext}
                       disabled={relatedMaterials.findIndex(m => m.id === material.id) === relatedMaterials.length - 1}
                       className="group flex flex-row-reverse items-center gap-10 text-right disabled:opacity-20 disabled:pointer-events-none w-full xl:w-1/2"
                     >
                       <div className="p-10 bg-[#D97706] border border-[#D97706] rounded-[2.5rem] shadow-3xl shadow-[#D97706]/40 group-hover:bg-[#F59E0B] transition-all active:scale-95 group-hover:translate-x-4">
                          <ArrowRight size={48} className="text-white" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[13px] font-mono font-bold text-[#444444] uppercase tracking-[0.5em] mb-4">Registry Next</p>
                          <p className="text-3xl md:text-5xl font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors leading-tight line-clamp-1">Proceed Forward</p>
                       </div>
                     </button>
                  </div>
               </div>
            </div>
          </main>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2A2A28; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D97706; }
      `}</style>
    </ProtectedLayout>
  );
}
