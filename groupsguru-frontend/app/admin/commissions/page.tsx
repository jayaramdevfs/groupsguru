"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { commissionApi } from "@/lib/commissions";
import { Commission, CommissionRequest } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

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
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">
        
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-base md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div>
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              Commission Management (L0)
            </h1>
            <p className="text-[18px] text-white/70 font-[600]">
              Create, edit, and organize commissions (APPSC, TSPSC, UPSC).
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
            Add Commission
          </motion.button>
        </motion.div>

        {/* Commission List */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-20 text-white/50 bg-white/5 rounded-[24px] border border-white/10">
              No commissions found. Click "Add Commission" to get started.
            </div>
          ) : (
            commissions.map((comm, index) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: index * 0.1 }}
                whileHover={{ 
                  y: -4, 
                  backgroundColor: "rgba(147,51,234,0.18)" 
                }}
                className="w-full flex flex-col md:flex-row items-center gap-6 p-6 rounded-[24px] bg-[rgba(147,51,234,0.1)] border border-[rgba(147,51,234,0.25)] shadow-[0_15px_50px_rgba(147,51,234,0.3)] backdrop-blur-md transition-colors"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[16px] overflow-hidden bg-purple-900 border border-purple-500/50 flex items-center justify-center font-bold text-2xl">
                  {comm.imageUrl ? (
                    <img src={comm.imageUrl} alt={comm.name} className="w-full h-full object-cover" />
                  ) : (
                    comm.code.charAt(0)
                  )}
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <h3 className="text-[22px] md:text-[24px] font-[700] mb-1">{comm.name} ({comm.code})</h3>
                  <p className="text-[16px] font-[600] text-white/70">{comm.description}</p>
                </div>

                <div className="flex items-center justify-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <motion.button 
                    whileHover={{ y: -4, boxShadow: "0px 15px 30px rgba(147, 51, 234, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={spring}
                    onClick={() => handleOpenModal(comm)}
                    className="flex-1 md:flex-none px-6 py-3 rounded-[12px] bg-[rgba(147,51,234,0.1)] border border-[rgba(147,51,234,0.25)] text-white font-[700] hover:bg-[rgba(147,51,234,0.3)] transition-colors"
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -4, boxShadow: "0px 15px 30px rgba(236, 72, 153, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={spring}
                    onClick={() => handleDelete(comm.id)}
                    className="flex-1 md:flex-none px-6 py-3 rounded-[12px] bg-[rgba(236,72,153,0.1)] border border-[rgba(236,72,153,0.3)] text-[#EC4899] font-[700] hover:bg-[rgba(236,72,153,0.2)] transition-colors"
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
          title={editingCommission ? "Update Commission" : "New Commission"}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AnimatedInput 
              label="Commission Code"
              type="text"
              name="code"
              placeholder="e.g. APPSC"
              value={formData.code}
              onChange={(val) => setFormData({ ...formData, code: val })}
              required
            />
            <AnimatedInput 
              label="Commission Name (English)"
              type="text"
              name="name"
              placeholder="e.g. Andhra Pradesh Public Service Commission"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              required
            />
            <AnimatedInput 
              label="Commission Name (Telugu)"
              type="text"
              name="nameTe"
              placeholder=""
              value={formData.nameTe}
              onChange={(val) => setFormData({ ...formData, nameTe: val })}
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/60 ml-1">Description</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors min-h-[100px]"
                placeholder="Briefly describe this commission..."
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
              className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold shadow-lg shadow-purple-500/20"
              type="submit"
            >
              {editingCommission ? "Update Commission" : "Create Commission"}
            </motion.button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
