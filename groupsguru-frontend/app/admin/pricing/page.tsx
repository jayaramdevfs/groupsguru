"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { commissionApi } from "@/lib/commissions";
import { categoryApi } from "@/lib/categories";
import { subCategoryApi } from "@/lib/subcategories";
import { sectionApi } from "@/lib/sections";
import { topicApi } from "@/lib/topics";
import { pricingApi } from "@/lib/pricing";
import { motion, AnimatePresence } from "framer-motion";
import { Multilang } from "@/components/ui/Multilang";

type NodeType = "COMMISSION" | "CATEGORY" | "SUB_CATEGORY" | "SECTION" | "TOPIC" | "MICRO_TOPIC";

interface PricingNode {
  id: number;
  name: string;
  nameTe: string;
  type: NodeType;
  priceInr: number | null;
  accessType: string;
  isExpanded?: boolean;
  children?: PricingNode[];
  loadingChildren?: boolean;
}

export default function AdminPricingPage() {
  const [nodes, setNodes] = useState<PricingNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      setLoading(true);
      const data = await commissionApi.getAll();
      setNodes(
        data.map((c: any) => ({
          id: c.id,
          name: c.name,
          nameTe: c.nameTe,
          type: "COMMISSION",
          priceInr: c.priceInr,
          accessType: c.accessType,
          isExpanded: false,
        }))
      );
    } catch (e) {
      alert("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async (node: PricingNode): Promise<PricingNode[]> => {
    try {
      if (node.type === "COMMISSION") {
        const data = await categoryApi.getAll();
        return data.filter((c: any) => c.commissionId === node.id).map((c: any) => ({
          id: c.id, name: c.name, nameTe: c.nameTe, type: "CATEGORY",
          priceInr: c.priceInr, accessType: c.accessType, isExpanded: false
        }));
      } else if (node.type === "CATEGORY") {
        const data = await subCategoryApi.getByCategory(node.id);
        return data.map((c: any) => ({
          id: c.id, name: c.name, nameTe: c.nameTe, type: "SUB_CATEGORY",
          priceInr: c.priceInr, accessType: c.accessType, isExpanded: false
        }));
      } else if (node.type === "SUB_CATEGORY") {
        const data = await sectionApi.getBySubCategory(node.id);
        return data.map((c: any) => ({
          id: c.id, name: c.name, nameTe: c.nameTe, type: "SECTION",
          priceInr: c.priceInr, accessType: c.accessType, isExpanded: false
        }));
      } else if (node.type === "SECTION") {
        const data = await topicApi.getBySection(node.id);
        return data.map((c: any) => ({
          id: c.id, name: c.name, nameTe: c.nameTe, type: "TOPIC",
          priceInr: c.priceInr, accessType: c.accessType, isExpanded: false
        }));
      }
      return [];
    } catch (e) {
      alert("Failed to load children for " + node.name);
      return [];
    }
  };

  const traverseAndExpand = async (
    currentNodes: PricingNode[],
    targetType: string,
    targetId: number,
    updateFn: (node: PricingNode) => PricingNode | Promise<PricingNode>
  ): Promise<PricingNode[]> => {
    const updated = [];
    for (const node of currentNodes) {
      if (node.type === targetType && node.id === targetId) {
        updated.push(await updateFn({ ...node }));
      } else if (node.children) {
        updated.push({
          ...node,
          children: await traverseAndExpand(node.children, targetType, targetId, updateFn),
        });
      } else {
        updated.push(node);
      }
    }
    return updated;
  };

  const toggleExpand = async (type: string, id: number) => {
    setNodes(prev => [...prev]); // force re-render trick or better use setNodes properly
    const newNodes = await traverseAndExpand(nodes, type, id, async (node) => {
      if (node.isExpanded) {
        return { ...node, isExpanded: false };
      }
      
      if (!node.children) {
        node.loadingChildren = true;
        // set immediately to show loading spinner
        setNodes((prev) => replaceNode(prev, node, node.type, node.id));
        const children = await fetchChildren(node);
        node.children = children;
        node.loadingChildren = false;
      }
      return { ...node, isExpanded: true };
    });
    setNodes(newNodes);
  };

  const replaceNode = (currentList: PricingNode[], newNode: PricingNode, targetType: string, targetId: number): PricingNode[] => {
    return currentList.map(n => {
      if (n.type === targetType && n.id === targetId) return newNode;
      if (n.children) return { ...n, children: replaceNode(n.children, newNode, targetType, targetId) };
      return n;
    });
  }

  const handlePriceChange = async (type: string, id: number, priceStr: string) => {
    const p = priceStr === "" ? null : Number(priceStr);
    
    // Optimistic update locally
    const updateUiTree = async (current: PricingNode[]) => {
      return await traverseAndExpand(current, type, id, (node) => {
        return { ...node, priceInr: p, accessType: (p && p > 0) ? "PAID" : "FREE" };
      });
    };
    setNodes(await updateUiTree(nodes));

    try {
      await pricingApi.updatePrice(type, id, p);
      alert("Price updated!");
    } catch(e) {
      alert("Failed to update price!");
    }
  };

  const renderTree = (nodeList: PricingNode[], depth: number = 0) => {
    return (
      <div className="flex flex-col gap-2">
        {nodeList.map((node) => (
          <div key={`${node.type}-${node.id}`} className="flex flex-col gap-2 border-l-2 border-white/5 pl-4 ml-2">
            <div className="flex items-center gap-4 bg-white/5 border border-[#57534E]/40 rounded-xl p-4 hover:bg-white/10 transition-colors">
              
              <button onClick={() => toggleExpand(node.type, node.id)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg hover:bg-orange-500/50">
                {node.loadingChildren ? "..." : (node.isExpanded ? "v" : ">")}
              </button>
              
              <div className="flex flex-col flex-1">
                <span className="text-xs text-[#FAFAF9]/40 uppercase font-bold tracking-widest">{node.type}</span>
                <span className="font-bold text-lg"><Multilang en={node.name} te={node.nameTe} /></span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold opacity-60">₹</span>
                <input 
                  type="number" 
                  step="0.01"
                  className="bg-black/40 border border-[#57534E]/40 rounded-lg px-3 py-2 w-28 text-right outline-none focus:border-orange-500"
                  placeholder="FREE"
                  value={node.priceInr || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handlePriceChange(node.type, node.id, val);
                  }}
                />
                <span className={`px-2 py-1 rounded text-xs font-bold ${node.accessType === "PAID" ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"}`}>{node.accessType || "FREE"}</span>
              </div>
            </div>

            {node.isExpanded && node.children && node.children.length > 0 && (
              <div className="mt-2">
                {renderTree(node.children, depth + 1)}
              </div>
            )}
            
            {node.isExpanded && node.children && node.children.length === 0 && (
              <div className="pl-4 text-[#FAFAF9]/30 text-smitalic">No contents</div>
            )}

          </div>
        ))}
      </div>
    );
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-10 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Pricing <span className="text-amber-500">&</span> Access Control</h1>
        <p className="text-[#FAFAF9]/60 mb-8">Set pricing incrementally at any level in the hierarchy. A purchase of an ancestor unlocks all its descendants automatically.</p>
        
        {loading ? (
          <div className="text-[#FAFAF9]/50 animate-pulse">Loading tree...</div>
        ) : (
          renderTree(nodes)
        )}
      </div>
    </ProtectedLayout>
  );
}
