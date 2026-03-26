"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
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
      <div className="max-w-[900px] mx-auto py-12 px-6">

        {/* Header */}
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Knowledge Graph L3</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Topic <span className="text-[#D97706]">Engine</span>
            </h1>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Topic
          </button>
        </header>

        {/* 3-Level Filter */}
        <div className="mb-12 border border-[#3A3A3A] rounded bg-[#1C1C1C] overflow-hidden">
          <div className="p-4 border-b border-[#3A3A3A] bg-[#141414]">
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Narrow Knowledge Scope
            </span>
          </div>

          <div className="p-6 space-y-6">
            <FilterRow 
              label="01. Exam" 
              options={categories} 
              selectedId={selectedCategoryId} 
              onSelect={(id: string) => { setSelectedCategoryId(id); setSelectedSubCategoryId("all"); setSelectedSectionId("all"); }} 
            />
            <FilterRow 
              label="02. Subject" 
              options={filteredSubCategories} 
              selectedId={selectedSubCategoryId} 
              onSelect={(id: string) => { setSelectedSubCategoryId(id); setSelectedSectionId("all"); }} 
            />
            <FilterRow 
              label="03. Section" 
              options={filteredSections} 
              selectedId={selectedSectionId} 
              onSelect={setSelectedSectionId} 
            />
          </div>
        </div>

        {/* Topic List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-20 text-[#666666] bg-[#1E1E1E] rounded border border-[#3A3A3A] font-mono text-sm uppercase tracking-widest">
              No topics in this scope.
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="group w-full flex flex-col md:flex-row items-center gap-6 p-5 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] hover:border-[#D97706]/30 transition-colors"
              >
                <div className="w-12 h-12 shrink-0 rounded border border-[#3A3A3A] bg-[#141414] flex items-center justify-center font-mono font-bold text-lg text-[#D97706]">
                  {topic.topicCode || topic.name.charAt(0)}
                </div>

                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest">{topic.subCategoryName}</span>
                    <span className="text-[#3A3A3A]">/</span>
                    <span className="text-[9px] font-mono font-bold text-[#D97706] uppercase tracking-widest">{topic.sectionName}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">
                    <Multilang en={topic.name} te={topic.nameTe} />
                  </h3>
                  <p className="text-sm text-[#A0A0A0] line-clamp-1 max-w-xl">
                    <Multilang en={topic.description || ""} te={topic.descriptionTe || ""} />
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenModal(topic)}
                    className="p-2.5 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:bg-[#2D2D2D] hover:border-[#666666] transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className="p-2.5 rounded border border-[#C74444]/30 text-[#C74444] hover:bg-[#C74444]/10 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTopic ? "Update Topic Definition" : "New Atomic Topic"}
        >
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Parent Entity (Section L2)</label>
              <CustomSelect
                placeholder="Select parent section..."
                options={sections.map((sec) => ({ value: sec.id, label: `${sec.name} (${sec.subCategoryName})` }))}
                value={formData.sectionId}
                onChange={(val) => setFormData({ ...formData, sectionId: parseInt(val.toString()) })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput
                label="English Label"
                type="text"
                name="name"
                placeholder="e.g. Fundamental Rights"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                required
              />
              <AnimatedInput
                label="Telugu Label"
                type="text"
                name="nameTe"
                placeholder="..."
                value={formData.nameTe}
                onChange={(val) => setFormData({ ...formData, nameTe: val })}
                required
              />
            </div>

            <AnimatedInput
              label="System Reference Code"
              type="text"
              name="topicCode"
              placeholder="POL-FR-01"
              value={formData.topicCode || ""}
              onChange={(val) => setFormData({ ...formData, topicCode: val })}
            />

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Comprehensive Overview</label>
              <textarea
                className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#E8E8E8] text-sm focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[120px] resize-none"
                placeholder="Detailed description of the topic..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button
              className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors"
              type="submit"
            >
              {editingTopic ? "Update Knowledge Node" : "Initialize Knowledge Node"}
            </button>
          </form>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}

function FilterRow({ label, options, selectedId, onSelect }: any) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-mono font-bold text-[#555555] uppercase tracking-widest block ml-1">{label}</span>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect("all")}
          className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-colors border ${selectedId === "all" ? "bg-[#333333] border-[#666666] text-white" : "bg-[#141414] border-[#3A3A3A] text-[#666666] hover:border-[#444444]"}`}
        >All</button>
        {options.map((opt: any) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id.toString())}
            className={`px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition-colors border ${selectedId === opt.id.toString() ? "bg-[#D97706] border-[#D97706] text-white" : "bg-[#141414] border-[#3A3A3A] text-[#666666] hover:border-[#666666]"}`}
          >{opt.name}</button>
        ))}
      </div>
    </div>
  );
}
