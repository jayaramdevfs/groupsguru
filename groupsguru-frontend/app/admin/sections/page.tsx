"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback, useMemo } from "react";
import { sectionApi } from "@/lib/sections";
import { subCategoryApi } from "@/lib/subcategories";
import { categoryApi } from "@/lib/categories";
import { Section, SubCategory, Category, SectionRequest } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Multilang } from "@/components/ui/Multilang";

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
      const validSubCatIds = filteredSubCategories.map(s => s.id);
      result = result.filter(s => validSubCatIds.includes(s.subCategoryId));
    }
    return result;
  }, [sections, selectedSubCategoryId, selectedCategoryId, filteredSubCategories]);

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Hierarchy Level 2</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Section <span className="text-[#D97706]">Config</span>
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
            Add Section
          </button>
        </header>

        {/* Multi-Level Filtering */}
        <div className="mb-12 border border-[#3A3A3A] rounded bg-[#1C1C1C] overflow-hidden">
          <div className="p-4 border-b border-[#3A3A3A] bg-[#141414]">
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter Infrastructure
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#555555] uppercase tracking-widest block ml-1">01. Select Exam Category</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { setSelectedCategoryId("all"); setSelectedSubCategoryId("all"); }}
                  className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-colors border ${selectedCategoryId === "all" ? "bg-[#333333] border-[#666666] text-white" : "bg-[#141414] border-[#3A3A3A] text-[#666666] hover:border-[#444444]"}`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setSelectedCategoryId(cat.id.toString()); setSelectedSubCategoryId("all"); }}
                    className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-colors border ${selectedCategoryId === cat.id.toString() ? "bg-[#D97706] border-[#D97706] text-white" : "bg-[#141414] border-[#3A3A3A] text-[#666666] hover:border-[#666666]"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#555555] uppercase tracking-widest block ml-1">02. Select Academic Subject</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedSubCategoryId("all")}
                  className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-colors border ${selectedSubCategoryId === "all" ? "bg-[#333333] border-[#666666] text-white" : "bg-[#141414] border-[#3A3A3A] text-[#666666] hover:border-[#444444]"}`}
                >
                  All
                </button>
                {filteredSubCategories.map(sub => (
                  <button 
                    key={sub.id}
                    onClick={() => setSelectedSubCategoryId(sub.id.toString())}
                    className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-colors border ${selectedSubCategoryId === sub.id.toString() ? "bg-[#D97706] border-[#D97706] text-white" : "bg-[#141414] border-[#3A3A3A] text-[#666666] hover:border-[#666666]"}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredSections.length === 0 ? (
            <div className="text-center py-20 text-[#666666] bg-[#1E1E1E] rounded border border-[#3A3A3A] font-mono text-sm uppercase tracking-widest">
              No sections defined.
            </div>
          ) : (
            filteredSections.map((sec) => (
              <div
                key={sec.id}
                className="group w-full flex flex-col md:flex-row items-center gap-6 p-5 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] hover:border-[#D97706]/30 transition-colors"
              >
                <div className="w-12 h-12 shrink-0 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center font-mono font-bold text-lg text-[#D97706]">
                  {sec.sectionCode || sec.name.charAt(0)}
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">
                      <Multilang en={sec.name} te={sec.nameTe} />
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#D97706]/10 text-[#D97706] text-[9px] font-mono font-bold uppercase border border-[#D97706]/20 self-center">
                      {sec.subCategoryName}
                    </span>
                  </div>
                  <p className="text-sm text-[#A0A0A0] line-clamp-1">{sec.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleOpenModal(sec)}
                    className="p-2.5 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:bg-[#2D2D2D] hover:border-[#666666] transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(sec.id)}
                    className="p-2.5 rounded border border-[#C74444]/30 text-[#C74444] hover:bg-[#C74444]/10 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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
          title={editingSection ? "Modify Section Block" : "Initialize Section Block"}
        >
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Parent Entity (Subject L1)</label>
              <CustomSelect
                placeholder="Select parent subject..."
                options={subCategories.map(sub => ({ value: sub.id, label: `${sub.name} (${sub.categoryName})` }))}
                value={formData.subCategoryId}
                onChange={(val) => setFormData({ ...formData, subCategoryId: parseInt(val.toString()) })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput 
                label="English Descriptor"
                type="text"
                name="name"
                placeholder="e.g. Indian Constitution"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                required
              />
              <AnimatedInput 
                label="Telugu Descriptor"
                type="text"
                name="nameTe"
                placeholder="..."
                value={formData.nameTe}
                onChange={(val) => setFormData({ ...formData, nameTe: val })}
                required
              />
            </div>

            <AnimatedInput 
              label="System Logical Code"
              type="text"
              name="sectionCode"
              placeholder="POL-CONS"
              value={formData.sectionCode || ""}
              onChange={(val) => setFormData({ ...formData, sectionCode: val })}
            />
            
            <div className="space-y-2">
               <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Functional Description</label>
              <textarea 
                className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[120px] resize-none"
                placeholder="Briefly describe this section..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
              type="submit"
            >
              {editingSection ? "Save Structural Changes" : "Create Structural Section"}
            </button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
