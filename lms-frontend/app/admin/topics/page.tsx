"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { topicApi } from "@/lib/topics";
import { sectionApi } from "@/lib/sections";
import { subCategoryApi } from "@/lib/subcategories";
import { categoryApi } from "@/lib/categories";
import { Topic, Section, SubCategory, Category, TopicRequest } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Multilang } from "@/components/ui/Multilang";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function AdminTopicManagement() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // 3-level filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("all");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("all");

  const [formData, setFormData] = useState<TopicRequest>({
    name: "",
    nameTe: "",
    description: "",
    descriptionTe: "",
    topicCode: "",
    sectionId: 0,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tops, secs, subCats, cats] = await Promise.all([
        topicApi.adminGetAll(),
        sectionApi.adminGetAll(),
        subCategoryApi.adminGetAll(),
        categoryApi.getAll(),
      ]);
      setTopics(tops);
      setSections(secs);
      setSubCategories(subCats);
      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Filter chain ---
  const filteredSubCategories = useMemo(() =>
    selectedCategoryId === "all"
      ? subCategories
      : subCategories.filter((s) => s.categoryId.toString() === selectedCategoryId),
    [selectedCategoryId, subCategories]
  );

  const filteredSections = useMemo(() => {
    if (selectedSubCategoryId !== "all") {
      return sections.filter((s) => s.subCategoryId.toString() === selectedSubCategoryId);
    }
    if (selectedCategoryId !== "all") {
      const validIds = filteredSubCategories.map((s) => s.id);
      return sections.filter((s) => validIds.includes(s.subCategoryId));
    }
    return sections;
  }, [selectedSubCategoryId, selectedCategoryId, sections, filteredSubCategories]);

  const filteredTopics = useMemo(() => {
    if (selectedSectionId !== "all") {
      return topics.filter((t) => t.sectionId.toString() === selectedSectionId);
    }
    if (selectedSubCategoryId !== "all") {
      return topics.filter((t) => t.subCategoryId.toString() === selectedSubCategoryId);
    }
    if (selectedCategoryId !== "all") {
      const validSubCatIds = filteredSubCategories.map((s) => s.id);
      return topics.filter((t) => validSubCatIds.includes(t.subCategoryId));
    }
    return topics;
  }, [topics, selectedSectionId, selectedSubCategoryId, selectedCategoryId, filteredSubCategories]);

  // --- Modal handlers ---
  const handleOpenModal = (topic: Topic | null = null) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        name: topic.name,
        nameTe: topic.nameTe,
        description: topic.description || "",
        descriptionTe: topic.descriptionTe || "",
        topicCode: topic.topicCode || "",
        sectionId: topic.sectionId,
      });
    } else {
      setEditingTopic(null);
      setFormData({
        name: "",
        nameTe: "",
        description: "",
        descriptionTe: "",
        topicCode: "",
        sectionId: selectedSectionId !== "all" ? parseInt(selectedSectionId) : 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sectionId === 0) {
      alert("Please select a section");
      return;
    }
    try {
      if (editingTopic) {
        await topicApi.update(editingTopic.id, formData);
      } else {
        await topicApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save topic:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      try {
        await topicApi.delete(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete topic:", error);
      }
    }
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-7xl mx-auto text-white">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">
              Level 3 Management
            </div>
            <h1 className="text-[36px] md:text-[48px] font-[800] leading-tight mb-2">
              <Multilang en="Topic Engine" te="టాపిక్ ఇంజిన్" />
            </h1>
            <p className="text-[18px] text-white/70 font-[600]">
              <Multilang
                en="Forge atomic study topics under each section."
                te="ప్రతి సెక్షన్ కింద అటామిక్ స్టడీ టాపిక్‌లను సృష్టించండి."
              />
            </p>
          </div>

          <motion.button
            whileHover={{ y: -5, boxShadow: "0px 30px 70px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={() => handleOpenModal()}
            className="px-8 py-4 h-fit rounded-[16px] bg-gradient-to-r from-[#10B981] to-[#3B82F6] font-[700] text-[16px] whitespace-nowrap shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <Multilang en="Add Topic" te="టాపిక్ జోడించండి" />
          </motion.button>
        </motion.div>

        {/* 3-Level Filter */}
        <div className="mb-12 space-y-6 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">

          {/* L0 — Exam */}
          <div className="flex flex-col gap-3">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Step 1: Exam (L0)</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedCategoryId("all"); setSelectedSubCategoryId("all"); setSelectedSectionId("all"); }}
                className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedCategoryId === "all" ? "bg-blue-600 border-blue-400 font-bold shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >All Exams</button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategoryId(cat.id.toString()); setSelectedSubCategoryId("all"); setSelectedSectionId("all"); }}
                  className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedCategoryId === cat.id.toString() ? "bg-blue-600 border-blue-400 font-bold shadow-lg shadow-blue-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >{cat.name}</button>
              ))}
            </div>
          </div>

          {/* L1 — Subject */}
          <div className="flex flex-col gap-3">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Step 2: Subject (L1)</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setSelectedSubCategoryId("all"); setSelectedSectionId("all"); }}
                className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedSubCategoryId === "all" ? "bg-purple-600 border-purple-400 font-bold shadow-lg shadow-purple-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >All Subjects</button>
              {filteredSubCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => { setSelectedSubCategoryId(sub.id.toString()); setSelectedSectionId("all"); }}
                  className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedSubCategoryId === sub.id.toString() ? "bg-purple-600 border-purple-400 font-bold shadow-lg shadow-purple-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >{sub.name}</button>
              ))}
            </div>
          </div>

          {/* L2 — Section */}
          <div className="flex flex-col gap-3">
            <span className="text-white/40 font-bold uppercase text-[10px] tracking-widest ml-1">Step 3: Section (L2)</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSectionId("all")}
                className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedSectionId === "all" ? "bg-indigo-600 border-indigo-400 font-bold shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >All Sections</button>
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id.toString())}
                  className={`px-5 py-2.5 rounded-2xl border transition-all text-sm ${selectedSectionId === sec.id.toString() ? "bg-indigo-600 border-indigo-400 font-bold shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                >{sec.name}</button>
              ))}
              {filteredSections.length === 0 && selectedSubCategoryId !== "all" && (
                <span className="text-white/30 text-sm italic py-2">No sections found.</span>
              )}
            </div>
          </div>
        </div>

        {/* Topic List */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-20 text-white/50 bg-white/5 rounded-[32px] border border-white/10 border-dashed">
              <div className="text-4xl mb-4">🧠</div>
              <p className="font-semibold">No topics found.</p>
              <p className="text-sm mt-2 text-white/30">Select a section above and add your first topic.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...spring, delay: index * 0.04 }}
                  className="w-full flex flex-col md:flex-row items-center gap-6 p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] group-hover:bg-emerald-500/10 transition-all" />

                  {/* Icon */}
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center font-black text-lg text-emerald-300">
                    {topic.topicCode || topic.name.charAt(0)}
                  </div>

                  <div className="flex-1 w-full relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] font-black uppercase tracking-widest">
                      <span className="text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">{topic.subCategoryName}</span>
                      <span className="text-white/20">›</span>
                      <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded border border-indigo-400/20">{topic.sectionName}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-1">
                      <Multilang en={topic.name} te={topic.nameTe} />
                    </h3>
                    <p className="text-sm font-medium text-white/40 line-clamp-2 max-w-2xl leading-relaxed">
                      <Multilang en={topic.description || ""} te={topic.descriptionTe || ""} />
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(topic)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-emerald-500/20 text-white border border-white/10 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(topic.id)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/10 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={<Multilang en={editingTopic ? "Update Topic" : "New Topic"} te={editingTopic ? "టాపిక్‌ను నవీకరించండి" : "కొత్త టాపిక్"} />}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">

            {/* Parent Section selector */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Parent Section (L2)</label>
              <CustomSelect
                placeholder="Select a Section"
                options={sections.map((sec) => ({ value: sec.id, label: `${sec.name} (${sec.subCategoryName})` }))}
                value={formData.sectionId}
                onChange={(val) => setFormData({ ...formData, sectionId: parseInt(val.toString()) })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput
                label="Topic Name (EN)"
                type="text"
                name="name"
                placeholder="e.g. Mauryan Empire"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                required
              />
              <AnimatedInput
                label="Topic Name (TE)"
                type="text"
                name="nameTe"
                placeholder="ఉదా: మౌర్య సామ్రాజ్యం"
                value={formData.nameTe}
                onChange={(val) => setFormData({ ...formData, nameTe: val })}
                required
              />
            </div>

            <AnimatedInput
              label="Topic Code (e.g. HIS-ANC-T01)"
              type="text"
              name="topicCode"
              placeholder="Internal reference code"
              value={formData.topicCode || ""}
              onChange={(val) => setFormData({ ...formData, topicCode: val })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Description (EN)</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors min-h-[120px] text-sm"
                  placeholder="Brief overview of this topic..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Description (TE)</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors min-h-[120px] text-sm"
                  placeholder="వివరాలు..."
                  value={formData.descriptionTe}
                  onChange={(e) => setFormData({ ...formData, descriptionTe: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ y: -5, boxShadow: "0px 20px 40px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600 font-black text-lg tracking-tight shadow-xl"
              type="submit"
            >
              <Multilang en={editingTopic ? "Sync Changes" : "Forge Topic"} te={editingTopic ? "నవీకరించండి" : "టాపిక్ సృష్టించండి"} />
            </motion.button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
