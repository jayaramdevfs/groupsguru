"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { sectionApi } from "@/lib/sections";
import { subCategoryApi } from "@/lib/subcategories";
import { categoryApi } from "@/lib/categories";
import { Section, SubCategory, Category, SectionRequest } from "@/lib/types";
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

export default function AdminSectionManagement() {
  const [sections, setSections] = useState<Section[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  
  // Filtering states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("all");

  const [formData, setFormData] = useState<SectionRequest>({
    name: "",
    nameTe: "",
    description: "",
    descriptionTe: "",
    sectionCode: "",
    subCategoryId: 0
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [secs, subCats, cats] = await Promise.all([
        sectionApi.adminGetAll(),
        subCategoryApi.adminGetAll(),
        categoryApi.getAll()
      ]);
      setSections(secs);
      setSubCategories(subCats);
      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (sec: Section | null = null) => {
    if (sec) {
      setEditingSection(sec);
      setFormData({
        name: sec.name,
        nameTe: sec.nameTe,
        description: sec.description || "",
        descriptionTe: sec.descriptionTe || "",
        sectionCode: sec.sectionCode || "",
        subCategoryId: sec.subCategoryId
      });
    } else {
      setEditingSection(null);
      setFormData({ 
        name: "", 
        nameTe: "",
        description: "", 
        descriptionTe: "",
        sectionCode: "", 
        subCategoryId: selectedSubCategoryId !== "all" ? parseInt(selectedSubCategoryId) : 0 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subCategoryId === 0) {
      alert("Please select a subject");
      return;
    }
    try {
      if (editingSection) {
        await sectionApi.update(editingSection.id, formData);
      } else {
        await sectionApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save section:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this section?")) {
      try {
        await sectionApi.delete(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete section:", error);
      }
    }
  };

  // Filter logic
  const filteredSubCategories = useMemo(() => {
    return selectedCategoryId === "all" 
      ? subCategories 
      : subCategories.filter(s => s.categoryId.toString() === selectedCategoryId);
  }, [selectedCategoryId, subCategories]);

  const filteredSections = useMemo(() => {
    let result = sections;
    if (selectedSubCategoryId !== "all") {
      result = result.filter(s => s.subCategoryId.toString() === selectedSubCategoryId);
    } else if (selectedCategoryId !== "all") {
      // If subject is 'all' but exam is selected, show all sections belonging to that exam's subjects
      const validSubCatIds = filteredSubCategories.map(s => s.id);
      result = result.filter(s => validSubCatIds.includes(s.subCategoryId));
    }
    return result;
  }, [sections, selectedSubCategoryId, selectedCategoryId, filteredSubCategories]);

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div>
            <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">
              Level 2 Management
            </div>
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              <Multilang en="Section Management" te="సెక్షన్ నిర్వహణ" />
            </h1>
            <p className="text-[18px] text-white/70 font-[600]">
              <Multilang 
                en="Break down subjects into logical study sections." 
                te="సబ్జెక్టులను లాజికల్ స్టడీ సెక్షన్లుగా విభజించండి."
              />
            </p>
          </div>

          <motion.button
            whileHover={{ y: -5, boxShadow: "0px 30px 70px rgba(147, 51, 234, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => handleOpenModal()}
            className="px-8 py-4 h-fit rounded-[16px] bg-gradient-to-r from-[#9333EA] to-[#DB2777] font-[700] text-[16px] whitespace-nowrap shadow-[0_15px_30px_rgba(219,39,119,0.3)] transition-all flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <Multilang en="Add Section" te="సెక్షన్ జోడించండి" />
          </motion.button>
        </motion.div>

        {/* Multi-Level Filtering */}
        <div className="mb-12 space-y-8 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
          {/* L0 Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Step 1: Select Exam Category (L0)</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setSelectedCategoryId("all"); setSelectedSubCategoryId("all"); }}
                className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedCategoryId === "all" ? "bg-purple-600 border-purple-400 font-bold shadow-lg shadow-purple-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                All Exams
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => { setSelectedCategoryId(cat.id.toString()); setSelectedSubCategoryId("all"); }}
                  className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedCategoryId === cat.id.toString() ? "bg-purple-600 border-purple-400 font-bold shadow-lg shadow-purple-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* L1 Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Step 2: Select Subject (L1)</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedSubCategoryId("all")}
                className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedSubCategoryId === "all" ? "bg-indigo-600 border-indigo-400 font-bold shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                All Subjects
              </button>
              {filteredSubCategories.map(sub => (
                <button 
                  key={sub.id}
                  onClick={() => setSelectedSubCategoryId(sub.id.toString())}
                  className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedSubCategoryId === sub.id.toString() ? "bg-indigo-600 border-indigo-400 font-bold shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >
                  {sub.name}
                </button>
              ))}
              {filteredSubCategories.length === 0 && selectedCategoryId !== "all" && (
                <span className="text-white/30 text-sm italic py-2">No subjects found for this exam.</span>
              )}
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="text-center py-20 text-white/50 bg-white/5 rounded-[32px] border border-white/10 border-dashed">
              <div className="text-4xl mb-4">📑</div>
              No sections found in this criteria.
            </div>
          ) : (
            <AnimatePresence>
              {filteredSections.map((sec, index) => (
                <motion.div
                  key={sec.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="w-full flex flex-col md:flex-row items-center gap-6 p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden"
                >
                   {/* Background Glow on Hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] group-hover:bg-purple-500/10 transition-all" />

                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-white/10 flex items-center justify-center font-black text-xl text-purple-300">
                    {sec.sectionCode || sec.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 w-full relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                       <div className="text-xs font-black text-purple-400 uppercase tracking-widest bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                         {sec.subCategoryName}
                       </div>
                       <h3 className="text-2xl font-black text-white">
                         <Multilang en={sec.name} te={sec.nameTe} />
                       </h3>
                    </div>
                    <p className="text-sm font-medium text-white/40 line-clamp-2 max-w-2xl leading-relaxed">
                      <Multilang en={sec.description || ""} te={sec.descriptionTe || ""} />
                    </p>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(sec)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-purple-500/20 text-white border border-white/10 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(sec.id)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/10 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
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
          title={<Multilang en={editingSection ? "Update Section" : "New Section"} te={editingSection ? "సెక్షన్‌ను నవీకరించండి" : "కొత్త సెక్షన్"} />}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Parent Subject (L1)</label>
              <CustomSelect
                placeholder="Select a Subject"
                options={subCategories.map(sub => ({ value: sub.id, label: `${sub.name} (${sub.categoryName})` }))}
                value={formData.subCategoryId}
                onChange={(val) => setFormData({ ...formData, subCategoryId: parseInt(val.toString()) })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput 
                label="Section Name (EN)"
                type="text"
                name="name"
                placeholder="e.g. Ancient India"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                required
              />
              <AnimatedInput 
                label="Section Name (TE)"
                type="text"
                name="nameTe"
                placeholder="ఉదా: ప్రాచీన భారతదేశం"
                value={formData.nameTe}
                onChange={(val) => setFormData({ ...formData, nameTe: val })}
                required
              />
            </div>

            <AnimatedInput 
              label="Section Code (e.g. HIS-ANC)"
              type="text"
              name="sectionCode"
              placeholder="Logical code for internal mapping"
              value={formData.sectionCode || ""}
              onChange={(val) => setFormData({ ...formData, sectionCode: val })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Description (EN)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 transition-colors min-h-[120px] text-sm"
                  placeholder="Details about this section..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Description (TE)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-purple-500/50 transition-colors min-h-[120px] text-sm"
                  placeholder="వివరాలు..."
                  value={formData.descriptionTe}
                  onChange={(e) => setFormData({ ...formData, descriptionTe: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ y: -5, boxShadow: "0px 20px 40px rgba(147, 51, 234, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-black text-lg tracking-tight shadow-xl"
              type="submit"
            >
              <Multilang en={editingSection ? "Sync Changes" : "Forge Section"} te={editingSection ? "నవీకరించండి" : "సెక్షన్ సృష్టించండి"} />
            </motion.button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
