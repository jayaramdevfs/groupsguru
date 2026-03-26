"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { commissionApi } from "@/lib/commissions";
import { Commission, CommissionRequest } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";

export default function AdminCommissionManagement() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | null>(null);
  const [formData, setFormData] = useState<CommissionRequest>({
    code: "",
    name: "",
    nameTe: "",
    description: "",
    descriptionTe: "",
    imageUrl: "",
    displayOrder: 0,
    accessType: "FREE",
    priceInr: 0,
    isActive: true
  });

  const fetchCommissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await commissionApi.getAll();
      setCommissions(data);
    } catch (error) {
      console.error("Failed to fetch commissions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const handleOpenModal = (commission: Commission | null = null) => {
    if (commission) {
      setEditingCommission(commission);
      setFormData({
        code: commission.code,
        name: commission.name,
        nameTe: commission.nameTe,
        description: commission.description || "",
        descriptionTe: commission.descriptionTe || "",
        imageUrl: commission.imageUrl || "",
        displayOrder: commission.displayOrder || 0,
        accessType: commission.accessType || "FREE",
        priceInr: commission.priceInr || 0,
        isActive: commission.isActive ?? true
      });
    } else {
      setEditingCommission(null);
      setFormData({
        code: "",
        name: "",
        nameTe: "",
        description: "",
        descriptionTe: "",
        imageUrl: "",
        displayOrder: 0,
        accessType: "FREE",
        priceInr: 0,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCommission) {
        await commissionApi.update(editingCommission.id, formData);
      } else {
        await commissionApi.create(formData);
      }
      setIsModalOpen(false);
      fetchCommissions();
    } catch (error) {
      console.error("Failed to save commission:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this commission?")) {
      try {
        await commissionApi.delete(id);
        fetchCommissions();
      } catch (error) {
        console.error("Failed to delete commission:", error);
      }
    }
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Governance Entities</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Public Service <span className="text-[#D97706]">Commissions</span>
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
            Add Commission
          </button>
        </header>

        {/* Commission List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-20 text-[#666666] bg-[#1E1E1E] rounded-lg border border-[#3A3A3A] font-mono text-sm uppercase tracking-widest">
              No regions found.
            </div>
          ) : (
            commissions.map((comm) => (
              <div
                key={comm.id}
                className="group w-full flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] hover:border-[#D97706]/30 transition-colors"
              >
                <div className="w-16 h-16 shrink-0 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center font-mono font-bold text-2xl text-[#D97706] overflow-hidden">
                  {comm.imageUrl ? (
                    <img src={comm.imageUrl} alt={comm.name} className="w-full h-full object-cover" />
                  ) : (
                    comm.code.charAt(0)
                  )}
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest mb-1">
                    Entity Code: {comm.code}
                  </div>
                  <h3 className="text-xl font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors mb-1">{comm.name}</h3>
                  <p className="text-sm text-[#A0A0A0] line-clamp-2">{comm.description}</p>
                </div>

                <div className="flex items-center justify-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleOpenModal(comm)}
                    className="flex-1 md:flex-none px-4 py-2 rounded border border-[#3A3A3A] text-[#E8E8E8] text-xs font-bold hover:bg-[#2D2D2D] hover:border-[#666666] transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(comm.id)}
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
          title={editingCommission ? "Update Commission" : "New Commission"}
        >
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <AnimatedInput 
                  label="Code"
                  type="text"
                  name="code"
                  placeholder="e.g. APPSC"
                  value={formData.code}
                  onChange={(val) => setFormData({ ...formData, code: val })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <AnimatedInput 
                  label="English Display Name"
                  type="text"
                  name="name"
                  placeholder="e.g. Andhra Pradesh Public Service Commission"
                  value={formData.name}
                  onChange={(val) => setFormData({ ...formData, name: val })}
                  required
                />
              </div>
            </div>

            <AnimatedInput 
              label="Telugu Display Name"
              type="text"
              name="nameTe"
              placeholder="..."
              value={formData.nameTe}
              onChange={(val) => setFormData({ ...formData, nameTe: val })}
              required
            />
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Entity Description</label>
              <textarea 
                className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[120px] resize-none"
                placeholder="Briefly describe this commission..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <AnimatedInput 
              label="Thumbnail/Logo URL (Optional)"
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
              {editingCommission ? "Save Changes" : "Create Commission Entity"}
            </button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
