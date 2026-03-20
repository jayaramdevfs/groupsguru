"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { intelligenceApi, PredictionScore } from "@/lib/intelligence";
import { registryApi } from "@/lib/registry";
import CustomSelect from "@/components/ui/CustomSelect";
import Modal from "@/components/ui/Modal";

const spring = { type: "spring" as const, stiffness: 420, damping: 24, mass: 0.8 };
const SUBJECTS = ["All Subjects", "History", "Polity", "Economy", "Geography", "Science", "Mental Ability", "AP History", "AP Economy", "Environment", "Ethics", "Administration"];

export default function AdminIntelligenceDashboard() {
  const [predictions, setPredictions] = useState<PredictionScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pyqCount, setPyqCount] = useState(0);
  const [mtCount, setMtCount] = useState(0);

  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedPs, setSelectedPs] = useState<PredictionScore | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [predsData, pyqData, mtData] = await Promise.all([
        intelligenceApi.getPredictions(),
        intelligenceApi.getPyqStats(),
        registryApi.getMicroTopics(0, 1),
      ]);
      setPredictions(predsData);
      setPyqCount(pyqData.totalPyqs);
      setMtCount(mtData.totalElements);
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

          <motion.button
             whileHover={{ y: -5, boxShadow: "0px 30px 70px rgba(99, 102, 241, 0.4)" }}
             whileTap={{ scale: 0.95 }}
             onClick={handleRecalculate}
             className="px-8 py-4 h-fit rounded-[16px] bg-gradient-to-r from-indigo-600 to-blue-600 font-[700] text-[16px] shadow-[0_15px_30px_rgba(99,102,241,0.3)] flex items-center gap-2"
          >
             ⟳ Recalculate Scores
          </motion.button>
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

        {/* Filters */}
        <div className="mb-8 p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl max-w-sm">
           <div className="flex flex-col gap-3">
             <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Filter by Subject</span>
             <CustomSelect
               options={SUBJECTS.map(s => ({value: s, label: s}))}
               value={selectedSubject}
               onChange={(val) => setSelectedSubject(val.toString())}
             />
           </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden">
           {isLoading ? (
             <div className="p-20 text-center text-indigo-400">Loading intelligence data...</div>
           ) : filteredPreds.length === 0 ? (
             <div className="p-20 text-center text-white/40">No predictions found.</div>
           ) : (
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
                   <AnimatePresence>
                     {filteredPreds.map((ps, i) => {
                       const c = getPriorityColor(ps.priorityRank);
                       return (
                         <motion.tr key={ps.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
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
                         </motion.tr>
                       );
                     })}
                   </AnimatePresence>
                 </tbody>
               </table>
             </div>
           )}
        </div>

        {/* Modal */}
        <Modal isOpen={!!selectedPs} onClose={() => setSelectedPs(null)} title="Prediction Breakdown">
           {selectedPs && (
             <div className="py-4 space-y-6">
                <div>
                   <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">MicroTopic ID</h3>
                   <p className="text-lg font-mono font-bold text-indigo-300">{selectedPs.microTopicId}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Frequency Score</span>
                     <p className="text-xl font-bold mt-1">{selectedPs.frequencyScore}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Depth Score</span>
                     <p className="text-xl font-bold mt-1">{selectedPs.depthScore}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Recurrence Score</span>
                     <p className="text-xl font-bold mt-1">{selectedPs.recurrenceScore}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Trend Momentum</span>
                     <p className="text-xl font-bold mt-1">{selectedPs.trendMomentum}</p>
                   </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                   <span className="text-indigo-300/80 text-[10px] font-black uppercase tracking-widest">Calculated Confidence</span>
                   <p className="text-4xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                     {(selectedPs.predictionConfidence * 100).toFixed(1)}%
                   </p>
                </div>

                {selectedPs.notes && (
                  <div className="p-4 bg-black/30 rounded-2xl border border-white/5">
                     <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-2">Analysis Notes</span>
                     <p className="text-sm font-medium text-white/80">{selectedPs.notes}</p>
                  </div>
                )}
             </div>
           )}
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
