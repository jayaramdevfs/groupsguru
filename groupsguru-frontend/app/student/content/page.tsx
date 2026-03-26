"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { contentApi } from "@/lib/content";
import { StudyMaterial } from "@/lib/types";
import { Multilang } from "@/components/ui/Multilang";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const searchParams = useSearchParams();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Reader Modal State
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [readingContent, setReadingContent] = useState<string | null>(null);
  const [readingTitle, setReadingTitle] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await contentApi.getAllPublished(0, 500);
      // Handle both Page object and direct List response
      const data = Array.isArray(all) ? all : (all.content || []);
      setMaterials(data);
      
      // Extract unique subjects for filtering
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

  const handleView = async (material: StudyMaterial) => {
    try {
      setReadingTitle(material.title);
      setIsReaderOpen(true);
      setReadingContent("Loading content...");
      
      const content = await contentApi.getContent(material.id);
      setReadingContent(content);
    } catch (error) {
      setReadingContent("Failed to load content. Please try downloading instead.");
    }
  };

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="max-w-[1200px] mx-auto py-12 px-6">
        <header className="mb-10 text-center border-b border-[#3A3A3A] pb-8">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
            Knowledge Access v3
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Study <span className="text-[#D97706]">Materials</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl mx-auto leading-relaxed text-sm">
            Access curated study notes, guides, and learning assets to accelerate your preparation.
          </p>

          {/* Filtering Tools */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="w-full max-w-[300px] relative">
               <input 
                 type="text" 
                 placeholder="Search materials..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-[#141414] border border-[#3A3A3A] rounded-full px-5 py-2.5 text-sm text-[#E8E8E8] focus:border-[#D97706]/50 outline-none transition-all"
               />
            </div>
            <div className="flex gap-2 bg-[#1C1C1C] p-1 rounded-full border border-[#3A3A3A] overflow-x-auto max-w-full">
               <button 
                 onClick={() => setSelectedSubject("ALL")}
                 className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${selectedSubject === "ALL" ? 'bg-[#D97706] text-white' : 'text-[#666666] hover:text-[#E8E8E8]'}`}
               >
                 All
               </button>
               {subjects.map(subject => (
                 <button 
                   key={subject}
                   onClick={() => setSelectedSubject(subject)}
                   className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap transition-all ${selectedSubject === subject ? 'bg-[#D97706] text-white' : 'text-[#666666] hover:text-[#E8E8E8]'}`}
                 >
                   {subject}
                 </button>
               ))}
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Querying Global Library...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="group bg-[#1C1C1C] border border-[#3A3A3A] rounded-lg p-6 hover:border-[#D97706]/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-mono font-bold text-[#666666] px-2 py-0.5 border border-[#3A3A3A] rounded bg-[#141414] uppercase tracking-widest">
                      {material.fileType || 'Asset'}
                    </span>
                    {material.subject && (
                      <span className="text-[9px] font-mono font-bold text-[#D97706] uppercase tracking-widest">
                         {material.subject}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors line-clamp-2">{material.title}</h3>
                  <p className="text-sm text-[#A0A0A0] mt-2 line-clamp-3 font-light leading-relaxed">
                    {material.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => handleView(material)}
                    className="flex-1 px-4 py-2 rounded border border-[#3A3A3A] text-xs font-mono font-bold uppercase tracking-widest text-[#E8E8E8] hover:bg-[#3A3A3A] transition-all"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => {
                        const url = contentApi.downloadUrl(material.id);
                        window.open(url, '_blank');
                    }}
                    className="px-4 py-2 rounded bg-[#D97706]/10 border border-[#D97706]/30 text-xs font-mono font-bold uppercase tracking-widest text-[#D97706] hover:bg-[#D97706] hover:text-white transition-all"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
            {filteredMaterials.length === 0 && (
                <div className="col-span-full py-20 text-center text-[#666666] font-mono text-[10px] uppercase tracking-widest">
                    No materials found for the current selection.
                </div>
            )}
          </div>
        )}

        {/* Reader Modal */}
        {isReaderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
             <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsReaderOpen(false)}></div>
             <div className="relative bg-[#141414] border border-[#3A3A3A] w-full h-full max-w-5xl rounded-xl overflow-hidden shadow-2xl flex flex-col z-10 transition-all">
                <div className="p-6 border-b border-[#3A3A3A] flex justify-between items-center bg-[#1C1C1C]">
                   <div>
                      <div className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest mb-1">Knowledge Node Reader</div>
                      <h2 className="text-xl font-bold text-[#E8E8E8]">{readingTitle}</h2>
                   </div>
                   <button 
                     onClick={() => setIsReaderOpen(false)}
                     className="p-2 text-[#666666] hover:text-[#E8E8E8] transition-colors"
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 md:p-12 text-[#E8E8E8] font-light leading-relaxed whitespace-pre-wrap">
                   {readingContent}
                </div>
             </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
