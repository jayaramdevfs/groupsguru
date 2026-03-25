"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { categoryApi } from "@/lib/categories";
import { commissionApi } from "@/lib/commissions";
import { Category, CategoryRequest, Commission } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

export default function AdminCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryRequest>({
    name: "",
    nameTe: "",
    description: "",
    descriptionTe: "",
    imageUrl: "",
    commissionId: 1
  });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const commData = await commissionApi.getAll();
      setCommissions(commData);
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        nameTe: category.nameTe || "",
        description: category.description || "",
        descriptionTe: category.descriptionTe || "",
        imageUrl: category.imageUrl || "",
        commissionId: category.commissionId || 1
      });
    } else {
      setEditingCategory(null);
      setFormData({ 
        name: "", 
        nameTe: "", 
        description: "", 
        descriptionTe: "", 
        imageUrl: "", 
        commissionId: commissions.length > 0 ? commissions[0].id : 1 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, formData);
      } else {
        await categoryApi.create(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryApi.delete(id);
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-[#FAFAF9]">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-base md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div>
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              Category Management
            </h1>
            <p className="text-[18px] text-[#FAFAF9]/70 font-[600]">
              Create, edit, and organize exam categories.
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
            Add Category
          </motion.button>
        </motion.div>

        {/* Category List */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-[#FAFAF9]/50 bg-white/5 rounded-xl border border-[#57534E]/40">
              No categories found. Click "Add Category" to get started.
            </div>
          ) : (
            categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: index * 0.1 }}
                whileHover={{ 
                  y: -4, 
                  backgroundColor: "rgba(147,51,234,0.18)" 
                }}
                className="w-full flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-[rgba(147,51,234,0.1)] border border-[rgba(147,51,234,0.25)] shadow-md  transition-colors"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[16px] overflow-hidden bg-[#292524] border border-orange-500/50 flex items-center justify-center font-bold text-2xl">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    cat.name.charAt(0)
                  )}
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="text-xs font-bold text-[#F97316] mb-1">{commissions.find(c => c.id === cat.commissionId)?.code || "Commission"}</div>
                  <h3 className="text-[22px] md:text-[24px] font-[700] mb-1">{cat.name}</h3>
                  <p className="text-[16px] font-[600] text-[#FAFAF9]/70">{cat.description}</p>
                </div>

                <div className="flex items-center justify-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <motion.button 
                    whileHover={{ y: -4, boxShadow: "0px 15px 30px rgba(147, 51, 234, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={spring}
                    onClick={() => handleOpenModal(cat)}
                    className="flex-1 md:flex-none px-6 py-3 rounded-[12px] bg-[rgba(147,51,234,0.1)] border border-[rgba(147,51,234,0.25)] text-[#FAFAF9] font-[700] hover:bg-[rgba(147,51,234,0.3)] transition-colors"
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -4, boxShadow: "0px 15px 30px rgba(236, 72, 153, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={spring}
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 md:flex-none px-6 py-3 rounded-[12px] bg-[rgba(236,72,153,0.1)] border border-[rgba(236,72,153,0.3)] text-[#EF4444] font-[700] hover:bg-[rgba(236,72,153,0.2)] transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? "Update Category" : "New Category"}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AnimatedInput 
              label="Category Name (English)"
              type="text"
              name="name"
              placeholder="e.g. Group 1"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              required
            />
            
            <AnimatedInput 
              label="Category Name (Telugu)"
              type="text"
              name="nameTe"
              placeholder="తెలుగు పేరు"
              value={formData.nameTe}
              onChange={(val) => setFormData({ ...formData, nameTe: val })}
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Commission</label>
              <CustomSelect
                value={formData.commissionId}
                options={commissions.map(c => ({ value: c.id, label: c.code }))}
                onChange={(val) => setFormData({ ...formData, commissionId: Number(val) })}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Description</label>
              <textarea 
                className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-4 text-[#FAFAF9] focus:outline-none focus:border-orange-500/50 transition-colors min-h-[100px]"
                placeholder="Briefly describe this category..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <AnimatedInput 
              label="Icon/Image URL"
              type="text"
              name="imageUrl"
              placeholder="https://..."
              value={formData.imageUrl || ""}
              onChange={(val) => setFormData({ ...formData, imageUrl: val })}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-4 rounded-xl bg-[#EA580C] font-bold shadow-lg shadow-orange-500/20"
              type="submit"
            >
              {editingCategory ? "Update Category" : "Create Category"}
            </motion.button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
