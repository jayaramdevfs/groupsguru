import re

with open(r"c:\GroupsGuru\Lms\groupsguru-frontend\app\admin\content-tree\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# I will write the new page.tsx content
new_content = """"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useEffect, useState, useCallback } from "react";
import { categoryApi } from "@/lib/categories";
import { subCategoryApi } from "@/lib/subcategories";
import { sectionApi } from "@/lib/sections";
import { topicApi } from "@/lib/topics";
import { Category, SubCategory, Section, Topic } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
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
  const handleInputChange = (field: string, val: string) => {
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
    if (!confirm("Are you sure? This may have cascading effects.")) return;
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
    <div className="flex gap-2 items-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2">
      <button 
        className="text-xs text-blue-400 hover:text-blue-300 font-semibold bg-blue-400/10 px-2 py-1 rounded" 
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
        title="Edit"
      >
        Edit
      </button>
      <button 
        className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-400/10 px-2 py-1 rounded" 
        onClick={(e) => { e.stopPropagation(); handleDelete(type, item.id!); }}
        title="Delete"
      >
        Delete
      </button>
      <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
      <button 
        className={`text-xs ${item.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'} px-2 py-1 rounded font-bold hover:opacity-80`} 
        onClick={(e) => { e.stopPropagation(); handleTogglePublish(type, item.id!); }}
        title={item.isPublished ? "Click to Unpublish" : "Click to Publish"}
      >
        {item.isPublished ? '● Published' : '○ Hidden'}
      </button>
      <div className="flex flex-col gap-0.5 ml-1">
        <button 
          className="text-[10px] text-white/50 hover:text-white disabled:opacity-30 leading-none px-1" 
          disabled={index === 0}
          onClick={(e) => { e.stopPropagation(); handleReorder(type, items, index, 'UP'); }}
        >▲</button>
        <button 
          className="text-[10px] text-white/50 hover:text-white disabled:opacity-30 leading-none px-1" 
          disabled={index === items.length - 1}
          onClick={(e) => { e.stopPropagation(); handleReorder(type, items, index, 'DOWN'); }}
        >▼</button>
      </div>
      {isExpandedConfig && (
        <button 
          className="text-xs font-semibold text-green-400 hover:text-green-300 bg-green-400/10 px-2 py-1 rounded ml-2" 
          onClick={(e) => { e.stopPropagation(); setModalConfig(isExpandedConfig); setModalOpen(true); }}
        >
          {isExpandedConfig.btnText}
        </button>
      )}
    </div>
  );

  const TopicNode = ({ topic, items, index, parentId }: { topic: Topic; items: Topic[]; index: number; parentId: number }) => {
    return (
      <div className="flex items-center gap-4 py-2 border-l border-white/10 pl-6 ml-4 relative group">
        <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-white/10" />
        <span className={`font-medium ${topic.isPublished !== false ? 'text-violet-300' : 'text-violet-300/50 line-through'}`}>📄 {topic.name}</span>
        <ActionButtons type="TOPIC" item={topic} items={items} index={index} />
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
      <div className="border-l border-white/10 pl-6 ml-4 relative group">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-white/10" />
        <div className="flex items-center gap-4 py-2 cursor-pointer" onClick={load}>
          <span className={`font-bold ${section.isPublished !== false ? 'text-pink-300' : 'text-pink-300/50 line-through'}`}>{expanded ? "📂" : "📁"} {section.name} <span className="text-xs font-normal text-white/30 ml-2">[{children.length > 0 ? children.length : '...'} topics]</span></span>
          <ActionButtons 
            type="SECTION" item={section} items={items} index={index} 
            isExpandedConfig={{ type: "TOPIC", mode: "CREATE", parentId: section.id, data: { name: "", nameTe: "", description: "", topicCode: "", displayOrder: children.length, isPublished: true }, btnText: "+ Add Topic" }} 
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
      <div className="border-l border-white/10 pl-6 ml-4 relative group">
        <div className="absolute left-0 top-5 w-4 h-[1px] bg-white/10" />
        <div className="flex items-center gap-4 py-2 cursor-pointer" onClick={load}>
          <span className={`font-bold ${sub.isPublished !== false ? 'text-purple-300' : 'text-purple-300/50 line-through'}`}>{expanded ? "📖" : "📘"} {sub.name} <span className="text-xs font-normal text-white/30 ml-2">[{children.length > 0 ? children.length : '...'} sections]</span></span>
          <ActionButtons 
            type="SUBCATEGORY" item={sub} items={items} index={index} 
            isExpandedConfig={{ type: "SECTION", mode: "CREATE", parentId: sub.id, data: { name: "", nameTe: "", description: "", displayOrder: children.length, isPublished: true }, btnText: "+ Add Section" }}
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
      <div className="mb-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 group">
        <div className="flex items-center gap-4 cursor-pointer" onClick={load}>
          <span className={`text-xl font-bold ${cat.isPublished !== false ? 'text-indigo-300' : 'text-indigo-300/50 line-through'}`}>{expanded ? "🏛️" : "🏛️"} {cat.name}</span>
          <ActionButtons 
            type="CATEGORY" item={cat} items={items} index={index} 
            isExpandedConfig={{ type: "SUBCATEGORY", mode: "CREATE", parentId: cat.id, data: { name: "", nameTe: "", description: "", imageUrl: "", displayOrder: children.length, isPublished: true }, btnText: "+ Add Subject" }}
          />
        </div>
        {expanded && (
          <div className="mt-4">
            {children.map((child, i) => <SubCategoryNode key={child.id} sub={child} items={children} index={i} parentId={cat.id!} />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-24 px-6 md:px-12 w-full max-w-5xl mx-auto text-white">
        <motion.div className="mb-10">
          <h1 className="text-[36px] font-[800] leading-tight mb-2">Content Hierarchy Tree</h1>
          <p className="text-white/60 font-semibold">Drill down level by level to manage all contents</p>
        </motion.div>

        {isLoading ? (
           <div className="flex items-center justify-center py-20">
             <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : (
          <div className="flex flex-col gap-2">
            {categories.map((cat, i) => <CategoryNode key={cat.id} cat={cat} items={categories} index={i} />)}
          </div>
        )}

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`${modalConfig.mode} ${modalConfig.type}`}>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <AnimatedInput 
              label="Name (English)" type="text" name="name" placeholder="Enter name"
              value={modalConfig.data.name || ""} onChange={(val) => handleInputChange("name", val)} required 
            />
            <AnimatedInput 
              label="Name (Telugu)" type="text" name="nameTe" placeholder="తెలుగు పేరు"
              value={modalConfig.data.nameTe || ""} onChange={(val) => handleInputChange("nameTe", val)} required 
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/60 ml-1">Description</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500/50 min-h-[100px]"
                placeholder="Description"
                value={modalConfig.data.description || ""} onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            {modalConfig.type === "CATEGORY" && (
               <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-white/60 ml-1">Commission ID</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white" value={modalConfig.data.commissionId || 1} onChange={(e) => handleInputChange("commissionId", e.target.value)} />
               </div>
            )}

            {modalConfig.type === "CATEGORY" && (
              <AnimatedInput 
                label="Image URL" type="text" name="imageUrl" placeholder="Image URL"
                value={modalConfig.data.imageUrl || ""} onChange={(val) => handleInputChange("imageUrl", val)} 
              />
            )}

            {modalConfig.type === "TOPIC" && (
              <AnimatedInput 
                label="Topic Code" type="text" name="topicCode" placeholder="Topic Code"
                value={modalConfig.data.topicCode || ""} onChange={(val) => handleInputChange("topicCode", val)} 
              />
            )}

            <motion.button type="submit" whileHover={{ scale: 1.02 }} className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold">
              Save changes
            </motion.button>
          </form>
        </Modal>
      </div>
    </ProtectedLayout>
  );
}
"""

with open(r"c:\GroupsGuru\Lms\groupsguru-frontend\app\admin\content-tree\page.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("success")
