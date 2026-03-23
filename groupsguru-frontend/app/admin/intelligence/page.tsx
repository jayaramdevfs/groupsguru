"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { intelligenceApi, PredictionScore, ContentGap, Coverage } from "@/lib/intelligence";
import { registryApi } from "@/lib/registry";
import CustomSelect from "@/components/ui/CustomSelect";
import Modal from "@/components/ui/Modal";

const spring = { type: "spring" as const, stiffness: 420, damping: 24, mass: 0.8 };
const SUBJECTS = ["All Subjects", "History", "Polity", "Economy", "Geography", "Science", "Mental Ability", "AP History", "AP Economy", "Environment", "Ethics", "Administration"];

type Tab = "PREDICTIONS" | "GAPS" | "COVERAGE";

export default function AdminIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("PREDICTIONS");
  const [predictions, setPredictions] = useState<PredictionScore[]>([]);
  const [gaps, setGaps] = useState<ContentGap[]>([]);
  const [coverage, setCoverage] = useState<Coverage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pyqCount, setPyqCount] = useState(0);
  const [mtCount, setMtCount] = useState(0);

  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedPs, setSelectedPs] = useState<PredictionScore | null>(null);

  // Manual Override States
  const [isEditing, setIsEditing] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [predsData, pyqData, mtData, gapsData, coverageData] = await Promise.all([
        intelligenceApi.getPredictions(),
        intelligenceApi.getPyqStats(),
        registryApi.getMicroTopics(0, 1),
        intelligenceApi.getContentGaps(),
        intelligenceApi.getCoverage(),
      ]);
      setPredictions(predsData);
      setPyqCount(pyqData.totalPyqs);
      setMtCount(mtData.totalElements);
      setGaps(gapsData);
      setCoverage(coverageData);
    } catch (error) {
      console.error("Failed to fetch intelligence data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRecalculate = async () => {
    if (!confirm("Are you sure you want to recalculate all prediction scores? This may take some time.")) return;
    setIsLoading(true);
    try {
      await intelligenceApi.recalculateScores();
      await fetchData();
    } catch (e) {
      console.error(e);
      alert("Recalculation failed.");
    }
  };

  const copyGapPrompt = (gap: ContentGap) => {
    const prompt = `CONTEXT:
- Platform: GroupsGuru (APPSC exam prep, bilingual EN/TE)
- Subject: ${gap.subject}
- Micro-Topic: ${gap.microTopicText} (${gap.microTopicId})
- Priority: ${gap.priorityRank}

GENERATE:
1. 10 MCQs for this specific micro-topic.
2. Each MCQ: question + 4 options + correct answer + explanation.
3. All bilingual (English + Telugu).
4. Difficulty based on priority ${gap.priorityRank}.

OUTPUT FORMAT: XML (Moodle format compatible)`;
    
    navigator.clipboard.writeText(prompt);
    alert("AI Prompt copied to clipboard!");
  };

  const handleSaveOverride = async () => {
    if (!selectedPs) return;
    try {
      await Promise.all([
        intelligenceApi.updateNotes(selectedPs.id, notesInput),
        intelligenceApi.updatePriority(selectedPs.id, priorityInput)
      ]);
      setIsEditing(false);
      setSelectedPs(null);
      await fetchData();
      alert("Manual overrides saved successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to save overrides.");
    }
  };

  const exportGapsCSV = () => {
    if (gaps.length === 0) return;
    const headers = ["MicroTopicID", "Subject", "TopicDescription", "PredictionConfidence", "Priority"];
    const rows = gaps.map(g => [
      g.microTopicId,
      g.subject,
      `"${g.microTopicText.replace(/"/g, '""')}"`,
      (g.predictionConfidence * 100).toFixed(0) + "%",
      g.priorityRank
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `GroupsGuru_Priority_Gaps_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityColor = (rank: string) => {
    switch (rank) {
      case "VERY_HIGH": return { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-400" };
      case "HIGH": return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400" };
      case "MEDIUM": return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400" };
      default: return { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400" };
    }
  };

  const filteredPreds = predictions
    .filter(p => selectedSubject === "All Subjects" || p.subject === selectedSubject)
    .sort((a, b) => b.predictionConfidence - a.predictionConfidence);

  const filteredGaps = gaps
    .filter(g => selectedSubject === "All Subjects" || g.subject === selectedSubject);

  const veryHighCount = predictions.filter(p => p.priorityRank === "VERY_HIGH").length;
  const avgConfidence = predictions.length > 0 
    ? (predictions.reduce((acc, p) => acc + p.predictionConfidence, 0) / predictions.length).toFixed(2)
    : "0.00";

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">

        {/* Header */}
        <motion.div
           className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
           initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={spring}
        >
          <div>
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">
              Prediction Engine Active
            </div>
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              Intelligence Dashboard
            </h1>
            <p className="text-[18px] text-white/70 font-[600]">
              PYQ Analysis & Dynamic Prediction Model for Micro-Topics.
            </p>
          </div>

          <div className="flex gap-4">
            <motion.button
               whileHover={{ y: -5, boxShadow: "0px 30px 70px rgba(99, 102, 241, 0.4)" }}
               whileTap={{ scale: 0.95 }}
               onClick={handleRecalculate}
               className="px-8 py-4 h-fit rounded-[16px] bg-gradient-to-r from-indigo-600 to-blue-600 font-[700] text-[16px] shadow-[0_15px_30px_rgba(99,102,241,0.3)] flex items-center gap-2"
            >
               ⟳ Recalculate Scores
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
           {[
            { label: "Total M-Topics", value: mtCount, color: "text-purple-400" },
            { label: "Analyzed PYQs", value: pyqCount, color: "text-indigo-400" },
            { label: "Very High Priority", value: veryHighCount, color: "text-emerald-400" },
            { label: "Avg Confidence", value: avgConfidence, color: "text-blue-400" },
           ].map((s, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.1 }} className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-md">
               <div className={`text-4xl font-black ${s.color} mb-1`}>{s.value}</div>
               <div className="text-white/40 text-xs font-bold uppercase tracking-widest">{s.label}</div>
             </motion.div>
           ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-white/5 border border-white/10 p-1 rounded-2xl w-fit backdrop-blur-xl">
          {[
            { id: "PREDICTIONS", label: "Predictions" },
            { id: "GAPS", label: "Content Gaps" },
            { id: "COVERAGE", label: "Coverage Stats" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters & Actions */}
        {activeTab !== "COVERAGE" && (
          <div className="flex justify-between items-end mb-8">
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl w-full max-w-sm">
               <div className="flex flex-col gap-3">
                 <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Filter by Subject</span>
                 <CustomSelect
                   options={SUBJECTS.map(s => ({value: s, label: s}))}
                   value={selectedSubject}
                   onChange={(val) => setSelectedSubject(val.toString())}
                 />
               </div>
            </div>

            {activeTab === "GAPS" && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={exportGapsCSV}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                📥 Export Priority CSV
              </motion.button>
            )}
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="p-20 text-center text-indigo-400">Loading intelligence data...</div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "PREDICTIONS" && (
                <motion.div key="preds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Micro-Topic ID</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Subject</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Priority</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Confidence</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPreds.length === 0 ? (
                          <tr><td colSpan={5} className="p-20 text-center text-white/40">No predictions found.</td></tr>
                        ) : filteredPreds.map((ps) => {
                          const c = getPriorityColor(ps.priorityRank);
                          return (
                            <tr key={ps.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-5 font-mono text-sm text-indigo-300">{ps.microTopicId}</td>
                              <td className="p-5 text-sm font-semibold">{ps.subject}</td>
                              <td className="p-5">
                                <span className={`px-3 py-1 rounded-md text-xs font-bold ${c.bg} ${c.text} ${c.border} border`}>
                                  {ps.priorityRank.replace("_", " ")}
                                </span>
                              </td>
                              <td className="p-5">
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-sm">{(ps.predictionConfidence * 100).toFixed(0)}%</span>
                                  <div className="w-24 h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${Math.min(100, ps.predictionConfidence * 100)}%` }} />
                                  </div>
                                </div>
                              </td>
                              <td className="p-5 text-right">
                                <button onClick={() => setSelectedPs(ps)} className="px-4 py-2 bg-white/5 rounded-xl hover:bg-indigo-500/20 text-xs font-bold uppercase tracking-widest transition-colors">
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "GAPS" && (
                <motion.div key="gaps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Gap: Micro-Topic</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Subject</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Priority</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40">Confidence</th>
                          <th className="p-5 text-xs font-bold uppercase tracking-widest text-white/40 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGaps.length === 0 ? (
                          <tr><td colSpan={5} className="p-20 text-center text-white/40">No content gaps found for this subject. Good job!</td></tr>
                        ) : filteredGaps.map((gap) => {
                          const c = getPriorityColor(gap.priorityRank);
                          return (
                            <tr key={gap.microTopicId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-5 max-w-sm">
                                <p className="text-sm font-bold text-white mb-1">{gap.microTopicText}</p>
                                <p className="text-xs font-mono text-indigo-400">{gap.microTopicId}</p>
                              </td>
                              <td className="p-5 text-sm font-semibold">{gap.subject}</td>
                              <td className="p-5">
                                <span className={`px-3 py-1 rounded-md text-xs font-bold ${c.bg} ${c.text} ${c.border} border`}>
                                  {gap.priorityRank.replace("_", " ")}
                                </span>
                              </td>
                              <td className="p-5">
                                <span className="font-bold text-sm">{(gap.predictionConfidence * 100).toFixed(0)}%</span>
                              </td>
                              <td className="p-5 text-right">
                                <button
                                  onClick={() => copyGapPrompt(gap)}
                                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                  Copy AI Prompt
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "COVERAGE" && (
                <motion.div key="coverage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {coverage.map((c) => (
                      <div key={c.subject} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{c.subject}</h3>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Syllabus Coverage</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-indigo-400">{c.coveragePercentage.toFixed(0)}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden mb-6 border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${c.coveragePercentage}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Topics</p>
                            <p className="text-lg font-bold">{c.totalTopics}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Covered</p>
                            <p className="text-lg font-bold text-emerald-400">{c.coveredTopics}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Questions</p>
                            <p className="text-lg font-bold text-indigo-400">{c.totalQuestions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Modal */}
        <Modal isOpen={!!selectedPs} onClose={() => { setSelectedPs(null); setIsEditing(false); }} title="Prediction Analysis & Manual Override">
           {selectedPs && (
             <div className="py-2 space-y-6">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">MicroTopic ID</h3>
                      <p className="text-lg font-mono font-bold text-indigo-300">{selectedPs.microTopicId}</p>
                   </div>
                   {!isEditing ? (
                     <button onClick={() => {
                       setIsEditing(true);
                       setNotesInput(selectedPs.notes || "");
                       setPriorityInput(selectedPs.priorityRank);
                     }} className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 underline underline-offset-4">
                       Edit Manually
                     </button>
                   ) : (
                     <div className="flex gap-4">
                        <button onClick={handleSaveOverride} className="text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300">
                          Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="text-xs font-black text-white/40 uppercase tracking-widest hover:text-white/60">
                          Cancel
                        </button>
                     </div>
                   )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Frequency Score</span>
                     <p className="text-xl font-bold mt-1 text-white/90">{selectedPs.frequencyScore}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Depth Score</span>
                     <p className="text-xl font-bold mt-1 text-white/90">{selectedPs.depthScore}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Recurrence Score</span>
                     <p className="text-xl font-bold mt-1 text-white/90">{selectedPs.recurrenceScore}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Trend Momentum</span>
                     <p className="text-xl font-bold mt-1 text-white/90">{selectedPs.trendMomentum}</p>
                   </div>
                </div>

                {!isEditing ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-indigo-300/80 text-[10px] font-black uppercase tracking-widest">Calculated Confidence</span>
                        <p className="text-4xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                          {(selectedPs.predictionConfidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-indigo-300/80 text-[10px] font-black uppercase tracking-widest">Rank</span>
                        <p className={`text-lg font-black mt-1 ${getPriorityColor(selectedPs.priorityRank).text}`}>
                          {selectedPs.priorityRank.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/15">
                    <div className="flex flex-col gap-2">
                       <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Override Priority</span>
                       <CustomSelect
                         options={[
                           { value: "VERY_HIGH", label: "VERY HIGH" },
                           { value: "HIGH", label: "HIGH" },
                           { value: "MEDIUM", label: "MEDIUM" },
                           { value: "LOW", label: "LOW" },
                         ]}
                         value={priorityInput}
                         onChange={(val) => setPriorityInput(val.toString())}
                       />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                   <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-2">Analysis Notes</span>
                   {!isEditing ? (
                     <div className="p-4 bg-black/30 rounded-2xl border border-white/5 min-h-20">
                        <p className="text-sm font-medium text-white/80 leading-relaxed">
                          {selectedPs.notes || "No notes available for this topic."}
                        </p>
                     </div>
                   ) : (
                     <textarea
                       value={notesInput}
                       onChange={(e) => setNotesInput(e.target.value)}
                       className="w-full bg-[#0a0512] border border-white/10 rounded-2xl p-4 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-indigo-500 min-h-32 transition-colors"
                       placeholder="Enter manual qualitative analysis notes (e.g., 'Increasing current affairs weightage for this year')"
                     />
                   )}
                </div>
             </div>
           )}
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
