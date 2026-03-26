"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { commissionApi } from "@/lib/commissions";
import { categoryApi } from "@/lib/categories";
import { subCategoryApi } from "@/lib/subcategories";
import { sectionApi } from "@/lib/sections";
import { topicApi } from "@/lib/topics";
import { pricingApi } from "@/lib/pricing";
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
      console.error("Failed to load commissions", e);
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
      console.error("Failed to load children", e);
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
    const newNodes = await traverseAndExpand(nodes, type, id, async (node) => {
      if (node.isExpanded) {
        return { ...node, isExpanded: false };
      }
      
      if (!node.children) {
        node.loadingChildren = true;
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
    } catch(e) {
      console.error("Failed to update price", e);
    }
  };

  const renderTree = (nodeList: PricingNode[], depth: number = 0) => {
    return (
      <div className="flex flex-col gap-3">
        {nodeList.map((node) => (
          <div key={`${node.type}-${node.id}`} className={`flex flex-col gap-3 ${depth > 0 ? "border-l border-[#3A3A3A] pl-6 ml-3" : ""}`}>
            <div className={`flex items-center gap-4 bg-[#1C1C1C] border border-[#3A3A3A] p-4 rounded group transition-all hover:border-[#D97706]/50 ${node.isExpanded ? "border-[#D97706]/30 bg-[#1E1E1E]" : ""}`}>
              
              <button 
                onClick={() => toggleExpand(node.type, node.id)} 
                className={`w-6 h-6 flex items-center justify-center rounded border border-[#3A3A3A] bg-[#141414] text-[#666666] hover:text-[#D97706] hover:border-[#D97706] transition-colors ${node.isExpanded ? "text-[#D97706] border-[#D97706]" : ""}`}
              >
                {node.loadingChildren ? (
                  <span className="w-3 h-3 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className={`transition-transform duration-200 ${node.isExpanded ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </button>
              
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em]">{node.type}</span>
                  <span className="text-[9px] font-mono font-bold text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">#{node.id}</span>
                </div>
                <div className="font-bold text-[#E8E8E8] group-hover:text-white transition-colors">
                  <Multilang en={node.name} te={node.nameTe} />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative group/price">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[#666666]">₹</span>
                  <input 
                    type="number" 
                    step="0.01"
                    className="bg-[#141414] border border-[#3A3A3A] rounded px-6 py-2 w-28 text-right text-sm font-mono text-[#D97706] outline-none focus:border-[#D97706] transition-colors"
                    placeholder="0.00"
                    value={node.priceInr || ""}
                    onChange={(e) => handlePriceChange(node.type, node.id, e.target.value)}
                  />
                </div>
                <div className={`min-w-[60px] text-center px-2 py-1 rounded text-[9px] font-mono font-bold tracking-widest uppercase border ${node.accessType === "PAID" ? "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/30" : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"}`}>
                  {node.accessType || "FREE"}
                </div>
              </div>
            </div>

            {node.isExpanded && node.children && (
              <div className="mt-1">
                {node.children.length > 0 ? (
                  renderTree(node.children, depth + 1)
                ) : (
                  <div className="pl-12 py-2 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em]">
                    // Empty knowledge subset
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[1000px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
            Economic Configuration_04
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Monetization <span className="text-[#D97706]">Logic</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl leading-relaxed text-sm">
            <Multilang 
              en="Define tiered access parameters. Purchases are transitive: acquiring an ancestor node automatically grants recursive access to all descendant subsets." 
              te="ధరలను మరియు యూజర్ యాక్సెస్ నిర్వహించండి. మీరు ఒక కోర్సును కొంటే దాని కింద ఉన్న అన్ని ఉచితంగా వస్తాయి."
            />
          </p>
        </header>
        
        <div className="mb-8 p-4 rounded bg-[#1C1C1C] border border-[#3A3A3A] flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="text-[10px] font-mono font-bold text-[#E8E8E8] uppercase tracking-widest">Protocol: FREE = ₹0.00</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
            <span className="text-[10px] font-mono font-bold text-[#E8E8E8] uppercase tracking-widest">Protocol: PAID = ₹ &gt; 0</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest">Parsing Economic Tree...</span>
          </div>
        ) : (
          <div className="pb-20">
            {renderTree(nodes)}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
