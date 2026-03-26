"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Question, QuestionRequest } from "@/lib/types";

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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "CREATE" ? "Inject New Question" : "Modify Entry"} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedInput label="Entry Code" type="text" name="questionCode" value={formData.questionCode || ""} onChange={(v) => handleChange("questionCode", v)} required />
          <AnimatedInput label="Domain/Subject" type="text" name="subject" value={formData.subject || ""} onChange={(v) => handleChange("subject", v)} required />
          <AnimatedInput label="Penalty Ratio" type="number" name="penalty" value={(formData.penalty || 0).toString()} onChange={(v) => handleChange("penalty", parseFloat(v.toString()))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Logic Pattern</label>
            <CustomSelect options={TYPES.map(t => ({label: t, value: t}))} value={formData.questionType || ""} onChange={(v) => handleChange("questionType", v as string)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Complexity</label>
            <CustomSelect options={DIFFICULTIES.map(t => ({label: t, value: t}))} value={formData.difficulty || ""} onChange={(v) => handleChange("difficulty", v as string)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Cognitive Layer</label>
            <CustomSelect options={COGNITIVE_LEVELS.map(t => ({label: t, value: t}))} value={formData.cognitiveLevel || ""} onChange={(v) => handleChange("cognitiveLevel", v as string)} />
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-6 pt-4 border-t border-[#3A3A3A]">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-[0.2em] ml-1">Primary Statement (EN)</label>
            <textarea className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[100px] resize-none" required value={formData.questionTextEn || ""} onChange={(e) => handleChange("questionTextEn", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] ml-1">Translated Statement (TE)</label>
            <textarea className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#A0A0A0] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[100px] resize-none" required value={formData.questionTextTe || ""} onChange={(e) => handleChange("questionTextTe", e.target.value)} />
          </div>
        </div>

        {/* Options Grid */}
        <div className="space-y-6 pt-4 border-t border-[#3A3A3A]">
          <div className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] mb-4">Response Vectors</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {["A", "B", "C", "D"].map((letter) => (
              <div key={letter} className="space-y-4 p-4 rounded bg-[#141414] border border-[#3A3A3A]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#D97706]">VECTOR_{letter}</span>
                  <input 
                    type="radio" 
                    name="correctOption" 
                    checked={formData.correctOption === letter} 
                    onChange={() => handleChange("correctOption", letter)}
                    className="w-4 h-4 accent-[#D97706]"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder={`Option ${letter} (EN)`}
                  className="w-full bg-transparent border-b border-[#3A3A3A] pb-2 text-sm text-[#E8E8E8] focus:outline-none focus:border-[#D97706]/50"
                  value={(formData as any)[`option${letter}En`] || ""} 
                  onChange={(e) => handleChange(`option${letter}En`, e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder={`Option ${letter} (TE)`}
                  className="w-full bg-transparent border-b border-[#3A3A3A] pb-2 text-sm text-[#A0A0A0] focus:outline-none focus:border-[#D97706]/50"
                  value={(formData as any)[`option${letter}Te`] || ""} 
                  onChange={(e) => handleChange(`option${letter}Te`, e.target.value)} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Explanations */}
        <div className="space-y-6 pt-4 border-t border-[#3A3A3A]">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] ml-1">Logic Rationale (EN)</label>
            <textarea className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#A0A0A0] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[80px] resize-none" value={formData.explanationEn || ""} onChange={(e) => handleChange("explanationEn", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] ml-1">Logic Rationale (TE)</label>
            <textarea className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#A0A0A0] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[80px] resize-none" value={formData.explanationTe || ""} onChange={(e) => handleChange("explanationTe", e.target.value)} />
          </div>
        </div>

        {/* Hierarchical Sync */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#3A3A3A]">
          <AnimatedInput label="Hierarchy Node ID" type="text" name="microTopicId" value={formData.microTopicId || ""} onChange={(v) => handleChange("microTopicId", v)} required />
          <AnimatedInput label="Batch Code" type="text" name="sprintId" value={formData.sprintId || ""} onChange={(v) => handleChange("sprintId", v)} required />
        </div>

        <button disabled={isSaving} type="submit" className={`w-full py-4 rounded font-bold text-sm transition-all ${isSaving ? "bg-[#3A3A3A] text-[#666666]" : "bg-[#D97706] text-white hover:bg-[#F59E0B]"}`}>
          {isSaving ? "COMMITING..." : "COMMIT ENTRY TO ARCHIVE"}
        </button>
      </form>
    </Modal>
  );
}
