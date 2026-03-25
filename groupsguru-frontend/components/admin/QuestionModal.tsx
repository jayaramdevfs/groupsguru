import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Question, QuestionRequest } from "@/lib/types";
import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QuestionRequest) => Promise<void>;
  initialData?: Question | null;
  mode: "CREATE" | "EDIT";
}

const DIFFICULTIES = ["easy", "medium", "hard", "very_hard"];
const TYPES = ["STATIC", "ANALYTICAL", "STMT", "ELIM", "MATCH", "AR", "CA_STATIC", "GK", "SCHEME"];
const COGNITIVE_LEVELS = ["L1", "L2", "L3", "L4"];
const OPTIONS = ["A", "B", "C", "D"];

export default function QuestionModal({ isOpen, onClose, onSave, initialData, mode }: Props) {
  const [formData, setFormData] = useState<Partial<QuestionRequest>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
          questionCode: "",
          questionTextEn: "",
          questionTextTe: "",
          optionAEn: "",
          optionATe: "",
          optionBEn: "",
          optionBTe: "",
          optionCEn: "",
          optionCTe: "",
          optionDEn: "",
          optionDTe: "",
          correctOption: "A",
          explanationEn: "",
          explanationTe: "",
          microTopicId: "",
          subject: "",
          difficulty: "easy",
          cognitiveLevel: "L1",
          questionType: "STATIC",
          sprintId: "SPRINT-DEFAULT",
          penalty: -0.33,
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData as QuestionRequest);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "CREATE" ? "Add New Question" : "Edit Question"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto px-1 pb-4 custom-scrollbar">
        
        <div className="grid grid-cols-2 gap-4">
          <AnimatedInput label="Question Code" type="text" name="questionCode" value={formData.questionCode || ""} onChange={(v) => handleChange("questionCode", v)} required />
          <AnimatedInput label="Subject" type="text" name="subject" value={formData.subject || ""} onChange={(v) => handleChange("subject", v)} required />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#FAFAF9]/50 ml-1">Type</span>
            <CustomSelect options={TYPES.map(t => ({label: t, value: t}))} value={formData.questionType || ""} onChange={(v) => handleChange("questionType", v as string)} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#FAFAF9]/50 ml-1">Difficulty</span>
            <CustomSelect options={DIFFICULTIES.map(t => ({label: t, value: t}))} value={formData.difficulty || ""} onChange={(v) => handleChange("difficulty", v as string)} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#FAFAF9]/50 ml-1">Cognitive Level</span>
            <CustomSelect options={COGNITIVE_LEVELS.map(t => ({label: t, value: t}))} value={formData.cognitiveLevel || ""} onChange={(v) => handleChange("cognitiveLevel", v as string)} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Question (English)</label>
          <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] focus:outline-none min-h-[80px]" required value={formData.questionTextEn || ""} onChange={(e) => handleChange("questionTextEn", e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Question (Telugu)</label>
          <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] focus:outline-none min-h-[80px]" required value={formData.questionTextTe || ""} onChange={(e) => handleChange("questionTextTe", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#57534E]/40 pt-4 mt-2">
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option A (English)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionAEn || ""} onChange={(e) => handleChange("optionAEn", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option A (Telugu)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionATe || ""} onChange={(e) => handleChange("optionATe", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#57534E]/40 pt-4 mt-2">
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option B (English)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionBEn || ""} onChange={(e) => handleChange("optionBEn", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option B (Telugu)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionBTe || ""} onChange={(e) => handleChange("optionBTe", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#57534E]/40 pt-4 mt-2">
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option C (English)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionCEn || ""} onChange={(e) => handleChange("optionCEn", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option C (Telugu)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionCTe || ""} onChange={(e) => handleChange("optionCTe", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#57534E]/40 pt-4 mt-2">
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option D (English)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionDEn || ""} onChange={(e) => handleChange("optionDEn", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Option D (Telugu)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" required value={formData.optionDTe || ""} onChange={(e) => handleChange("optionDTe", e.target.value)} />
          </div>
        </div>

        <div className="border-t border-[#57534E]/40 pt-4 mt-2">
          <div className="flex flex-col gap-1 w-1/3">
            <span className="text-xs text-[#FAFAF9]/50 ml-1">Correct Option</span>
            <CustomSelect options={OPTIONS.map(t => ({label: t, value: t}))} value={formData.correctOption || "A"} onChange={(v) => handleChange("correctOption", v as string)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#57534E]/40 pt-4 mt-2">
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Explanation (English)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" value={formData.explanationEn || ""} onChange={(e) => handleChange("explanationEn", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-[#FAFAF9]/60 ml-1">Explanation (Telugu)</label>
             <textarea className="w-full bg-white/5 border border-[#57534E]/40 rounded-xl p-3 text-[#FAFAF9] min-h-[60px]" value={formData.explanationTe || ""} onChange={(e) => handleChange("explanationTe", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-[#57534E]/40 pt-4 mt-2">
          <AnimatedInput label="MicroTopic ID" type="text" name="microTopicId" value={formData.microTopicId || ""} onChange={(v) => handleChange("microTopicId", v)} required />
          <AnimatedInput label="Sprint ID" type="text" name="sprintId" value={formData.sprintId || ""} onChange={(v) => handleChange("sprintId", v)} required />
          <AnimatedInput label="Penalty" type="number" name="penalty" value={(formData.penalty || 0).toString()} onChange={(v) => handleChange("penalty", parseFloat(v))} />
        </div>

        <motion.button disabled={isSaving} type="submit" whileHover={{ scale: 1.02 }} className="mt-6 w-full py-4 rounded-xl bg-[#EA580C] font-bold">
          {isSaving ? "Saving..." : "Save Question"}
        </motion.button>
      </form>
    </Modal>
  );
}
