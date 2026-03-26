"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { questionsApi } from "@/lib/questions";
import { Question, QuestionRequest } from "@/lib/types";
import CustomSelect from "@/components/ui/CustomSelect";
import QuestionModal from "@/components/admin/QuestionModal";

const SUBJECTS = ["All Subjects", "History", "AP History", "Polity", "Economy", "Geography", "Science", "Mental Ability", "Environment", "Ethics", "Administration"];
const DIFFICULTIES = ["All Difficulties", "easy", "medium", "hard", "very_hard"];
const TYPES = ["All Types", "STATIC", "ANALYTICAL", "STMT", "ELIM", "MATCH", "AR", "CA_STATIC", "GK", "SCHEME"];

export default function AdminQuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Difficulties");
  const [selectedType, setSelectedType] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const subj = selectedSubject === "All Subjects" ? undefined : selectedSubject;
      const diff = selectedDifficulty === "All Difficulties" ? undefined : selectedDifficulty;
      const qtype = selectedType === "All Types" ? undefined : selectedType;
      const search = searchQuery.trim() || undefined;

      const data = await questionsApi.getAll(0, 100, subj, diff, qtype, undefined, search);
      setQuestions(data.content);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubject, selectedDifficulty, selectedType, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setModalMode("CREATE");
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (question: Question) => {
    setModalMode("EDIT");
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Permanently remove this question from corpus?")) {
      try {
        await questionsApi.delete(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = async (data: QuestionRequest) => {
    if (modalMode === "CREATE") {
      await questionsApi.create(data);
    } else if (editingQuestion) {
      await questionsApi.update(editingQuestion.id, data);
    }
    fetchData();
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return { bg: "bg-[#10B981]/10", border: "border-[#10B981]/30", text: "text-[#10B981]" };
      case "medium": return { bg: "bg-transparent", border: "border-[#3A3A3A]", text: "text-[#A0A0A0]" };
      case "hard": return { bg: "bg-[#D97706]/10", border: "border-[#D97706]/30", text: "#D97706" };
      case "very_hard": return { bg: "bg-[#C74444]/10", border: "border-[#C74444]/30", text: "text-[#C74444]" };
      default: return { bg: "bg-transparent", border: "border-[#3A3A3A]", text: "text-[#666666]" };
    }
  };

  const getCognitiveBadge = (level: string) => {
    switch (level) {
      case "L1": return "text-emerald-500";
      case "L4": return "text-[#C74444]";
      default: return "text-[#E8E8E8]";
    }
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1200px] mx-auto py-12 px-6">

        {/* Header Section */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Corpus Archive_v2.0</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Question <span className="text-[#D97706]">Forge</span>
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="bg-[#1C1C1C] border border-[#3A3A3A] px-4 py-2 rounded flex flex-col items-center min-w-[100px]">
              <span className="text-[8px] font-mono font-bold text-[#666666] uppercase tracking-widest">Global_Index</span>
              <span className="text-lg font-mono font-bold text-[#E8E8E8]">{totalElements}</span>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Append Entry
            </button>
          </div>
        </header>

        {/* Global Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="space-y-2">
            <label className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">L1 Subject</label>
            <CustomSelect options={SUBJECTS.map(s => ({ value: s, label: s.toUpperCase() }))} value={selectedSubject} onChange={(val) => setSelectedSubject(val.toString())} />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Complexity</label>
            <CustomSelect options={DIFFICULTIES.map(d => ({ value: d, label: d.replace('_', ' ').toUpperCase() }))} value={selectedDifficulty} onChange={(val) => setSelectedDifficulty(val.toString())} />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Logic_Type</label>
            <CustomSelect options={TYPES.map(t => ({ value: t, label: t.toUpperCase() }))} value={selectedType} onChange={(val) => setSelectedType(val.toString())} />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Search_Regex</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in corpus..."
                className="w-full bg-[#1C1C1C] border border-[#3A3A3A] rounded px-4 py-3 text-xs text-[#E8E8E8] placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#D97706]/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Data Container */}
        <div className="border border-[#3A3A3A] rounded bg-[#1C1C1C] overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Accessing MCQ Archive...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#3A3A3A] bg-[#141414]">
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Entry_ID</th>
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Domain</th>
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest text-center">Protocol</th>
                    <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {questions.map((q) => {
                    const style = getDifficultyBadge(q.difficulty);
                    const isExpanded = expandedId === q.id;

                    return (
                      <>
                        <tr
                          key={q.id}
                          className={`border-b border-[#3A3A3A] transition-colors group ${isExpanded ? "bg-[#1E1E1E]" : "hover:bg-[#1E1E1E]/50"}`}
                          onClick={() => setExpandedId(isExpanded ? null : q.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="p-4 font-mono font-bold text-[#D97706]">{q.questionCode}</td>
                          <td className="p-4">
                            <div className="text-[#E8E8E8] font-bold">{q.subject}</div>
                            <div className="text-[10px] text-[#666666] font-mono mt-0.5">Node: {q.microTopicId}</div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border} text-[9px] font-mono font-bold uppercase`}>
                                {q.difficulty.toUpperCase()}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest">
                                Type: {q.questionType}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(q); }}
                                className="p-1.5 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:bg-[#2D2D2D] transition-colors"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                                className="p-1.5 rounded border border-[#C74444]/30 text-[#C74444] hover:bg-[#C74444]/10 transition-colors"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-[#141414]">
                            <td colSpan={4} className="p-8 border-b border-[#3A3A3A]">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                  <div>
                                    <div className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] mb-4">Textual Data (EN)</div>
                                    <p className="text-sm font-bold text-[#E8E8E8] leading-relaxed mb-6">{q.questionTextEn}</p>
                                    
                                    <div className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] mb-4">Textual Data (TE)</div>
                                    <p className="text-sm text-[#A0A0A0] leading-relaxed">{q.questionTextTe}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#1C1C1C] border border-[#3A3A3A] p-4 rounded">
                                      <div className="text-[8px] font-mono font-bold text-[#666666] uppercase mb-1">Cog_Layer</div>
                                      <div className={`text-xs font-mono font-bold ${getCognitiveBadge(q.cognitiveLevel)}`}>{q.cognitiveLevel}</div>
                                    </div>
                                    <div className="bg-[#1C1C1C] border border-[#3A3A3A] p-4 rounded">
                                      <div className="text-[8px] font-mono font-bold text-[#666666] uppercase mb-1">M-Node</div>
                                      <div className="text-xs font-mono font-bold text-[#D97706]">{q.microTopicId}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] mb-4">Vector Options</div>
                                  {[
                                    { id: "A", en: q.optionAEn, te: q.optionATe },
                                    { id: "B", en: q.optionBEn, te: q.optionBTe },
                                    { id: "C", en: q.optionCEn, te: q.optionCTe },
                                    { id: "D", en: q.optionDEn, te: q.optionDTe },
                                  ].map((opt) => {
                                    const isCorrect = q.correctOption === opt.id;
                                    return (
                                      <div key={opt.id} className={`p-4 rounded border flex items-start gap-4 transition-colors ${isCorrect ? "bg-[#D97706]/5 border-[#D97706]/40" : "bg-[#1C1C1C] border-[#3A3A3A]"}`}>
                                        <div className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs bg-[#141414] border ${isCorrect ? "border-[#D97706] text-[#D97706]" : "border-[#3A3A3A] text-[#666666]"}`}>
                                          {opt.id}
                                        </div>
                                        <div className="flex-1">
                                          <p className={`text-xs font-bold leading-relaxed mb-1 ${isCorrect ? "text-[#E8E8E8]" : "text-[#A0A0A0]"}`}>{opt.en}</p>
                                          <p className="text-[11px] text-[#666666]">{opt.te}</p>
                                        </div>
                                        {isCorrect && (
                                          <div className="text-[#D97706]">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
              {questions.length === 0 && (
                <div className="p-20 text-center text-[#666666] font-mono text-[10px] uppercase tracking-widest">
                  // Void corpus index
                </div>
              )}
            </div>
          )}
        </div>
        
        <QuestionModal
          isOpen={isModalOpen}
          mode={modalMode}
          initialData={editingQuestion}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </div>
    </ProtectedLayout>
  );
}
