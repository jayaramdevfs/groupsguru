"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { subCategoryApi } from "@/lib/subcategories";
import { categoryApi } from "@/lib/categories";
import { SubCategory, Category, SubCategoryRequest } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Multilang } from "@/components/ui/Multilang";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

export default function AdminSubCategoryManagement() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  
  const [formData, setFormData] = useState<SubCategoryRequest>({
    name: "",
    description: "",
    syllabusCode: "",
    categoryId: 0
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subCats, cats] = await Promise.all([
        subCategoryApi.adminGetAll(),
        categoryApi.getAll()
      ]);
      setSubCategories(subCats);
      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (subCat: SubCategory | null = null) => {
    if (subCat) {
      setEditingSubCategory(subCat);
      setFormData({
        name: subCat.name,
        description: subCat.description || "",
        syllabusCode: subCat.syllabusCode || "",
        categoryId: subCat.categoryId
      });
    } else {
      setEditingSubCategory(null);
      setFormData({ 
        name: "", 
        description: "", 
        syllabusCode: "", 
        categoryId: categories.length > 0 ? categories[0].id : 0 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categoryId === 0) {
      alert("Please select a category");
      return;
    }
    try {
      if (editingSubCategory) {
        await subCategoryApi.update(editingSubCategory.id, formData);
      } else {
        await subCategoryApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save subcategory:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await subCategoryApi.delete(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete subcategory:", error);
      }
    }
  };

  const filteredSubCategories = selectedCategoryId === "all" 
    ? subCategories 
    : subCategories.filter(s => s.categoryId.toString() === selectedCategoryId);

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-[#FAFAF9]">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div>
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              <Multilang en="Subject Management" te="సబ్జెక్ట్ నిర్వహణ" />
            </h1>
            <p className="text-[18px] text-[#FAFAF9]/70 font-[600]">
              <Multilang 
                en="Organize subjects and syllabus codes under your primary exams." 
                te="ప్రాథమిక పరీక్షల క్రింద సబ్జెక్టులు మరియు సిలబస్ కోడ్‌లను నిర్వహించండి."
              />
            </p>
          </div>

          <motion.button
            whileHover={{ y: -5, boxShadow: "0px 30px 70px rgba(147, 51, 234, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => handleOpenModal()}
            className="px-8 py-4 h-fit rounded-[16px] bg-[#EA580C] font-[700] text-[16px] whitespace-nowrap shadow-md transition-all flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <Multilang en="Add Subject" te="సబ్జెక్ట్ జోడించండి" />
          </motion.button>
        </motion.div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <span className="text-[#FAFAF9]/60 font-bold uppercase text-xs tracking-widest">Filter by Exam:</span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setSelectedCategoryId("all")}
              className={`px-4 py-2 rounded-full border transition-all ${selectedCategoryId === "all" ? "bg-[#EA580C] border-[#57534E]/40 font-bold" : "bg-white/5 border-[#57534E]/40 hover:bg-white/10"}`}
            >
              All Exams
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id.toString())}
                className={`px-4 py-2 rounded-full border transition-all ${selectedCategoryId === cat.id.toString() ? "bg-[#EA580C] border-[#57534E]/40 font-bold" : "bg-white/5 border-[#57534E]/40 hover:bg-white/10"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* List Section */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredSubCategories.length === 0 ? (
            <div className="text-center py-20 text-[#FAFAF9]/50 bg-white/5 rounded-xl border border-[#57534E]/40">
              No subjects found.
            </div>
          ) : (
            <AnimatePresence>
              {filteredSubCategories.map((sub, index) => (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...spring, delay: index * 0.05 }}
                  className="w-full flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-[rgba(147,51,234,0.05)] border border-[rgba(147,51,234,0.15)] hover:border-[rgba(147,51,234,0.4)] transition-all group"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#EA580C] border border-[#57534E]/40 flex items-center justify-center font-bold text-xl text-[#F97316]">
                    {sub.syllabusCode || sub.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[20px] font-[700] text-[#F97316]">{sub.name}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-[#F97316] text-[10px] font-bold uppercase tracking-tighter border border-[#57534E]/40">
                        {sub.categoryName}
                      </span>
                    </div>
                    <p className="text-[14px] font-[500] text-[#FAFAF9]/50 line-clamp-1">{sub.description}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(sub)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-orange-500/20 text-[#FAFAF9] border border-[#57534E]/40 transition-colors"
                      title="Edit Subject"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(sub.id)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-400 border border-[#57534E]/40 transition-colors"
                      title="Delete Subject"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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
          title={editingSubCategory ? "Update Subject" : "New Subject"}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#FAFAF9]/50 ml-1">Parent Exam</label>
              <CustomSelect
                placeholder="Select an Exam"
                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                value={formData.categoryId}
                onChange={(val) => setFormData({ ...formData, categoryId: parseInt(val.toString()) })}
              />
            </div>

            <AnimatedInput 
              label="Subject Name"
              type="text"
              name="name"
              placeholder="e.g. Indian History, Geography"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              required
            />

            <AnimatedInput 
              label="Syllabus Code (Optional)"
              type="text"
              name="syllabusCode"
              placeholder="e.g. HIS-01, GEO-02"
              value={formData.syllabusCode || ""}
              onChange={(val) => setFormData({ ...formData, syllabusCode: val })}
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#FAFAF9]/50 ml-1">Description</label>
              <textarea 
                className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-4 text-[#FAFAF9] focus:outline-none focus:border-orange-500/50 transition-colors min-h-[80px]"
                placeholder="Brief details about the subject..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-4 rounded-xl bg-[#EA580C] font-bold shadow-lg"
              type="submit"
            >
              {editingSubCategory ? "Update Subject" : "Create Subject"}
            </motion.button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
