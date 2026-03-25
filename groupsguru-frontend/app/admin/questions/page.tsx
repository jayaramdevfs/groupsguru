"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { questionsApi } from "@/lib/questions";
import { Question } from "@/lib/types";
import CustomSelect from "@/components/ui/CustomSelect";
import QuestionModal from "@/components/admin/QuestionModal";
import { QuestionRequest } from "@/lib/types";

const spring = {  duration: 0.25, ease: "easeOut" as const };

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
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await questionsApi.delete(id);
        fetchData();
      } catch (error) {
        console.error(error);
        alert("Failed to delete question");
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
      case "easy": return { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-400" };
      case "medium": return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" };
      case "hard": return { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400" };
      case "very_hard": return { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400" };
      default: return { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400" };
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "STATIC": return { bg: "", text: "" };
      case "ANALYTICAL": return { bg: "bg-orange-500/20", text: "text-[#F97316]" };
      case "STMT": return { bg: "bg-[#EA580C]", text: "text-[#F97316]" };
      case "ELIM": return { bg: "bg-[#EA580C]", text: "text-[#F97316]" };
      case "MATCH": return { bg: "bg-teal-500/20", text: "text-teal-400" };
      case "AR": return { bg: "bg-amber-500/20", text: "text-amber-400" };
      default: return { bg: "bg-gray-500/20", text: "text-gray-400" };
    }
  };

  const getCognitiveBadge = (level: string) => {
    switch (level) {
      case "L1": return "text-emerald-400";
      case "L2": return "";
      case "L3": return "text-orange-400";
      case "L4": return "text-red-400";
      default: return "text-[#FAFAF9]/60";
    }
  };

  const diffCounts = {
    easy: questions.filter(q => q.difficulty === "easy").length,
    medium: questions.filter(q => q.difficulty === "medium").length,
    hard: questions.filter(q => q.difficulty === "hard").length,
    very_hard: questions.filter(q => q.difficulty === "very_hard").length,
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-[#FAFAF9]">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={spring}
        >
          <div>
            <div className="px-3 py-1 rounded-full bg-[#EA580C] border border-[#57534E]/40 text-[#F97316] text-[10px] font-bold uppercase tracking-[0.3em] mb-4 inline-block">
              Sprint 9 — Question Bank
            </div>
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              Question Bank
            </h1>
            <p className="text-[18px] text-[#FAFAF9]/70 font-[600]">
              {totalElements} bilingual MCQs parsed from Moodle XML.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="px-6 py-3 rounded-xl bg-[#EA580C] font-bold whitespace-nowrap"
          >
            + Add Question
          </motion.button>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Questions", value: totalElements, color: "text-[#F97316]" },
            { label: "Easy", value: diffCounts.easy, color: "text-emerald-400" },
            { label: "Medium", value: diffCounts.medium, color: "text-yellow-400" },
            { label: "Hard / Very Hard", value: diffCounts.hard + diffCounts.very_hard, color: "text-orange-400" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.08 }} className="bg-white/5 border border-[#57534E]/40 rounded-xl p-6 ">
              <div className={`text-4xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-[#FAFAF9]/40 text-xs font-bold uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          className="mb-8 p-6 rounded-xl bg-white/5 border border-[#57534E]/40 "
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[#FAFAF9]/40 font-bold uppercase text-[10px] tracking-widest ml-1">Subject</span>
              <CustomSelect
                options={SUBJECTS.map(s => ({ value: s, label: s }))}
                value={selectedSubject}
                onChange={(val) => setSelectedSubject(val.toString())}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#FAFAF9]/40 font-bold uppercase text-[10px] tracking-widest ml-1">Difficulty</span>
              <CustomSelect
                options={DIFFICULTIES.map(d => ({ value: d, label: d === "very_hard" ? "Very Hard" : d.charAt(0).toUpperCase() + d.slice(1) }))}
                value={selectedDifficulty}
                onChange={(val) => setSelectedDifficulty(val.toString())}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#FAFAF9]/40 font-bold uppercase text-[10px] tracking-widest ml-1">Type</span>
              <CustomSelect
                options={TYPES.map(t => ({ value: t, label: t.replace("All Types", "All Types") }))}
                value={selectedType}
                onChange={(val) => setSelectedType(val.toString())}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[#FAFAF9]/40 font-bold uppercase text-[10px] tracking-widest ml-1">Search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question text..."
                className="bg-[#1C1917] border border-[#57534E]/40 rounded-2xl px-4 py-3 text-sm text-[#FAFAF9] placeholder:text-[#FAFAF9]/30 focus:border-[#57534E]/40 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Questions Table */}
        <div className="bg-white/[0.02] border border-[#57534E]/40 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-20 text-center text-[#F97316] font-semibold">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="p-20 text-center text-[#FAFAF9]/40 font-semibold">No questions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#57534E]/40 bg-white/5">
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9]/40">Code</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9]/40">Subject</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9]/40">Difficulty</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9]/40">Type</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9]/40">Level</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9]/40">Micro-Topic</th>
                    <th className="p-5 text-xs font-bold uppercase tracking-widest text-[#FAFAF9]/40 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {questions.map((q) => {
                      const dc = getDifficultyBadge(q.difficulty);
                      const tc = getTypeBadge(q.questionType);
                      const isExpanded = expandedId === q.id;

                      return (
                        <motion.tr
                          key={q.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-b border-white/5 transition-colors ${isExpanded ? "bg-white/[0.04]" : "hover:bg-white/5"}`}
                          onClick={() => setExpandedId(isExpanded ? null : q.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="p-5 font-mono text-sm text-[#F97316] font-bold">{q.questionCode}</td>
                          <td className="p-5 text-sm font-semibold">{q.subject}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold ${dc.bg} ${dc.text} ${dc.border} border`}>
                              {q.difficulty === "very_hard" ? "VERY HARD" : q.difficulty.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold ${tc.bg} ${tc.text}`}>
                              {q.questionType}
                            </span>
                          </td>
                          <td className={`p-5 font-bold text-sm ${getCognitiveBadge(q.cognitiveLevel)}`}>{q.cognitiveLevel}</td>
                          <td className="p-5 font-mono text-xs text-[#FAFAF9]/50">{q.microTopicId}</td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(q); }}
                              className="px-3 py-1   rounded-lg  text-xs font-bold transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-xs font-bold transition-colors"
                            >
                              Delete
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : q.id); }}
                              className="px-4 py-1 bg-white/5 rounded-lg hover:bg-[#EA580C] text-xs font-bold tracking-wide transition-colors"
                            >
                              {isExpanded ? "Close" : "View"}
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Expanded Question Detail - rendered separately */}
              {expandedId && (() => {
                const q = questions.find(q => q.id === expandedId);
                if (!q) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-[#57534E]/40 p-8 bg-white/[0.03]"
                  >
                    {/* Question Text */}
                    <div className="mb-6">
                      <span className="text-[#FAFAF9]/40 text-[10px] font-bold uppercase tracking-widest block mb-2">Question (English)</span>
                      <p className="text-[#FAFAF9]/90 text-base font-semibold leading-relaxed">{q.questionTextEn}</p>
                    </div>
                    <div className="mb-8">
                      <span className="text-[#FAFAF9]/40 text-[10px] font-bold uppercase tracking-widest block mb-2">Question (Telugu)</span>
                      <p className="text-[#FAFAF9]/70 text-base font-medium leading-relaxed">{q.questionTextTe}</p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {[
                        { letter: "A", en: q.optionAEn, te: q.optionATe },
                        { letter: "B", en: q.optionBEn, te: q.optionBTe },
                        { letter: "C", en: q.optionCEn, te: q.optionCTe },
                        { letter: "D", en: q.optionDEn, te: q.optionDTe },
                      ].map((opt) => {
                        const isCorrect = q.correctOption === opt.letter;
                        return (
                          <div
                            key={opt.letter}
                            className={`p-4 rounded-2xl border transition-all ${
                              isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : "bg-white/5 border-[#57534E]/40"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                isCorrect ? "bg-emerald-500/30 text-emerald-400" : "bg-white/10 text-[#FAFAF9]/60"
                              }`}>
                                {opt.letter}
                              </span>
                              <div className="flex-1">
                                <p className={`text-sm font-semibold ${isCorrect ? "text-emerald-300" : "text-[#FAFAF9]/90"}`}>{opt.en}</p>
                                <p className="text-xs text-[#FAFAF9]/40 mt-1">{opt.te}</p>
                              </div>
                              {isCorrect && (
                                <span className="text-emerald-400 text-lg">✓</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-[#57534E]/40">
                        <span className="text-[#FAFAF9]/40 text-[10px] font-bold uppercase tracking-widest">Sprint</span>
                        <p className="text-lg font-bold mt-1 text-[#F97316]">{q.sprintId}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-[#57534E]/40">
                        <span className="text-[#FAFAF9]/40 text-[10px] font-bold uppercase tracking-widest">Penalty</span>
                        <p className="text-lg font-bold mt-1">{q.penalty}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-[#57534E]/40">
                        <span className="text-[#FAFAF9]/40 text-[10px] font-bold uppercase tracking-widest">Cognitive</span>
                        <p className={`text-lg font-bold mt-1 ${getCognitiveBadge(q.cognitiveLevel)}`}>{q.cognitiveLevel}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-[#57534E]/40">
                        <span className="text-[#FAFAF9]/40 text-[10px] font-bold uppercase tracking-widest">Micro-Topic</span>
                        <p className="text-sm font-mono font-bold mt-1 text-[#F97316]">{q.microTopicId}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
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
