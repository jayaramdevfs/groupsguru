"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback, useMemo } from "react";
import { examsApi } from "@/lib/exams";
import { questionsApi } from "@/lib/questions";
import { categoryApi } from "@/lib/categories";
import { subCategoryApi } from "@/lib/subcategories";
import { sectionApi } from "@/lib/sections";
import { topicApi } from "@/lib/topics";
import { Exam, ExamType, Question, Category, SubCategory, Section, Topic } from "@/lib/types";
import CustomSelect from "@/components/ui/CustomSelect";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";

const EXAM_TYPES: ExamType[] = ["TOPIC_WISE", "SECTION_WISE", "SUBJECT_WISE", "FULL_LENGTH_TEST"];
const SUBJECTS = ["History", "AP History", "Polity", "Economy", "Geography", "Science", "Mental Ability"];

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
    categoryId: undefined as number | undefined,
    subCategoryId: undefined as number | undefined,
    sectionId: undefined as number | undefined,
    topicId: undefined as number | undefined,
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
      const [examsData, catsData] = await Promise.all([
        examsApi.getAllAdmin(),
        categoryApi.adminGetAll()
      ]);
      setExams(examsData);
      setCategories(catsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = (nodeType: string, nodeId: number) => {
    setEditingExam(null);
    setFormData({
      name: "", nameTe: "", description: "", descriptionTe: "",
      examType: "TOPIC_WISE", subject: "History", totalQuestions: 25, durationMinutes: 30,
      negativeMarking: true, penaltyPerWrong: 0.25, marksPerQuestion: 1.0, isActive: true,
      categoryId: nodeType === 'CATEGORY' ? nodeId : undefined,
      subCategoryId: nodeType === 'SUBCATEGORY' ? nodeId : undefined,
      sectionId: nodeType === 'SECTION' ? nodeId : undefined,
      topicId: nodeType === 'TOPIC' ? nodeId : undefined,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name, nameTe: exam.nameTe, description: exam.description || "", descriptionTe: exam.descriptionTe || "",
      examType: exam.examType, subject: exam.subject || "History", totalQuestions: exam.totalQuestions, durationMinutes: exam.durationMinutes,
      negativeMarking: exam.negativeMarking, penaltyPerWrong: exam.penaltyPerWrong, marksPerQuestion: exam.marksPerQuestion, isActive: exam.isActive,
      categoryId: exam.categoryId, subCategoryId: exam.subCategoryId, sectionId: exam.sectionId, topicId: exam.topicId,
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
    setSelectedQuestionIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => 
      q.questionTextEn.toLowerCase().includes(assignSearch.toLowerCase()) ||
      q.questionCode.toLowerCase().includes(assignSearch.toLowerCase())
    );
  }, [allQuestions, assignSearch]);

  const ExamRow = ({ exam }: { exam: Exam }) => (
    <div className="flex items-center justify-between p-3 ml-8 mt-2 bg-[#141414] border border-[#3A3A3A] rounded hover:border-[#D97706]/50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded bg-[#D97706]/10 border border-[#D97706]/30 flex items-center justify-center text-[#D97706]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div>
          <div className="text-sm font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">{exam.name}</div>
          <div className="text-[10px] text-[#A0A0A0] flex gap-3 mt-1 font-mono uppercase tracking-wider">
            <span>{exam.examType.replace('_', ' ')}</span>
            <span>{exam.totalQuestions} Qs</span>
            <span>{exam.durationMinutes}m</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => handleOpenAssign(exam)} className="px-3 py-1.5 rounded border border-[#D97706] text-[#D97706] text-[10px] font-mono font-bold uppercase transition-colors hover:bg-[#D97706] hover:text-white">Map Qs</button>
        <button onClick={() => handleOpenEdit(exam)} className="p-1.5 rounded border border-[#3A3A3A] text-[#E8E8E8] transition-colors hover:bg-[#2D2D2D]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button onClick={() => handleDelete(exam.id)} className="p-1.5 rounded border border-[#C74444]/30 text-[#C74444] transition-colors hover:bg-[#C74444]/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    </div>
  );

  const TopicNode = ({ topic }: { topic: Topic }) => {
    const nodeExams = exams.filter(e => e.topicId === topic.id);
    return (
      <div className="border-l border-[#3A3A3A] pl-6 ml-4 relative group/node mb-2">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-[#3A3A3A]" />
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">L4_SUBJECT</span>
             <span className="text-sm font-medium text-[#A0A0A0]">{topic.name}</span>
          </div>
          <button onClick={() => handleOpenCreate('TOPIC', topic.id)} className="opacity-0 group-hover/node:opacity-100 text-[9px] font-mono font-bold uppercase tracking-widest text-[#D97706] border border-[#D97706]/30 px-2 py-0.5 rounded hover:bg-[#D97706]/10 transition-colors ml-2">+ Add Exam</button>
        </div>
        {nodeExams.map(ex => <ExamRow key={ex.id} exam={ex} />)}
      </div>
    );
  };

  const SectionNode = ({ section }: { section: Section }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<Topic[]>([]);
    const nodeExams = exams.filter(e => e.sectionId === section.id);

    const load = async () => {
      if (!expanded && children.length === 0) {
        const allTopics = await topicApi.adminGetAll();
        setChildren(allTopics.filter(t => t.sectionId === section.id));
      }
      setExpanded(!expanded);
    };

    return (
      <div className="border-l border-[#3A3A3A] pl-6 ml-4 relative group/node mb-2">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-[#3A3A3A]" />
        <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-[#1E1E1E] rounded px-2" onClick={load}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-widest">L3_PHASE</span>
            <span className={`font-bold transition-colors ${expanded ? 'text-[#D97706]' : 'text-[#E8E8E8]'}`}>{section.name}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleOpenCreate('SECTION', section.id); }} className="opacity-0 group-hover/node:opacity-100 text-[9px] font-mono font-bold uppercase tracking-widest text-[#D97706] border border-[#D97706]/30 px-2 py-0.5 rounded hover:bg-[#D97706]/10 transition-colors ml-2">+ Add Exam</button>
        </div>
        {nodeExams.map(ex => <ExamRow key={ex.id} exam={ex} />)}
        {expanded && <div className="flex flex-col mt-2">{children.map((c) => <TopicNode key={c.id} topic={c} />)}</div>}
      </div>
    );
  };

  const SubCategoryNode = ({ sub }: { sub: SubCategory }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<Section[]>([]);
    const nodeExams = exams.filter(e => e.subCategoryId === sub.id);

    const load = async () => {
      if (!expanded && children.length === 0) {
        const allSections = await sectionApi.adminGetAll();
        setChildren(allSections.filter(s => s.subCategoryId === sub.id));
      }
      setExpanded(!expanded);
    };

    return (
      <div className="border-l border-[#3A3A3A] pl-6 ml-4 relative group/node mb-2">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-[#3A3A3A]" />
        <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-[#1E1E1E] rounded px-2" onClick={load}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-widest">L2_EXAM</span>
            <span className={`font-bold text-lg transition-colors ${expanded ? 'text-[#D97706]' : 'text-[#E8E8E8]'}`}>{sub.name}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleOpenCreate('SUBCATEGORY', sub.id); }} className="opacity-0 group-hover/node:opacity-100 text-[9px] font-mono font-bold uppercase tracking-widest text-[#D97706] border border-[#D97706]/30 px-2 py-0.5 rounded hover:bg-[#D97706]/10 transition-colors ml-2">+ Add Exam</button>
        </div>
        {nodeExams.map(ex => <ExamRow key={ex.id} exam={ex} />)}
        {expanded && <div className="flex flex-col mt-2">{children.map((c) => <SectionNode key={c.id} section={c} />)}</div>}
      </div>
    );
  };

  const CategoryNode = ({ cat }: { cat: Category }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<SubCategory[]>([]);
    const nodeExams = exams.filter(e => e.categoryId === cat.id);

    const load = async () => {
      if (!expanded && children.length === 0) {
        const allSubs = await subCategoryApi.adminGetAll();
        setChildren(allSubs.filter(s => s.categoryId === cat.id));
      }
      setExpanded(!expanded);
    };

    return (
      <div className={`mb-4 border border-[#3A3A3A] rounded bg-[#1C1C1C] p-4 group/node transition-colors ${expanded ? 'border-[#D97706]/30' : 'hover:border-[#D97706]/50'}`}>
        <div className="flex items-center justify-between cursor-pointer" onClick={load}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-widest">L1_COMMISSION</span>
            <span className="text-2xl font-serif text-[#E8E8E8] group-hover/node:text-[#D97706] transition-colors">{cat.name}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleOpenCreate('CATEGORY', cat.id); }} className="opacity-0 group-hover/node:opacity-100 text-[9px] font-mono font-bold uppercase tracking-widest text-[#D97706] border border-[#D97706]/30 px-2 py-0.5 rounded hover:bg-[#D97706]/10 transition-colors ml-2">+ Add Exam</button>
        </div>
        {nodeExams.length > 0 && <div className="mt-4 pt-4 border-t border-[#3A3A3A]/50">{nodeExams.map(ex => <ExamRow key={ex.id} exam={ex} />)}</div>}
        {expanded && <div className="mt-4 pt-4 border-t border-[#3A3A3A]">{children.map((child) => <SubCategoryNode key={child.id} sub={child} />)}</div>}
      </div>
    );
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Operational Module_10</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Examination <span className="text-[#D97706]">Architect</span>
            </h1>
          </div>
        </header>

        {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Parsing Hierarchy...</span>
           </div>
        ) : (
          <div className="flex flex-col gap-4 pb-20">
            {categories.map((cat) => <CategoryNode key={cat.id} cat={cat} />)}
            {categories.length === 0 && (
              <div className="p-20 text-center text-[#666666] font-mono text-sm uppercase tracking-widest border border-[#3A3A3A] rounded bg-[#1C1C1C]">
                Initialize the curriculum hierarchy first.
              </div>
            )}
          </div>
        )}

        {/* CRUD Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExam ? "Edit Examination Settings" : "Define New Examination"}>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput label="Official Label (EN)" placeholder="UPSC Prelims Mock 1" value={formData.name} onChange={(val) => setFormData({...formData, name: val as string})} required />
              <AnimatedInput label="Official Label (TE)" placeholder="..." value={formData.nameTe} onChange={(val) => setFormData({...formData, nameTe: val as string})} required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Test Classification</label>
                <CustomSelect options={EXAM_TYPES.map(t => ({ value: t, label: t.replace('_', ' ') }))} value={formData.examType} onChange={(val) => setFormData({...formData, examType: val as ExamType})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Subject Scope</label>
                <CustomSelect options={SUBJECTS.map(s => ({ value: s, label: s.toUpperCase() }))} value={formData.subject} onChange={(val) => setFormData({...formData, subject: val.toString()})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <AnimatedInput label="Duration_m" placeholder="30" type="number" value={formData.durationMinutes.toString()} onChange={(val) => setFormData({...formData, durationMinutes: parseInt(val as string) || 0})} />
               <AnimatedInput label="Capacity_q" placeholder="25" type="number" value={formData.totalQuestions.toString()} onChange={(val) => setFormData({...formData, totalQuestions: parseInt(val as string) || 0})} />
               <AnimatedInput label="Unit Marks" placeholder="1.0" type="number" value={formData.marksPerQuestion.toString()} onChange={(val) => setFormData({...formData, marksPerQuestion: parseFloat(val as string) || 1.0})} />
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#141414] rounded border border-[#3A3A3A]">
              <input type="checkbox" checked={formData.negativeMarking} onChange={(e) => setFormData({...formData, negativeMarking: e.target.checked})} className="w-4 h-4 accent-[#D97706]" />
              <span className="text-xs font-mono font-bold text-[#E8E8E8] uppercase tracking-widest">Enable Penalty Protocol</span>
              {formData.negativeMarking && (
                <div className="ml-auto w-32 scale-90 origin-right">
                  <AnimatedInput label="Penalty Scalar" placeholder="0.25" type="number" value={formData.penaltyPerWrong.toString()} onChange={(val) => setFormData({...formData, penaltyPerWrong: parseFloat(val as string) || 0.25})} />
                </div>
              )}
            </div>

            <button type="submit" className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors">
              {editingExam ? "Commit Configuration Changes" : "Initialize Examination Record"}
            </button>
          </form>
        </Modal>

        {/* Assign Questions Modal */}
        <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Map Corpus Questions">
          <div className="space-y-6 pt-4">
            <div className="flex gap-4 items-center">
               <input type="text" placeholder="Filter questions by reference..." value={assignSearch} onChange={(e) => setAssignSearch(e.target.value)} className="flex-1 bg-[#141414] border border-[#3A3A3A] rounded px-4 py-2.5 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors" />
               <div className="px-4 py-2 bg-[#D97706]/10 border border-[#D97706]/30 text-[#D97706] rounded font-mono text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{selectedQuestionIds.length} MAP_SIGS</div>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {filteredQuestions.map(q => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div key={q.id} onClick={() => toggleQuestion(q.id)} className={`p-4 rounded border transition-all cursor-pointer group ${isSelected ? "bg-[#D97706]/5 border-[#D97706]/40" : "bg-[#1E1E1E] border-[#3A3A3A] hover:border-[#666666]"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? "bg-[#D97706] border-[#D97706] text-white" : "bg-[#141414] border-[#3A3A3A]"}`}>
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

            <button onClick={handleAssignSubmit} className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors flex items-center justify-center gap-2">
               <span>Commit Mapping Signatures</span>
            </button>
          </div>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
