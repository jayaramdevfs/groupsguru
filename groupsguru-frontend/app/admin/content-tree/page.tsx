"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { categoryApi } from "@/lib/categories";
import { subCategoryApi } from "@/lib/subcategories";
import { sectionApi } from "@/lib/sections";
import { topicApi } from "@/lib/topics";
import { Category, SubCategory, Section, Topic } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import AnimatedInput from "@/components/ui/AnimatedInput";

export default function ContentTreePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: "CATEGORY" | "SUBCATEGORY" | "SECTION" | "TOPIC";
    mode: "CREATE" | "EDIT";
    parentId?: number;
    entityId?: number;
    data: any;
  }>({ type: "CATEGORY", mode: "CREATE", data: {} });

  const fetchRoot = useCallback(async () => {
    setIsLoading(true);
    try {
      const cats = await categoryApi.adminGetAll();
      setCategories(cats);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoot();
  }, [fetchRoot]);

  // Handle Form Change
  const handleInputChange = (field: string, val: string | number) => {
    setModalConfig((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: val }
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalConfig.type === "CATEGORY") {
        if (modalConfig.mode === "CREATE") await categoryApi.create(modalConfig.data);
        else await categoryApi.update(modalConfig.entityId!, modalConfig.data);
      } else if (modalConfig.type === "SUBCATEGORY") {
        if (modalConfig.mode === "CREATE") await subCategoryApi.create({ ...modalConfig.data, categoryId: modalConfig.parentId! });
        else await subCategoryApi.update(modalConfig.entityId!, { ...modalConfig.data, categoryId: modalConfig.parentId! });
      } else if (modalConfig.type === "SECTION") {
        if (modalConfig.mode === "CREATE") await sectionApi.create({ ...modalConfig.data, subCategoryId: modalConfig.parentId! });
        else await sectionApi.update(modalConfig.entityId!, { ...modalConfig.data, subCategoryId: modalConfig.parentId! });
      } else if (modalConfig.type === "TOPIC") {
        if (modalConfig.mode === "CREATE") await topicApi.create({ ...modalConfig.data, sectionId: modalConfig.parentId! });
        else await topicApi.update(modalConfig.entityId!, { ...modalConfig.data, sectionId: modalConfig.parentId! });
      }
      setModalOpen(false);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm("Permanently remove this node? This will cascade and delete all nested descendants.")) return;
    try {
      if (type === "CATEGORY") await categoryApi.delete(id);
      if (type === "SUBCATEGORY") await subCategoryApi.delete(id);
      if (type === "SECTION") await sectionApi.delete(id);
      if (type === "TOPIC") await topicApi.delete(id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTogglePublish = async (type: string, id: number) => {
    try {
      if (type === "CATEGORY") await categoryApi.togglePublish(id);
      if (type === "SUBCATEGORY") await subCategoryApi.togglePublish(id);
      if (type === "SECTION") await sectionApi.togglePublish(id);
      if (type === "TOPIC") await topicApi.togglePublish(id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReorder = async (type: string, items: any[], currentIndex: number, direction: 'UP' | 'DOWN') => {
    if (direction === 'UP' && currentIndex === 0) return;
    if (direction === 'DOWN' && currentIndex === items.length - 1) return;

    const swapIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    const currentItem = items[currentIndex];
    const targetItem = items[swapIndex];

    const updates = [
      { id: currentItem.id, displayOrder: targetItem.displayOrder || swapIndex },
      { id: targetItem.id, displayOrder: currentItem.displayOrder || currentIndex }
    ];

    try {
      if (type === "CATEGORY") await categoryApi.reorder(updates);
      if (type === "SUBCATEGORY") await subCategoryApi.reorder(updates);
      if (type === "SECTION") await sectionApi.reorder(updates);
      if (type === "TOPIC") await topicApi.reorder(updates);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const ActionButtons = ({ type, item, items, index, isExpandedConfig }: { type: string, item: any, items: any[], index: number, isExpandedConfig?: any }) => (
    <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity ml-4 scale-90 origin-left">
      <button 
        className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#666666] hover:text-[#D97706] border border-[#3A3A3A] px-2 py-0.5 rounded transition-colors" 
        onClick={(e) => { 
          e.stopPropagation(); 
          setModalConfig({ 
            type: type as any, 
            mode: "EDIT", 
            entityId: item.id,
            parentId: item.categoryId || item.subCategoryId || item.sectionId,
            data: { ...item } 
          }); 
          setModalOpen(true); 
        }}
      >
        MOD
      </button>
      <button 
        className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#C74444] border border-[#C74444]/30 px-2 py-0.5 rounded hover:bg-[#C74444]/10 transition-colors" 
        onClick={(e) => { e.stopPropagation(); handleDelete(type, item.id!); }}
      >
        DEL
      </button>
      
      <div className="w-[1px] h-3 bg-[#3A3A3A] mx-1"></div>
      
      <button 
        className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded transition-colors ${item.isPublished ? 'text-[#10B981] border border-[#10B981]/30 bg-[#10B981]/5' : 'text-[#666666] border border-[#3A3A3A]'}`} 
        onClick={(e) => { e.stopPropagation(); handleTogglePublish(type, item.id!); }}
      >
        {item.isPublished ? 'PUB' : 'HID'}
      </button>

      <div className="w-[1px] h-3 bg-[#3A3A3A] mx-1"></div>
      
      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${item.accessType === 'PAID' ? 'text-[#D97706] border border-[#D97706]/30 bg-[#D97706]/5' : 'text-[#10B981] border border-[#10B981]/30 bg-[#10B981]/5'}`}>
        {item.accessType === 'PAID' ? `₹${item.priceInr}` : 'FREE'}
      </span>
      
      <div className="flex gap-1 ml-1">
        <button 
          className="text-[10px] text-[#666666] hover:text-[#D97706] disabled:opacity-0 transition-colors" 
          disabled={index === 0}
          onClick={(e) => { e.stopPropagation(); handleReorder(type, items, index, 'UP'); }}
        >▲</button>
        <button 
          className="text-[10px] text-[#666666] hover:text-[#D97706] disabled:opacity-0 transition-colors" 
          disabled={index === items.length - 1}
          onClick={(e) => { e.stopPropagation(); handleReorder(type, items, index, 'DOWN'); }}
        >▼</button>
      </div>
      
      {isExpandedConfig && (
        <button 
          className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#D97706] border border-[#D97706]/30 px-2 py-0.5 rounded hover:bg-[#D97706]/10 transition-colors ml-2" 
          onClick={(e) => { e.stopPropagation(); setModalConfig(isExpandedConfig); setModalOpen(true); }}
        >
          {isExpandedConfig.btnText.split(' ').slice(1).join(' ')}++
        </button>
      )}
    </div>
  );

  const MicroTopicNode = ({ mt }: { mt: any; }) => {
    return (
      <div className="flex items-center gap-2 py-2 border-l border-[#3A3A3A] pl-6 ml-4 relative group">
        <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-[#3A3A3A]" />
        <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">L5_MICRO</span>
        <span className="text-sm font-medium text-[#A0A0A0]">{mt.name}</span>
      </div>
    );
  };

  const TopicNode = ({ topic, items, index, parentId }: { topic: Topic; items: Topic[]; index: number; parentId: number }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<any[]>([]);
    const load = async () => { setExpanded(!expanded); };

    return (
      <div className="border-l border-[#3A3A3A] pl-6 ml-4 relative group">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-[#3A3A3A]" />
        <div className="flex items-center gap-2 py-2 cursor-pointer" onClick={load}>
          <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">L4_SUBJECT</span>
          <span className={`text-sm font-medium transition-colors ${expanded ? 'text-[#D97706]' : (topic.isPublished !== false ? 'text-[#E8E8E8]' : 'text-[#666666] italic')}`}>
            {topic.name}
          </span>
          <ActionButtons type="TOPIC" item={topic} items={items} index={index} />
          <a href="/admin/intelligence" onClick={(e) => e.stopPropagation()} className="ml-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#D97706] hover:underline">
            Manage Micro-Nodes →
          </a>
        </div>
      </div>
    );
  };

  const SectionNode = ({ section, items, index, parentId }: { section: Section; items: Section[]; index: number; parentId: number }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<Topic[]>([]);
    const load = async () => {
      if (!expanded && children.length === 0) {
        const allAdminTopics = await topicApi.adminGetAll();
        setChildren(allAdminTopics.filter(t => t.sectionId === section.id));
      }
      setExpanded(!expanded);
    };

    return (
      <div className="border-l border-[#3A3A3A] pl-6 ml-4 relative group">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-[#3A3A3A]" />
        <div className="flex items-center gap-2 py-2 cursor-pointer" onClick={load}>
          <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-widest">L3_PHASE</span>
          <span className={`font-bold transition-colors ${expanded ? 'text-[#D97706]' : 'text-[#E8E8E8]'} ${section.isPublished === false ? 'opacity-50' : ''}`}>
             {section.name} <span className="text-[10px] font-mono font-bold text-[#666666] ml-2 tracking-widest">[{children.length > 0 ? children.length : '...'}_SUBJ]</span>
          </span>
          <ActionButtons 
            type="SECTION" item={section} items={items} index={index} 
            isExpandedConfig={{ type: "TOPIC", mode: "CREATE", parentId: section.id, data: { name: "", nameTe: "", description: "", topicCode: "", accessType: "FREE", priceInr: 0, displayOrder: children.length, isPublished: true }, btnText: "+ Add Subject" }} 
          />
        </div>
        {expanded && (
          <div className="flex flex-col">
            {children.map((c, i) => <TopicNode key={c.id} topic={c} items={children} index={i} parentId={section.id!} />)}
          </div>
        )}
      </div>
    );
  };

  const SubCategoryNode = ({ sub, items, index, parentId }: { sub: SubCategory; items: SubCategory[]; index: number; parentId: number }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<Section[]>([]);
    const load = async () => {
      if (!expanded && children.length === 0) {
        const allAdminSections = await sectionApi.adminGetAll();
        setChildren(allAdminSections.filter(s => s.subCategoryId === sub.id));
      }
      setExpanded(!expanded);
    };

    return (
      <div className="border-l border-[#3A3A3A] pl-6 ml-4 relative group">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-[#3A3A3A]" />
        <div className="flex items-center gap-2 py-2 cursor-pointer" onClick={load}>
          <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-widest">L2_EXAM</span>
          <span className={`font-bold text-lg transition-colors ${expanded ? 'text-[#D97706]' : 'text-[#E8E8E8]'} ${sub.isPublished === false ? 'opacity-50' : ''}`}>
            {sub.name} <span className="text-[10px] font-mono font-bold text-[#666666] ml-2 tracking-widest">[{children.length > 0 ? children.length : '...'}_PHASE]</span>
          </span>
          <ActionButtons 
            type="SUBCATEGORY" item={sub} items={items} index={index} 
            isExpandedConfig={{ type: "SECTION", mode: "CREATE", parentId: sub.id, data: { name: "", nameTe: "", description: "", accessType: "FREE", priceInr: 0, displayOrder: children.length, isPublished: true }, btnText: "+ Add Phase" }}
          />
        </div>
        {expanded && (
          <div className="flex flex-col">
            {children.map((c, i) => <SectionNode key={c.id} section={c} items={children} index={i} parentId={sub.id!} />)}
          </div>
        )}
      </div>
    );
  };

  const CategoryNode = ({ cat, items, index }: { cat: Category; items: Category[]; index: number; }) => {
    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<SubCategory[]>([]);
    const load = async () => {
      if (!expanded && children.length === 0) {
        const allAdminSubs = await subCategoryApi.adminGetAll();
        setChildren(allAdminSubs.filter(s => s.categoryId === cat.id));
      }
      setExpanded(!expanded);
    };

    return (
      <div className={`mb-4 border border-[#3A3A3A] rounded bg-[#1C1C1C] p-4 group transition-colors ${expanded ? 'border-[#D97706]/30' : 'hover:border-[#D97706]/50'}`}>
        <div className="flex items-center gap-4 cursor-pointer" onClick={load}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D97706] uppercase tracking-widest">L1_COMMISSION</span>
            <span className="text-2xl font-serif text-[#E8E8E8] group-hover:text-[#D97706] transition-colors">{cat.name}</span>
          </div>
          <ActionButtons 
            type="CATEGORY" item={cat} items={items} index={index} 
            isExpandedConfig={{ type: "SUBCATEGORY", mode: "CREATE", parentId: cat.id, data: { name: "", nameTe: "", description: "", imageUrl: "", accessType: "FREE", priceInr: 0, displayOrder: children.length, isPublished: true }, btnText: "+ Add Exam" }}
          />
        </div>
        {expanded && (
          <div className="mt-8 border-t border-[#3A3A3A] pt-4">
            {children.map((child, i) => <SubCategoryNode key={child.id} sub={child} items={children} index={i} parentId={cat.id!} />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
            Architectural Overview_v3
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Knowledge <span className="text-[#D97706]">Inventory</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl leading-relaxed text-sm">
            Recursive mapping of the LMS content hierarchy. Control every node from examinations down to atomic syllabus topics.
          </p>
        </header>

        {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Parsing Hierarchy...</span>
           </div>
        ) : (
          <div className="flex flex-col gap-4 pb-20">
            {categories.map((cat, i) => <CategoryNode key={cat.id} cat={cat} items={categories} index={i} />)}
          </div>
        )}

        {/* Modal Logic */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`${modalConfig.mode}_NODE // TYPE: ${modalConfig.type}`}>
          <form onSubmit={handleFormSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput 
                label="Label (English)" type="text" name="name" placeholder="..."
                value={modalConfig.data.name || ""} onChange={(val) => handleInputChange("name", val)} required 
              />
              <AnimatedInput 
                label="Label (Telugu)" type="text" name="nameTe" placeholder="..."
                value={modalConfig.data.nameTe || ""} onChange={(val) => handleInputChange("nameTe", val)} required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Structural Meta</label>
              <textarea 
                className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#A0A0A0] font-mono text-xs focus:outline-none focus:border-[#D97706]/50 transition-colors min-h-[100px] resize-none"
                placeholder="Entry description metadata..."
                value={modalConfig.data.description || ""} onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            {/* Pricing Engine */}
            <div className="bg-[#1C1C1C] border border-[#D97706]/30 p-4 rounded-lg space-y-4">
               <div>
                  <h4 className="text-[#D97706] text-xs font-mono font-bold uppercase tracking-widest mb-1">Monetization Settings</h4>
                  <p className="text-[10px] text-[#A0A0A0]">Lock this node entirely to only paid students via Razorpay.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Access Type</label>
                     <select 
                        className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-3 text-[#E8E8E8] font-mono text-sm focus:outline-none focus:border-[#D97706]/50"
                        value={modalConfig.data.accessType || "FREE"}
                        onChange={(e) => {
                          handleInputChange("accessType", e.target.value);
                          if (e.target.value === "FREE") handleInputChange("priceInr", 0);
                        }}
                     >
                       <option value="FREE">FREE (Unrestricted)</option>
                       <option value="PAID">PAID (Razorpay Paywall)</option>
                     </select>
                  </div>

                  {modalConfig.data.accessType === "PAID" && (
                    <AnimatedInput 
                        label="Price in INR (₹)" type="number" name="priceInr" placeholder="499"
                        value={modalConfig.data.priceInr || 0} onChange={(val) => handleInputChange("priceInr", Number(val))} 
                        required 
                    />
                  )}
               </div>
            </div>

            {modalConfig.type === "CATEGORY" && (
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">Virtual Map Parent</label>
                   <input type="number" disabled className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#666666] font-mono text-sm opacity-50 cursor-not-allowed" value={0} />
                 </div>
                 <AnimatedInput 
                  label="Surface Asset URL" type="text" name="imageUrl" placeholder="https://..."
                  value={modalConfig.data.imageUrl || ""} onChange={(val) => handleInputChange("imageUrl", val)} 
                />
               </div>
            )}

            {modalConfig.type === "TOPIC" && (
              <AnimatedInput 
                label="Atomic Node Code" type="text" name="topicCode" placeholder="MT_REF_00"
                value={modalConfig.data.topicCode || ""} onChange={(val) => handleInputChange("topicCode", val)} 
              />
            )}

            <button type="submit" className="w-full py-4 rounded bg-[#D97706] text-white font-bold text-sm hover:bg-[#F59E0B] transition-colors uppercase tracking-widest">
              Deploy Node Configurations
            </button>
          </form>
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
