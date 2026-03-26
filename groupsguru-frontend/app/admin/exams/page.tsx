"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { examsApi } from "@/lib/exams";
import { questionsApi } from "@/lib/questions";
import { Exam, ExamType, Question } from "@/lib/types";
import CustomSelect from "@/components/ui/CustomSelect";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";

const EXAM_TYPES: ExamType[] = ["TOPIC_WISE", "SECTION_WISE", "SUBJECT_WISE", "FULL_LENGTH_TEST"];
const SUBJECTS = ["History", "AP History", "Polity", "Economy", "Geography", "Science", "Mental Ability"];

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameTe: "",
    description: "",
    descriptionTe: "",
    examType: "TOPIC_WISE" as ExamType,
    subject: "History",
    totalQuestions: 25,
    durationMinutes: 30,
    negativeMarking: true,
    penaltyPerWrong: 0.25,
    marksPerQuestion: 1.0,
    isActive: true,
  });

  // Assign Questions Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeAssignExam, setActiveAssignExam] = useState<Exam | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [assignSearch, setAssignSearch] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await examsApi.getAllAdmin();
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingExam(null);
    setFormData({
      name: "",
      nameTe: "",
      description: "",
      descriptionTe: "",
      examType: "TOPIC_WISE",
      subject: "History",
      totalQuestions: 25,
      durationMinutes: 30,
      negativeMarking: true,
      penaltyPerWrong: 0.25,
      marksPerQuestion: 1.0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      nameTe: exam.nameTe,
      description: exam.description || "",
      descriptionTe: exam.descriptionTe || "",
      examType: exam.examType,
      subject: exam.subject || "History",
      totalQuestions: exam.totalQuestions,
      durationMinutes: exam.durationMinutes,
      negativeMarking: exam.negativeMarking,
      penaltyPerWrong: exam.penaltyPerWrong,
      marksPerQuestion: exam.marksPerQuestion,
      isActive: exam.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await examsApi.update(editingExam.id, formData);
      } else {
        await examsApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this exam configuration?")) {
      await examsApi.delete(id);
      fetchData();
    }
  };

  const handleOpenAssign = async (exam: Exam) => {
    setActiveAssignExam(exam);
    setIsAssignModalOpen(true);
    
    // Fetch all questions and current assignments
    try {
      const qs = await questionsApi.getAll(0, 1000);
      setAllQuestions(qs.content);
      const assigned = await examsApi.getAssignedQuestions(exam.id);
      setSelectedQuestionIds(assigned);
    } catch (error) {
      console.error("Failed to load assignment data:", error);
    }
  };

  const handleAssignSubmit = async () => {
    if (!activeAssignExam) return;
    try {
      await examsApi.assignQuestions(activeAssignExam.id, selectedQuestionIds);
      setIsAssignModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Assignment failed:", error);
    }
  };

  const toggleQuestion = (id: number) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredQuestions = allQuestions.filter(q => 
    q.questionTextEn.toLowerCase().includes(assignSearch.toLowerCase()) ||
    q.questionCode.toLowerCase().includes(assignSearch.toLowerCase())
  );

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        
        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Operational Module_10</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Examination <span className="text-[#D97706]">Architect</span>
            </h1>
          </div>

          <button 
            onClick={handleOpenCreate}
            className="px-6 py-3 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Initialize Exam
          </button>
        </header>

        {/* Exams Table */}
        <div className="border border-[#3A3A3A] rounded bg-[#1C1C1C] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3A3A3A] bg-[#141414]">
                <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Descriptor</th>
                <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Classification</th>
                <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest text-center">Metrics</th>
                <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {exams.map((exam) => (
                <tr 
                  key={exam.id}
                  className="border-b border-[#3A3A3A] hover:bg-[#1E1E1E] transition-colors group"
                >
                  <td className="p-4">
                    <div className="text-[#E8E8E8] font-bold group-hover:text-[#D97706] transition-colors">{exam.name}</div>
                    <div className="text-[10px] text-[#666666] mt-0.5">{exam.nameTe}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-block px-1.5 py-0.5 rounded border border-[#D97706]/20 bg-[#D97706]/5 text-[#D97706] text-[9px] font-mono font-bold uppercase w-fit">
                        {exam.examType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-[#666666] font-mono uppercase tracking-widest">{exam.subject || "GEN_COUP"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col gap-1">
                      <div className="text-[#E8E8E8] font-mono text-xs">{exam.totalQuestions} Qs</div>
                      <div className="text-[#666666] font-mono text-[9px] uppercase">{exam.durationMinutes}m Duration</div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenAssign(exam)}
                        className="px-3 py-1.5 rounded border border-[#D97706] text-[#D97706] text-[10px] font-mono font-bold uppercase transition-colors hover:bg-[#D97706] hover:text-white"
                      >
                        Map Qs
                      </button>
                      <button 
                         onClick={() => handleOpenEdit(exam)}
                        className="p-1.5 rounded border border-[#3A3A3A] text-[#E8E8E8] transition-colors hover:bg-[#2D2D2D]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(exam.id)}
                        className="p-1.5 rounded border border-[#C74444]/30 text-[#C74444] transition-colors hover:bg-[#C74444]/10"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exams.length === 0 && !isLoading && (
            <div className="p-20 text-center text-[#666666] font-mono text-sm uppercase tracking-widest">
              Zero records in examinations repository.
            </div>
          )}
        </div>

        {/* CRUD Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={editingExam ? "Edit Examination Settings" : "Define New Examination"}
        >
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput label="Official Label (EN)" placeholder="UPSC Prelims Mock 1" value={formData.name} onChange={(val) => setFormData({...formData, name: val})} required />
              <AnimatedInput label="Official Label (TE)" placeholder="..." value={formData.nameTe} onChange={(val) => setFormData({...formData, nameTe: val})} required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Test Classification</label>
                <CustomSelect 
                  options={EXAM_TYPES.map(t => ({ value: t, label: t.replace('_', ' ') }))}
                  value={formData.examType}
                  onChange={(val) => setFormData({...formData, examType: val as ExamType})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Subject Scope</label>
                <CustomSelect 
                  options={SUBJECTS.map(s => ({ value: s, label: s.toUpperCase() }))}
                  value={formData.subject}
                  onChange={(val) => setFormData({...formData, subject: val.toString()})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <AnimatedInput label="Duration_m" placeholder="30" type="number" value={formData.durationMinutes.toString()} onChange={(val) => setFormData({...formData, durationMinutes: parseInt(val) || 0})} />
               <AnimatedInput label="Capacity_q" placeholder="25" type="number" value={formData.totalQuestions.toString()} onChange={(val) => setFormData({...formData, totalQuestions: parseInt(val) || 0})} />
               <AnimatedInput label="Unit Marks" placeholder="1.0" type="number" value={formData.marksPerQuestion.toString()} onChange={(val) => setFormData({...formData, marksPerQuestion: parseFloat(val) || 1.0})} />
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#141414] rounded border border-[#3A3A3A]">
              <input 
                 type="checkbox" 
                 checked={formData.negativeMarking} 
                 onChange={(e) => setFormData({...formData, negativeMarking: e.target.checked})}
                 className="w-4 h-4 accent-[#D97706]"
              />
              <span className="text-xs font-mono font-bold text-[#E8E8E8] uppercase tracking-widest">Enable Penalty Protocol</span>
              {formData.negativeMarking && (
                <div className="ml-auto w-32 scale-90 origin-right">
                  <AnimatedInput label="Penalty Scalar" placeholder="0.25" type="number" value={formData.penaltyPerWrong.toString()} onChange={(val) => setFormData({...formData, penaltyPerWrong: parseFloat(val) || 0.25})} />
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
            >
              {editingExam ? "Commit Configuration Changes" : "Initialize Examination Record"}
            </button>
          </form>
        </Modal>

        {/* Assign Questions Modal */}
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Map Corpus Questions"
        >
          <div className="space-y-6 pt-4">
            <div className="flex gap-4 items-center">
               <input 
                 type="text" 
                 placeholder="Filter questions by reference..."
                 value={assignSearch}
                 onChange={(e) => setAssignSearch(e.target.value)}
                 className="flex-1 bg-[#141414] border border-[#3A3A3A] rounded px-4 py-2.5 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors"
               />
               <div className="px-4 py-2 bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] rounded font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                 {selectedQuestionIds.length} MAP_SIGS
               </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {filteredQuestions.map(q => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div 
                    key={q.id}
                    onClick={() => toggleQuestion(q.id)}
                    className={`p-4 rounded border transition-all cursor-pointer group ${
                      isSelected 
                        ? "bg-[#D97706]/5 border-[#D97706]/40" 
                        : "bg-[#1E1E1E] border-[#3A3A3A] hover:border-[#666666]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        isSelected ? "bg-[#D97706] border-[#D97706] text-white" : "bg-[#141414] border-[#3A3A3A]"
                      }`}>
                        {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-[9px] text-[#D97706] font-bold tracking-widest uppercase">{q.questionCode}</span>
                          <span className="text-[9px] text-[#666666] font-mono font-bold uppercase tracking-widest">{q.subject}</span>
                        </div>
                        <p className="text-xs font-medium text-[#E8E8E8] line-clamp-1 group-hover:text-white transition-colors">{q.questionTextEn}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={handleAssignSubmit}
              className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
            >
              Commit Mapping Signatures
            </button>
          </div>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
