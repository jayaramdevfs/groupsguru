"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback, useMemo } from "react";
import { registryApi } from "@/lib/registry";
import { topicApi } from "@/lib/topics";
import { MicroTopic, MicroTopicRequest, Topic } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";

// Distinct Subjects for filtering
const SUBJECTS = ["History", "Polity", "Economy", "Geography", "Science", "Mental Ability", "AP History", "AP Economy"];
const PAPERS = ["Paper-I", "Paper-II", "Screening"];
const GROUPS = ["ALL_GROUPS", "G3_PLUS", "G2_PLUS", "G1_ONLY"];

export default function AdminMicroTopicManagement() {
  const [microTopics, setMicroTopics] = useState<MicroTopic[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMt, setEditingMt] = useState<MicroTopic | null>(null);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedPaper, setSelectedPaper] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [formData, setFormData] = useState<MicroTopicRequest>({
    microTopicId: "",
    subject: "",
    sectionName: "",
    topicName: "",
    microTopicText: "",
    groupApplicability: "ALL_GROUPS",
    dataConfidence: "high",
    paper: "Paper-I",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use size 1000 to load all registry items.
      const [mtData, topData] = await Promise.all([
        registryApi.getMicroTopics(0, 1000, selectedSubject !== "all" ? selectedSubject : undefined, selectedPaper !== "all" ? selectedPaper : undefined, selectedGroup !== "all" ? selectedGroup : undefined),
        topicApi.adminGetAll(),
      ]);
      setMicroTopics(mtData.content);
      setTotalElements(mtData.totalElements || mtData.content.length);
      setTopics(topData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubject, selectedPaper, selectedGroup]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search local
  const displayedMicroTopics = useMemo(() => {
    if (!searchQuery) return microTopics;
    return microTopics.filter(m => 
      m.microTopicText?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.microTopicId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topicName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [microTopics, searchQuery]);

  const handleOpenModal = (mt: MicroTopic | null = null) => {
    if (mt) {
      setEditingMt(mt);
      setFormData({
        microTopicId: mt.microTopicId,
        subject: mt.subject,
        sectionName: mt.sectionName || "",
        topicName: mt.topicName || "",
        microTopicText: mt.microTopicText || "",
        groupApplicability: mt.groupApplicability || "ALL_GROUPS",
        dataConfidence: mt.dataConfidence,
        paper: mt.paper || "Paper-I",
        syllabusRef: mt.syllabusRef || "",
        topicId: mt.topicId,
      });
    } else {
      setEditingMt(null);
      setFormData({
        microTopicId: `MT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        subject: selectedSubject !== "all" ? selectedSubject : "History",
        sectionName: "",
        topicName: "",
        microTopicText: "",
        groupApplicability: "ALL_GROUPS",
        dataConfidence: "high",
        paper: selectedPaper !== "all" ? selectedPaper : "Paper-I",
        syllabusRef: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.microTopicId || !formData.subject) {
      alert("Missing required fields");
      return;
    }
    try {
      if (editingMt) {
        await registryApi.updateMicroTopic(editingMt.microTopicId, formData);
      } else {
        await registryApi.createMicroTopic(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save micro-topic:", error);
      alert("Failed to save. Might be duplicate ID.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete MT ${id}?`)) {
      try {
        await registryApi.deleteMicroTopic(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete mt:", error);
      }
    }
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1000px] mx-auto py-12 px-6">

        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666]">Knowledge Registry L4</div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-[0.1em] text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded border border-[#D97706]/20">
                AOD: {totalElements} NODES
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Atomic <span className="text-[#D97706]">Micro-Topics</span>
            </h1>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Forge MT
          </button>
        </header>

        {/* Filters Panel */}
        <div className="mb-12 border border-[#3A3A3A] rounded bg-[#1C1C1C]">
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest block ml-1">Subject domain</label>
              <CustomSelect
                options={[{value: "all", label: "ALL SUBJECTS"}, ...SUBJECTS.map(s => ({value: s, label: s.toUpperCase()}))]}
                value={selectedSubject}
                onChange={(val) => setSelectedSubject(val.toString())}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest block ml-1">Examination Paper</label>
              <CustomSelect
                options={[{value: "all", label: "ALL PAPERS"}, ...PAPERS.map(p => ({value: p, label: p.toUpperCase()}))]}
                value={selectedPaper}
                onChange={(val) => setSelectedPaper(val.toString())}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest block ml-1">Tier Applicability</label>
              <CustomSelect
                options={[{value: "all", label: "ALL TIERS"}, ...GROUPS.map(g => ({value: g, label: g.toUpperCase()}))]}
                value={selectedGroup}
                onChange={(val) => setSelectedGroup(val.toString())}
              />
            </div>

             <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest block ml-1">FTS Search</label>
              <input
                type="text"
                placeholder="Query Registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-2.5 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
               <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : displayedMicroTopics.length === 0 ? (
             <div className="text-center py-20 text-[#666666] bg-[#1E1E1E] rounded border border-[#3A3A3A] font-mono text-sm uppercase tracking-widest">
              Knowledge registry is empty.
            </div>
          ) : (
            displayedMicroTopics.map((mt) => (
              <div
                key={mt.microTopicId}
                className="group w-full p-6 bg-[#1E1E1E] border border-[#3A3A3A] rounded border-l-4 border-l-[#D97706]/30 hover:border-l-[#D97706] hover:border-[#D97706]/20 transition-all flex flex-col md:flex-row gap-6"
              >
                <div className="flex-1">
                   <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-[#141414] text-[#D97706] font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-[#3A3A3A]">{mt.microTopicId}</span>
                      <span className="bg-[#141414] text-[#666666] font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-[#3A3A3A]">{mt.subject}</span>
                      <span className="bg-[#141414] text-[#666666] font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-[#3A3A3A]">{mt.paper}</span>
                      <span className="bg-[#D97706]/10 text-[#D97706] font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-[#D97706]/20">{mt.groupApplicability}</span>
                   </div>
                   <h3 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors mb-2">{mt.topicName}</h3>
                   <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">{mt.microTopicText}</p>
                   
                   {mt.topicId && (
                     <div className="flex items-center gap-1.5 opacity-60">
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                       <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Linked Knowledge Node: {mt.topicId}</span>
                     </div>
                   )}
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-3 self-start">
                  <button onClick={() => handleOpenModal(mt)} className="p-2.5 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:bg-[#2D2D2D] hover:border-[#666666] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(mt.microTopicId)} className="p-2.5 rounded border border-[#C74444]/30 text-[#C74444] hover:bg-[#C74444]/10 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMt ? "Modify Atlas Entry" : "New Atlas Entry"}
        >
           <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <AnimatedInput
                   label="Atlas Record ID"
                   name="microTopicId"
                   placeholder="MT-XXX-000"
                   value={formData.microTopicId}
                   onChange={(val) => setFormData({...formData, microTopicId: val})}
                   required
                 />
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Subject domain</label>
                   <CustomSelect
                     placeholder="Select subject..."
                     options={SUBJECTS.map(s => ({value: s, label: s.toUpperCase()}))}
                     value={formData.subject}
                     onChange={(val) => setFormData({...formData, subject: val.toString()})}
                   />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <AnimatedInput
                   label="Examination Paper"
                   name="paper"
                   placeholder="e.g. Paper-I"
                   value={formData.paper || ""}
                   onChange={(val) => setFormData({...formData, paper: val})}
                 />
                 <AnimatedInput
                   label="Macro Topic Reference"
                   name="topicName"
                   placeholder="e.g. Constitutional Law"
                   value={formData.topicName || ""}
                   onChange={(val) => setFormData({...formData, topicName: val})}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Atomic Intelligence Specification</label>
                 <textarea
                   className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[140px] resize-none"
                   placeholder="Define the atomic boundaries for this micro-topic..."
                   value={formData.microTopicText}
                   onChange={e => setFormData({...formData, microTopicText: e.target.value})}
                   required
                 />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Tier Applicability</label>
                   <CustomSelect
                     options={GROUPS.map(g => ({value: g, label: g.toUpperCase()}))}
                     value={formData.groupApplicability || "ALL_GROUPS"}
                     onChange={(val) => setFormData({...formData, groupApplicability: val.toString()})}
                   />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Linked Knowledge Node (L3)</label>
                   <CustomSelect
                     placeholder="Optional link..."
                     options={topics.map(t => ({value: t.id, label: `${t.name} (${t.topicCode})`}))}
                     value={formData.topicId || 0}
                     onChange={(val) => setFormData({...formData, topicId: parseInt(val.toString()) || undefined})}
                   />
                 </div>
               </div>

              <button
                className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
                type="submit"
              >
                {editingMt ? "Sync Atlas record" : "Append Atlas record"}
              </button>
           </form>
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
