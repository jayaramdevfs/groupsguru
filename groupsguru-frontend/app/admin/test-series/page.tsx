"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { testSeriesApi } from "@/lib/testSeries";
import { categoryApi } from "@/lib/categories";
import { subCategoryApi } from "@/lib/subcategories";
import { TestSeries, TestSeriesRequest, Category, SubCategory, Exam } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { Multilang } from "@/components/ui/Multilang";

export default function AdminTestSeries() {
  const [seriesList, setSeriesList] = useState<TestSeries[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<TestSeries | null>(null);
  
  const [isExamsModalOpen, setIsExamsModalOpen] = useState(false);
  const [activeSeries, setActiveSeries] = useState<TestSeries | null>(null);
  const [seriesExams, setSeriesExams] = useState<Exam[]>([]);
  
  const [formData, setFormData] = useState<TestSeriesRequest>({
    name: "",
    nameTe: "",
    description: "",
    descriptionTe: "",
    seriesType: "MOCK",
    categoryId: 0,
    subCategoryId: 0,
    accessType: "FREE",
    priceInr: 0,
    isActive: true,
    isPublished: false,
    displayOrder: 0
  });

  const [autoGenData, setAutoGenData] = useState({
    questionsPerExam: 25,
    numExams: 3
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [series, cats, subCats] = await Promise.all([
        testSeriesApi.getAllAdmin(),
        categoryApi.getAll(),
        subCategoryApi.adminGetAll()
      ]);
      setSeriesList(series);
      setCategories(cats);
      setSubCategories(subCats);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (ts: TestSeries | null = null) => {
    if (ts) {
      setEditingSeries(ts);
      setFormData({
        name: ts.name,
        nameTe: ts.nameTe,
        description: ts.description || "",
        descriptionTe: ts.descriptionTe || "",
        seriesType: ts.seriesType,
        categoryId: ts.categoryId || 0,
        subCategoryId: ts.subCategoryId || 0,
        accessType: ts.accessType || "FREE",
        priceInr: ts.priceInr || 0,
        isActive: ts.isActive !== undefined ? ts.isActive : true,
        isPublished: ts.isPublished !== undefined ? ts.isPublished : false,
        displayOrder: ts.displayOrder || 0
      });
    } else {
      setEditingSeries(null);
      setFormData({ 
        name: "", 
        nameTe: "",
        description: "", 
        descriptionTe: "",
        seriesType: "MOCK",
        categoryId: 0,
        subCategoryId: 0,
        accessType: "FREE",
        priceInr: 0,
        isActive: true,
        isPublished: false,
        displayOrder: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSeries) {
        await testSeriesApi.update(editingSeries.id, formData);
      } else {
        await testSeriesApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save series:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this test series?")) {
      try {
        await testSeriesApi.delete(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete series:", error);
      }
    }
  };

  const handleManageExams = async (ts: TestSeries) => {
    setActiveSeries(ts);
    try {
      const exams = await testSeriesApi.getSeriesExams(ts.id);
      setSeriesExams(exams || []);
    } catch (err) {
      console.error(err);
      setSeriesExams([]);
    }
    setIsExamsModalOpen(true);
  };

  const handleAutoGenerate = async () => {
    if (!activeSeries) return;
    try {
      await testSeriesApi.autoGenerate(activeSeries.id, autoGenData.questionsPerExam, autoGenData.numExams);
      alert("Successfully generated exams!");
      // reload exams
      const exams = await testSeriesApi.getSeriesExams(activeSeries.id);
      setSeriesExams(exams || []);
      fetchData(); // updates the count in background
    } catch (err: any) {
      alert("Error generating exams: " + (err.response?.data?.message || err.message));
    }
  };

  // filtered subcategories for form based on category selection
  const formSubCategories = formData.categoryId ? subCategories.filter(s => s.categoryId === formData.categoryId) : subCategories;

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#3A3A3A] pb-8">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#666666] mb-2">Sprint 24</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8]">
              Test <span className="text-[#D97706]">Series</span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors flex items-center gap-2"
          >
            Create Series
          </button>
        </header>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : seriesList.length === 0 ? (
            <div className="text-center py-20 text-[#666666] bg-[#1E1E1E] rounded border border-[#3A3A3A] font-mono text-sm uppercase tracking-widest">
              No test series defined.
            </div>
          ) : (
            seriesList.map((ts) => (
              <div
                key={ts.id}
                className="group w-full flex flex-col md:flex-row items-center justify-between gap-6 p-5 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] hover:border-[#D97706]/30 transition-colors"
              >
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">
                      <Multilang en={ts.name} te={ts.nameTe} />
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#141414] text-[#A0A0A0] border border-[#3A3A3A] text-[9px] font-mono font-bold uppercase">
                      {ts.seriesType}
                    </span>
                    {ts.isPublished && (
                       <span className="inline-block px-2 py-0.5 rounded bg-[#2D4A22] text-[#4ade80] text-[9px] font-mono font-bold uppercase border border-[#4ade80]/20">
                         PUBLISHED
                       </span>
                    )}
                  </div>
                  <p className="text-sm text-[#A0A0A0] line-clamp-1">{ts.description}</p>
                </div>

                <div className="flex items-center gap-4 text-sm font-mono text-[#A0A0A0]">
                  <div className="flex flex-col items-center">
                    <span className="text-[#E8E8E8] font-bold text-lg">{ts.totalExams || 0}</span>
                    <span className="text-[10px] uppercase">Exams</span>
                  </div>
                  <div className="flex flex-col items-center border-l border-[#3A3A3A] pl-4">
                    <span className="text-[#D97706] font-bold text-lg">{ts.accessType === "FREE" ? "FREE" : `₹${ts.priceInr}`}</span>
                    <span className="text-[10px] uppercase">Access</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => handleManageExams(ts)} className="px-3 py-2 rounded border border-[#3A3A3A] text-[11px] font-bold uppercase tracking-wider text-[#E8E8E8] hover:bg-[#2D2D2D] hover:border-[#666666] transition-colors">
                    Exams
                  </button>
                  <button onClick={() => handleOpenModal(ts)} className="p-2 rounded border border-[#3A3A3A] text-[#E8E8E8] hover:bg-[#2D2D2D] hover:border-[#666666] transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(ts.id)} className="p-2 rounded border border-[#C74444]/30 text-[#C74444] hover:bg-[#C74444]/10 transition-colors">
                    Del
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={editingSeries ? "Modify Test Series" : "Create Test Series"}
        >
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput label="Name (En)" type="text" name="name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
              <AnimatedInput label="Name (Te)" type="text" name="nameTe" value={formData.nameTe} onChange={(v) => setFormData({...formData, nameTe: v})} required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Series Type</label>
                  <CustomSelect
                     placeholder="Select Type..."
                     options={[
                         {value: 'MOCK', label: 'Mock Test'},
                         {value: 'PRACTICE', label: 'Practice Mode'},
                         {value: 'TOPIC_DRILL', label: 'Topic Drill'},
                         {value: 'PYQ_BASED', label: 'PYQ Based'}
                     ]}
                     value={formData.seriesType}
                     onChange={(val) => setFormData({...formData, seriesType: val as any})}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Access Type</label>
                  <CustomSelect
                     placeholder="Select Access..."
                     options={[
                         {value: 'FREE', label: 'FREE'},
                         {value: 'PAID', label: 'PAID'}
                     ]}
                     value={formData.accessType}
                     onChange={(val) => setFormData({...formData, accessType: val as string})}
                  />
               </div>
            </div>

            {formData.accessType === "PAID" && (
                <AnimatedInput label="Price (INR)" type="number" name="price" value={formData.priceInr?.toString() || ""} onChange={(v) => setFormData({...formData, priceInr: parseFloat(v)})} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Category (L0)</label>
                  <CustomSelect
                     placeholder="Optional Category..."
                     options={[{value: 0, label: '-- None --'}, ...categories.map(c => ({value: c.id, label: c.name}))]}
                     value={formData.categoryId || 0}
                     onChange={(val) => setFormData({...formData, categoryId: parseInt(val.toString()) || undefined})}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">SubCategory (L1)</label>
                  <CustomSelect
                     placeholder="Optional Subject..."
                     options={[{value: 0, label: '-- None --'}, ...formSubCategories.map(c => ({value: c.id, label: c.name}))]}
                     value={formData.subCategoryId || 0}
                     onChange={(val) => setFormData({...formData, subCategoryId: parseInt(val.toString()) || undefined})}
                  />
               </div>
            </div>

            <label className="flex items-center gap-3 p-3 border border-[#3A3A3A] rounded bg-[#141414] cursor-pointer">
              <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4 accent-[#D97706]" />
              <span className="text-sm text-[#E8E8E8] font-mono">Publish Series</span>
            </label>

            <button type="submit" className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors mt-4">
              {editingSeries ? "Save Series" : "Create Series"}
            </button>
          </form>
        </Modal>

        {/* Manage Exams Modal */}
        <Modal 
          isOpen={isExamsModalOpen} 
          onClose={() => setIsExamsModalOpen(false)}
          title={`Exams: ${activeSeries?.name}`}
        >
          <div className="pt-4 space-y-6">
             <div className="p-4 border border-[#3A3A3A] rounded bg-[#141414]">
                 <h4 className="text-sm font-bold text-[#E8E8E8] mb-4 font-mono">Autogenerate Exams</h4>
                 <div className="flex gap-4 items-end">
                    <div className="flex-1">
                       <label className="text-[10px] font-mono font-bold text-[#666666] uppercase">Questions/Exam</label>
                       <input type="number" className="w-full bg-[#1C1C1C] border border-[#3A3A3A] rounded px-3 py-2 text-white" value={autoGenData.questionsPerExam} onChange={e => setAutoGenData({...autoGenData, questionsPerExam: parseInt(e.target.value)})} />
                    </div>
                    <div className="flex-1">
                       <label className="text-[10px] font-mono font-bold text-[#666666] uppercase">Num Exams</label>
                       <input type="number" className="w-full bg-[#1C1C1C] border border-[#3A3A3A] rounded px-3 py-2 text-white" value={autoGenData.numExams} onChange={e => setAutoGenData({...autoGenData, numExams: parseInt(e.target.value)})} />
                    </div>
                    <button onClick={handleAutoGenerate} className="px-4 py-2 bg-[#D97706] text-white font-bold rounded hover:bg-[#F59E0B]">
                       Generate
                    </button>
                 </div>
             </div>

             <div className="max-h-[300px] overflow-y-auto space-y-2">
                 {seriesExams.length === 0 ? (
                     <p className="text-[#666666] text-center font-mono text-sm py-4">No exams assigned yet.</p>
                 ) : (
                     seriesExams.map((ex, i) => (
                         <div key={ex.id} className="p-3 border border-[#3A3A3A] rounded flex justify-between items-center bg-[#1E1E1E]">
                             <div>
                                <span className="text-[#A0A0A0] text-xs font-mono mr-2">#{i+1}</span>
                                <span className="text-[#E8E8E8] text-sm font-bold">{ex.name}</span>
                             </div>
                             <span className="text-[#A0A0A0] text-xs font-mono">{ex.totalQuestions} Qs</span>
                         </div>
                     ))
                 )}
             </div>
          </div>
        </Modal>

      </div>
    </ProtectedLayout>
  );
}
