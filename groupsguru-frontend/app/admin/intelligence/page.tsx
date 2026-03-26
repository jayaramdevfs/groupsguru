"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { intelligenceApi, PredictionScore, ContentGap, Coverage } from "@/lib/intelligence";
import { registryApi } from "@/lib/registry";
import CustomSelect from "@/components/ui/CustomSelect";
import Modal from "@/components/ui/Modal";

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
      case "VERY_HIGH": return { bg: "bg-[#D97706]/10", border: "border-[#D97706]/30", text: "text-[#D97706]" };
      case "HIGH": return { bg: "bg-[#D97706]/5", border: "border-[#D97706]/20", text: "text-[#D97706]" };
      case "MEDIUM": return { bg: "bg-[#666666]/10", border: "border-[#3A3A3A]", text: "text-[#666666]" };
      default: return { bg: "bg-transparent", border: "border-[#3A3A3A]", text: "text-[#666666]" };
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
      <div className="max-w-[1000px] mx-auto py-12 px-6">

        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Predictive Analysis Engine</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Intelligence <span className="text-[#D97706]">Dashboard</span>
            </h1>
          </div>

          <button
             onClick={handleRecalculate}
             className="px-6 py-3 rounded border border-[#D97706] text-[#D97706] font-bold text-xs hover:bg-[#D97706] hover:text-white transition-colors flex items-center gap-2"
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
             Sync Model
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
           {[
            { label: "M-Nodes", value: mtCount },
            { label: "PYQ_Dataset", value: pyqCount },
            { label: "V_High_Node", value: veryHighCount },
            { label: "System_Conf", value: `${(parseFloat(avgConfidence)*100).toFixed(0)}%` },
           ].map((s, i) => (
             <div key={i} className="bg-[#1C1C1C] border border-[#3A3A3A] p-5 rounded">
               <div className="text-[#666666] text-[9px] font-mono font-bold uppercase tracking-widest mb-2">{s.label}</div>
               <div className="text-2xl font-mono text-[#E8E8E8]">{s.value}</div>
             </div>
           ))}
        </div>

        {/* Tab Logic Panel */}
        <div className="mb-8 border border-[#3A3A3A] rounded bg-[#1C1C1C] p-1 flex gap-1">
          {[
            { id: "PREDICTIONS", label: "NODE PREDICTIONS" },
            { id: "GAPS", label: "INTEL GAPS" },
            { id: "COVERAGE", label: "COVERAGE SYNC" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 py-3 rounded text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${
                activeTab === tab.id ? "bg-[#D97706] text-white" : "text-[#666666] hover:bg-[#141414] hover:text-[#A0A0A0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Primary View Filters */}
        {activeTab !== "COVERAGE" && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <div className="w-full max-w-xs space-y-2">
               <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Subject domain filter</label>
               <CustomSelect
                 options={SUBJECTS.map(s => ({value: s, label: s.toUpperCase()}))}
                 value={selectedSubject}
                 onChange={(val) => setSelectedSubject(val.toString())}
               />
            </div>

            {activeTab === "GAPS" && (
              <button
                onClick={exportGapsCSV}
                className="px-5 py-2.5 rounded border border-[#3A3A3A] text-[#E8E8E8] font-bold text-[10px] font-mono uppercase tracking-widest hover:bg-[#2D2D2D] transition-colors flex items-center gap-2"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV_DATA
              </button>
            )}
          </div>
        )}

        {/* Main Data Container */}
        <div className="border border-[#3A3A3A] rounded bg-[#1C1C1C] overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Querying Intel Core...</span>
            </div>
          ) : (
            <>
              {activeTab === "PREDICTIONS" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#3A3A3A] bg-[#141414]">
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Node ID</th>
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Subject</th>
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Priority</th>
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Confidence</th>
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest text-right">Ops</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredPreds.length === 0 ? (
                        <tr><td colSpan={5} className="p-20 text-center text-[#666666] font-mono text-[10px] uppercase tracking-widest">Zero predictions in current map.</td></tr>
                      ) : filteredPreds.map((ps) => {
                        const style = getPriorityColor(ps.priorityRank);
                        return (
                          <tr key={ps.id} className="border-b border-[#3A3A3A] hover:bg-[#1E1E1E] transition-colors group">
                            <td className="p-4 font-mono text-xs text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">{ps.microTopicId}</td>
                            <td className="p-4 text-[#A0A0A0] font-bold text-xs">{ps.subject}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border} text-[9px] font-mono font-bold uppercase tracking-widest`}>
                                {ps.priorityRank.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-xs text-[#E8E8E8]">{(ps.predictionConfidence * 100).toFixed(0)}%</span>
                                <div className="hidden sm:block w-20 h-1 bg-[#141414] rounded-full overflow-hidden border border-[#3A3A3A]">
                                  <div className="h-full bg-[#D97706]" style={{ width: `${Math.min(100, ps.predictionConfidence * 100)}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button onClick={() => setSelectedPs(ps)} className="p-1.5 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:bg-[#2D2D2D] transition-colors">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "GAPS" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#3A3A3A] bg-[#141414]">
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Null-Node Mapping</th>
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Subject</th>
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Confidence</th>
                        <th className="p-4 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest text-right">Automation</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredGaps.length === 0 ? (
                        <tr><td colSpan={4} className="p-20 text-center text-[#666666] font-mono text-[10px] uppercase tracking-widest">Full content coverage parity achieved.</td></tr>
                      ) : filteredGaps.map((gap) => {
                        const style = getPriorityColor(gap.priorityRank);
                        return (
                          <tr key={gap.microTopicId} className="border-b border-[#3A3A3A] hover:bg-[#1E1E1E] transition-colors">
                            <td className="p-4 max-w-sm">
                              <p className="text-xs font-bold text-[#E8E8E8] mb-1 leading-relaxed">{gap.microTopicText}</p>
                              <p className="text-[9px] font-mono font-bold text-[#D97706] tracking-widest uppercase">{gap.microTopicId} // {gap.priorityRank}</p>
                            </td>
                            <td className="p-4 text-[#A0A0A0] font-bold text-xs">{gap.subject}</td>
                            <td className="p-4">
                              <span className="font-mono font-bold text-xs text-[#E8E8E8]">{(gap.predictionConfidence * 100).toFixed(0)}%</span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => copyGapPrompt(gap)}
                                className="px-3 py-1.5 rounded border border-[#D97706]/30 text-[#D97706] text-[9px] font-mono font-bold uppercase tracking-widest transition-colors hover:bg-[#D97706] hover:text-white"
                              >
                                Generate AI_Prompt
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "COVERAGE" && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coverage.map((c) => (
                    <div key={c.subject} className="bg-[#141414] border border-[#3A3A3A] p-6 rounded">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-[#E8E8E8]">{c.subject}</h3>
                          <div className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] mt-1">L1 DOMAIN STATS</div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-mono font-bold text-[#D97706]">{c.coveragePercentage.toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="w-full h-1 bg-[#1C1C1C] rounded-full overflow-hidden mb-8 border border-[#3A3A3A]">
                        <div
                          className="h-full bg-[#D97706] transition-all duration-1000"
                          style={{ width: `${c.coveragePercentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4 border-t border-[#3A3A3A] pt-4">
                        <div className="text-center">
                          <div className="text-[#666666] text-[9px] font-mono font-bold uppercase tracking-widest mb-1">Total L3</div>
                          <div className="text-sm font-mono font-bold text-[#E8E8E8]">{c.totalTopics}</div>
                        </div>
                        <div className="text-center border-x border-[#3A3A3A]">
                          <div className="text-[#666666] text-[9px] font-mono font-bold uppercase tracking-widest mb-1">Map L4</div>
                          <div className="text-sm font-mono font-bold text-emerald-500">{c.coveredTopics}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#666666] text-[9px] font-mono font-bold uppercase tracking-widest mb-1">Corpus Qs</div>
                          <div className="text-sm font-mono font-bold text-[#D97706]">{c.totalQuestions}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Override Modal */}
        <Modal isOpen={!!selectedPs} onClose={() => { setSelectedPs(null); setIsEditing(false); }} title={isEditing ? "System Override Context" : "Node Deep Analysis"}>
           {selectedPs && (
             <div className="space-y-6 pt-4">
                <div className="flex justify-between items-start border-b border-[#3A3A3A] pb-4">
                   <div>
                      <div className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] mb-1">Reference Vector</div>
                      <p className="text-lg font-mono font-bold text-[#D97706]">{selectedPs.microTopicId}</p>
                   </div>
                   {!isEditing ? (
                     <button onClick={() => {
                       setIsEditing(true);
                       setNotesInput(selectedPs.notes || "");
                       setPriorityInput(selectedPs.priorityRank);
                     }} className="px-3 py-1.5 rounded border border-[#3A3A3A] text-[#666666] text-[9px] font-mono font-bold uppercase tracking-widest hover:border-[#D97706] hover:text-[#D97706] transition-colors">
                       Edit Vectors
                     </button>
                   ) : (
                     <div className="flex gap-4">
                        <button onClick={handleSaveOverride} className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400">
                          Apply_Overrides
                        </button>
                        <button onClick={() => setIsEditing(false)} className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest hover:text-[#A0A0A0]">
                          Discard
                        </button>
                     </div>
                   )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {[
                     { label: "FREQ_SCORE", val: selectedPs.frequencyScore },
                     { label: "DEPTH_SCORE", val: selectedPs.depthScore },
                     { label: "REC_SCORE", val: selectedPs.recurrenceScore },
                     { label: "MOMENTUM", val: selectedPs.trendMomentum }
                   ].map((attr, i) => (
                     <div key={i} className="bg-[#141414] border border-[#3A3A3A] p-4 rounded">
                       <div className="text-[#555555] text-[8px] font-mono font-bold uppercase tracking-widest mb-1">{attr.label}</div>
                       <p className="text-sm font-mono font-bold text-[#E8E8E8]">{attr.val}</p>
                     </div>
                   ))}
                </div>

                {!isEditing ? (
                  <div className="p-6 rounded bg-[#D97706] border border-[#D97706] flex justify-between items-center text-white">
                    <div>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] opacity-80">System Prediction Confidence</div>
                      <div className="text-4xl font-mono font-bold">
                        {(selectedPs.predictionConfidence * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] opacity-80">Assigned Rank</div>
                      <div className="text-sm font-mono font-bold uppercase tracking-widest border-t border-white/20 pt-1 mt-1">
                        {selectedPs.priorityRank.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Manual Priority Scalar</label>
                        <CustomSelect
                          options={[
                            { value: "VERY_HIGH", label: "00 // VERY_HIGH" },
                            { value: "HIGH", label: "01 // HIGH" },
                            { value: "MEDIUM", label: "02 // MEDIUM" },
                            { value: "LOW", label: "03 // LOW" },
                          ]}
                          value={priorityInput}
                          onChange={(val) => setPriorityInput(val.toString())}
                        />
                     </div>
                  </div>
                )}

                <div className="space-y-2">
                   <div className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Qualitative Metadata</div>
                   {!isEditing ? (
                     <div className="p-4 bg-[#141414] border border-[#3A3A3A] rounded min-h-[100px]">
                        <p className="text-xs text-[#A0A0A0] leading-relaxed font-mono">
                          {selectedPs.notes || "// No system notes available for this knowledge node."}
                        </p>
                     </div>
                   ) : (
                     <textarea
                       value={notesInput}
                       onChange={(e) => setNotesInput(e.target.value)}
                       className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-xs text-[#E8E8E8] font-mono placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#D97706]/50 min-h-[120px] resize-none"
                       placeholder="Append qualitative signals to this vector..."
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
