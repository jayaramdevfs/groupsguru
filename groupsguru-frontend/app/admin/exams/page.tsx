"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { examsApi } from "@/lib/exams";
import { questionsApi } from "@/lib/questions";
import { Exam, ExamType, Question } from "@/lib/types";
import CustomSelect from "@/components/ui/CustomSelect";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";

const spring = { type: "spring" as const, stiffness: 420, damping: 24, mass: 0.8 };

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
    if (confirm("Delete this exam?")) {
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
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 italic">Exam Management</h1>
            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Sprint 10 — Structure & Assignments</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black italic shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Create New Exam
          </button>
        </div>

        {/* Exams Table */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest text-white/40 italic">
                <th className="p-6">Name</th>
                <th className="p-6">Type</th>
                <th className="p-6">Subject</th>
                <th className="p-6 text-center">Questions</th>
                <th className="p-6 text-center">Duration</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-bold text-sm">
              <AnimatePresence>
                {exams.map((exam) => (
                  <motion.tr 
                    key={exam.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6">
                      <div className="text-white mb-1 italic">{exam.name}</div>
                      <div className="text-[10px] text-white/40">{exam.nameTe}</div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-[10px] font-black italic uppercase">
                        {exam.examType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-6 text-white/60 italic">{exam.subject || "N/A"}</td>
                    <td className="p-6 text-center italic">{exam.totalQuestions}</td>
                    <td className="p-6 text-center italic">{exam.durationMinutes}m</td>
                    <td className="p-6 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenAssign(exam)}
                        className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 transition-all italic text-xs"
                      >
                        Assign Qs
                      </button>
                      <button 
                         onClick={() => handleOpenEdit(exam)}
                        className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all italic text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(exam.id)}
                        className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all italic text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {exams.length === 0 && !isLoading && (
            <div className="p-20 text-center text-white/40 italic font-bold">No exams found. Start by creating one.</div>
          )}
        </div>

        {/* CRUD Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={editingExam ? "Edit Exam" : "Create Exam"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput label="Exam Name (EN)" placeholder="Enter name" value={formData.name} onChange={(val) => setFormData({...formData, name: val})} />
              <AnimatedInput label="Exam Name (TE)" placeholder="పేరు నమోదు చేయండి" value={formData.nameTe} onChange={(val) => setFormData({...formData, nameTe: val})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 mb-2 block italic">Exam Type</label>
                <CustomSelect 
                  options={EXAM_TYPES.map(t => ({ value: t, label: t.replace('_', ' ') }))}
                  value={formData.examType}
                  onChange={(val) => setFormData({...formData, examType: val as ExamType})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 mb-2 block italic">Subject</label>
                <CustomSelect 
                  options={SUBJECTS.map(s => ({ value: s, label: s }))}
                  value={formData.subject}
                  onChange={(val) => setFormData({...formData, subject: val.toString()})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <AnimatedInput label="Duration (min)" placeholder="30" type="number" value={formData.durationMinutes.toString()} onChange={(val) => setFormData({...formData, durationMinutes: parseInt(val) || 0})} />
               <AnimatedInput label="Avg Q Count" placeholder="25" type="number" value={formData.totalQuestions.toString()} onChange={(val) => setFormData({...formData, totalQuestions: parseInt(val) || 0})} />
               <AnimatedInput label="Marks/Question" placeholder="1.0" type="number" value={formData.marksPerQuestion.toString()} onChange={(val) => setFormData({...formData, marksPerQuestion: parseFloat(val) || 1.0})} />
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              <input 
                 type="checkbox" 
                 checked={formData.negativeMarking} 
                 onChange={(e) => setFormData({...formData, negativeMarking: e.target.checked})}
                 className="w-5 h-5 accent-purple-500"
              />
              <span className="font-bold italic">Enable Negative Marking</span>
              {formData.negativeMarking && (
                <div className="ml-auto w-32">
                  <AnimatedInput label="Penalty" placeholder="0.25" type="number" value={formData.penaltyPerWrong.toString()} onChange={(val) => setFormData({...formData, penaltyPerWrong: parseFloat(val) || 0.25})} />
                </div>
              )}
            </div>

            <div className="flex gap-4">
               <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 rounded-2xl font-bold italic transition-all hover:bg-white/10"
               >
                  Cancel
               </button>
               <button 
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black italic shadow-lg shadow-purple-500/20"
               >
                  {editingExam ? "Save Changes" : "Create Exam"}
               </button>
            </div>
          </form>
        </Modal>

        {/* Assign Questions Modal */}
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title={`Assign Questions: ${activeAssignExam?.name}`}
        >
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
               <input 
                 type="text" 
                 placeholder="Search questions..."
                 value={assignSearch}
                 onChange={(e) => setAssignSearch(e.target.value)}
                 className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all font-bold italic"
               />
               <div className="px-6 py-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl font-black italic">
                 {selectedQuestionIds.length} Selected
               </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {filteredQuestions.map(q => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div 
                    key={q.id}
                    onClick={() => toggleQuestion(q.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-purple-500/10 border-purple-500/40" 
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                        isSelected ? "bg-purple-500 border-purple-500 text-white" : "border-white/20"
                      }`}>
                        {isSelected && "✓"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-[10px] text-purple-400 font-black">{q.questionCode}</span>
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{q.subject}</span>
                        </div>
                        <p className="text-xs font-bold italic line-clamp-1">{q.questionTextEn}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 rounded-2xl font-bold italic transition-all hover:bg-white/10"
               >
                  Cancel
               </button>
               <button 
                  onClick={handleAssignSubmit}
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-black italic shadow-lg shadow-purple-500/20"
               >
                  Save Assignment
               </button>
            </div>
          </div>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
