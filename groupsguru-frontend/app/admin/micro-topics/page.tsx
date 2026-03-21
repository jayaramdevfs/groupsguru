"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { registryApi } from "@/lib/registry";
import { topicApi } from "@/lib/topics";
import { MicroTopic, MicroTopicRequest, Topic } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Multilang } from "@/components/ui/Multilang";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

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
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div>
            <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">
              Level 4 Registry (Atomic)
            </div>
            {totalElements > 0 && (
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block ml-4">
                Registry loaded: {totalElements} micro-topics
              </div>
            )}
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              Micro-Topics
            </h1>
            <p className="text-[18px] text-white/70 font-[600]">
              Manage the atomic intelligence targets for the Groups Guru prediction engine.
            </p>
          </div>

          <motion.button
            whileHover={{ y: -5, boxShadow: "0px 30px 70px rgba(147, 51, 234, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => handleOpenModal()}
            className="px-8 py-4 h-fit rounded-[16px] bg-gradient-to-r from-purple-600 to-indigo-600 font-[700] text-[16px] whitespace-nowrap shadow-[0_15px_30px_rgba(147,51,234,0.3)] transition-all flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add MT
          </motion.button>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 space-y-6 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="flex flex-col gap-3">
              <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Subject</span>
              <CustomSelect
                options={[{value: "all", label: "All Subjects"}, ...SUBJECTS.map(s => ({value: s, label: s}))]}
                value={selectedSubject}
                onChange={(val) => setSelectedSubject(val.toString())}
              />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Paper</span>
              <CustomSelect
                options={[{value: "all", label: "All Papers"}, ...PAPERS.map(p => ({value: p, label: p}))]}
                value={selectedPaper}
                onChange={(val) => setSelectedPaper(val.toString())}
              />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Group Applicability</span>
              <CustomSelect
                options={[{value: "all", label: "All Groups"}, ...GROUPS.map(g => ({value: g, label: g}))]}
                value={selectedGroup}
                onChange={(val) => setSelectedGroup(val.toString())}
              />
            </div>

             <div className="flex flex-col gap-3">
              <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Search Keywords</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
              />
            </div>

          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
               <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : displayedMicroTopics.length === 0 ? (
             <div className="text-center py-20 text-white/50 bg-white/5 rounded-[32px] border border-white/10 border-dashed">
              <div className="text-4xl mb-4">⚛️</div>
              <p className="font-semibold">No Micro-Topics found.</p>
            </div>
          ) : (
            <AnimatePresence>
              {displayedMicroTopics.map((mt, index) => (
                <motion.div
                  key={mt.microTopicId}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ ...spring, delay: Math.min(index * 0.05, 0.5) }}
                  className="w-full p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] hover:border-purple-500/30 transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors" />

                  <div className="flex-1 ml-4">
                     <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-purple-400 font-mono text-xs font-bold px-2 py-1 bg-purple-400/10 rounded border border-purple-400/20">{mt.microTopicId}</span>
                        <span className="text-purple-400 text-xs font-bold px-2 py-1 bg-purple-400/10 rounded">{mt.subject}</span>
                        <span className="text-blue-400 text-xs font-bold px-2 py-1 bg-blue-400/10 rounded">{mt.paper}</span>
                        <span className="text-orange-400 text-xs font-bold px-2 py-1 bg-orange-400/10 rounded">{mt.groupApplicability}</span>
                     </div>
                     <h3 className="text-lg font-bold text-white mb-2">{mt.topicName || "No Topic Name"}</h3>
                     <p className="text-white/60 text-sm leading-relaxed mb-3">{mt.microTopicText}</p>
                     
                     {mt.topicId && (
                       <p className="text-xs text-emerald-400 font-medium border border-emerald-400/20 inline-block px-2 py-1 rounded bg-emerald-400/5">
                         Linked Topic (L3) ID: {mt.topicId}
                       </p>
                     )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                    <button onClick={() => handleOpenModal(mt)} className="p-3 bg-white/5 rounded-xl hover:bg-purple-500/20 transition-colors">✏️</button>
                    <button onClick={() => handleDelete(mt.microTopicId)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 transition-colors">🗑️</button>
                  </div>
                </motion.div>
               ))}
            </AnimatePresence>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingMt ? "Edit MicroTopic" : "New MicroTopic"}
        >
           <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <AnimatedInput
                   label="MicroTopic ID (Unique)"
                   name="microTopicId"
                   placeholder="e.g. MT-HIST-001"
                   value={formData.microTopicId}
                   onChange={(val) => setFormData({...formData, microTopicId: val})}
                   required
                 />
                 <div className="flex flex-col gap-3">
                   <label className="text-xs font-black text-white/40 uppercase">Subject</label>
                   <CustomSelect
                     placeholder="--Select Subject--"
                     options={SUBJECTS.map(s => ({value: s, label: s}))}
                     value={formData.subject}
                     onChange={(val) => setFormData({...formData, subject: val.toString()})}
                   />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <AnimatedInput
                   label="Paper"
                   name="paper"
                   placeholder="e.g. Paper-I"
                   value={formData.paper || ""}
                   onChange={(val) => setFormData({...formData, paper: val})}
                 />
                 <AnimatedInput
                   label="Topic Name (Macro)"
                   name="topicName"
                   placeholder="Name of topic..."
                   value={formData.topicName || ""}
                   onChange={(val) => setFormData({...formData, topicName: val})}
                 />
              </div>

              <div className="flex flex-col gap-3">
                 <label className="text-xs font-black text-white/40 uppercase">MicroTopic Text (Atomic details)</label>
                 <textarea
                   className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                   value={formData.microTopicText}
                   onChange={e => setFormData({...formData, microTopicText: e.target.value})}
                 />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-3">
                   <label className="text-xs font-black text-white/40 uppercase">Group Applicability</label>
                   <CustomSelect
                     options={GROUPS.map(g => ({value: g, label: g}))}
                     value={formData.groupApplicability || "ALL_GROUPS"}
                     onChange={(val) => setFormData({...formData, groupApplicability: val.toString()})}
                   />
                 </div>
                 
                 <div className="flex flex-col gap-3">
                   <label className="text-xs font-black text-white/40 uppercase">Link L3 Topic</label>
                   <CustomSelect
                     placeholder="--No Linked Topic L3--"
                     options={topics.map(t => ({value: t.id, label: `${t.name} (Code: ${t.topicCode})`}))}
                     value={formData.topicId || 0}
                     onChange={(val) => setFormData({...formData, topicId: parseInt(val.toString()) || undefined})}
                   />
                 </div>
               </div>

               <motion.button
                 type="submit"
                 whileHover={{ y: -5 }}
                 className="mt-6 w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-lg shadow-xl"
               >
                 {editingMt ? "Save Changes" : "Create MT"}
               </motion.button>
           </form>
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
