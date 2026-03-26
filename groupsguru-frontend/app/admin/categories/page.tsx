"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { categoryApi } from "@/lib/categories";
import { commissionApi } from "@/lib/commissions";
import { Category, CategoryRequest, Commission } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";

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
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Structure Management</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Exam <span className="text-[#D97706]">Categories</span>
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
            Add Category
          </button>
        </header>

        {/* Category List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-[#666666] bg-[#1E1E1E] rounded-lg border border-[#3A3A3A] font-mono text-sm uppercase tracking-widest">
              No categories found.
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="group w-full flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] hover:border-[#D97706]/30 transition-colors"
              >
                <div className="w-16 h-16 shrink-0 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center font-mono font-bold text-2xl text-[#D97706] overflow-hidden">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    cat.name.charAt(0)
                  )}
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest mb-1">
                    {commissions.find(c => c.id === cat.commissionId)?.code || "Commission"}
                  </div>
                  <h3 className="text-xl font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors mb-1">{cat.name}</h3>
                  <p className="text-sm text-[#A0A0A0] line-clamp-2">{cat.description}</p>
                </div>

                <div className="flex items-center justify-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleOpenModal(cat)}
                    className="flex-1 md:flex-none px-4 py-2 rounded border border-[#3A3A3A] text-[#E8E8E8] text-xs font-bold hover:bg-[#2D2D2D] hover:border-[#666666] transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded border border-[#C74444]/30 text-[#C74444] text-xs font-bold hover:bg-[#C74444]/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={editingCategory ? "Update Category" : "New Category"}
        >
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput 
                label="English Name"
                type="text"
                name="name"
                placeholder="e.g. Group 1"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                required
              />
              <AnimatedInput 
                label="Telugu Name"
                type="text"
                name="nameTe"
                placeholder="e.g. గ్రూప్ 1"
                value={formData.nameTe}
                onChange={(val) => setFormData({ ...formData, nameTe: val })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Commission Provider</label>
              <CustomSelect
                value={formData.commissionId}
                options={commissions.map(c => ({ value: c.id, label: c.code }))}
                onChange={(val) => setFormData({ ...formData, commissionId: Number(val) })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Overall Description</label>
              <textarea 
                className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[120px] resize-none"
                placeholder="Briefly describe this category..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <AnimatedInput 
              label="Thumbnail URL (Optional)"
              type="text"
              name="imageUrl"
              placeholder="https://..."
              value={formData.imageUrl || ""}
              onChange={(val) => setFormData({ ...formData, imageUrl: val })}
            />

            <button
              className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
              type="submit"
            >
              {editingCategory ? "Save Changes" : "Create Category Instance"}
            </button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
