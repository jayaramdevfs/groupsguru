"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { Multilang } from "@/components/ui/Multilang";
import { useEffect, useState } from "react";
import { categoryApi } from "@/lib/categories";
import { subCategoryApi } from "@/lib/subcategories";
import { sectionApi } from "@/lib/sections";
import { topicApi } from "@/lib/topics";
import { registryApi } from "@/lib/registry";
import { questionsApi } from "@/lib/questions";

interface DashboardStats {
  categories: number;
  subcategories: number;
  sections: number;
  topics: number;
  microTopics: number;
  questions: number;
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ categories: 0, subcategories: 0, sections: 0, topics: 0, microTopics: 0, questions: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cats, subs, secs, tops, mts, qCount] = await Promise.all([
          categoryApi.getAll(),
          subCategoryApi.getAll(),
          sectionApi.getAll(),
          topicApi.getAll(),
          registryApi.getMicroTopics(0, 1),
          questionsApi.getCount(),
        ]);
        setStats({
          categories: cats.length,
          subcategories: subs.length,
          sections: secs.length,
          topics: tops.length,
          microTopics: mts.totalElements,
          questions: qCount,
        });
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setStatsLoaded(true);
      }
    };
    fetchStats();
  }, []);

  const navCards = [
    {
      title: "Content Inventory",
      titleTe: "కంటెంట్ సోపానక్రమం",
      description: "Manage the architectural hierarchy from examinations down to atomic topics.",
      descriptionTe: "పరీక్షల నుండి టాపిక్‌ల వరకు పూర్తి కంటెంట్‌ను నిర్వహించండి.",
      icon: "🌳",
      href: "/admin/content-tree",
      stat: null,
      statLabel: "Hierarchy",
    },
    {
      title: "Knowledge Atlas",
      titleTe: "ఇంటెలిజెన్స్ ఇంజిన్",
      description: "Precision registry of micro-topics and syllabus coverage intelligence.",
      descriptionTe: "ప్రిడిక్షన్ స్కోర్లు మరియు సిలబస్ కవరేజీని చూడండి.",
      icon: "⚛️",
      href: "/admin/intelligence",
      stat: stats.microTopics,
      statLabel: "Micro-Nodes",
    },
    {
      title: "Question Forge",
      titleTe: "ప్రశ్న బ్యాంక్",
      description: "Bilingual MCQ engineering with difficulty and cognitive metadata.",
      descriptionTe: "ద్విభాషా MCQలను నిర్వహించండి మరియు క్రియేట్ చేయండి.",
      icon: "❓",
      href: "/admin/questions",
      stat: stats.questions,
      statLabel: "MCQ Corpus",
    },
    {
      title: "Access Logic",
      titleTe: "ధర & యాక్సెస్",
      description: "Economic layers and student subscription access parameters.",
      descriptionTe: "ధరలను మరియు యూజర్ యాక్సెస్ నిర్వహించండి.",
      icon: "💰",
      href: "/admin/pricing",
      stat: null,
      statLabel: "Paywall",
    },
  ];

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="max-w-[900px] mx-auto py-12 px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-[#3A3A3A] pb-8">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
            Command Center v3.2
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            System <span className="text-[#D97706]">Dashboard</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl leading-relaxed text-sm">
            <Multilang 
              en="Operational overview of the GroupsGuru LMS core. Control the knowledge tree, intelligence registry, and examination assets." 
              te="మీ విద్యా వ్యవస్థను ఖచ్చితత్వంతో నిర్వహించండి. కవరేజీని ట్రాక్ చేయండి మరియు కంటెంట్‌ను క్యూరేట్ చేయండి."
            />
          </p>
        </header>

        {/* Global Inventory Status */}
        <div className="mb-12">
          <div className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em] mb-4 ml-1">Live Global Analytics</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Exams", value: stats.categories },
              { label: "Subjects", value: stats.subcategories },
              { label: "Sections", value: stats.sections },
              { label: "Topics", value: stats.topics },
              { label: "Micro-Topics", value: stats.microTopics },
              { label: "MCQs", value: stats.questions },
            ].map((s, i) => (
              <div key={i} className="bg-[#1C1C1C] border border-[#3A3A3A] p-5 rounded">
                <div className="text-[#666666] text-[9px] font-mono font-bold uppercase tracking-widest mb-2">{s.label}</div>
                <div className="text-3xl font-mono text-[#E8E8E8] transition-all">
                  {statsLoaded ? s.value : <span className="inline-block w-4 h-4 border-2 border-[#D97706] border-t-transparent rounded-full animate-spin"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Controls Grid */}
        <div className="mb-8 ml-1 text-[10px] font-mono font-bold text-[#666666] uppercase tracking-[0.2em]">Module Gateways</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group bg-[#1E1E1E] border border-[#3A3A3A] p-8 rounded hover:border-[#D97706] transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D97706]/5 group-hover:bg-[#D97706]/10 transition-all"></div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <span className="text-4xl grayscale group-hover:grayscale-0 transition-grayscale">{card.icon}</span>
                {card.statLabel && (
                  <span className="text-[9px] font-mono font-bold text-[#666666] border border-[#3A3A3A] px-2 py-1 rounded bg-[#141414] tracking-widest uppercase">
                    {statsLoaded && card.stat !== null ? `${card.stat} ` : ""}{card.statLabel}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-[#E8E8E8] mb-2 group-hover:text-[#D97706] transition-colors relative z-10">
                <Multilang en={card.title} te={card.titleTe} />
              </h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8 relative z-10">
                <Multilang en={card.description} te={card.descriptionTe} />
              </p>
              
              <div className="flex items-center text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D97706] opacity-60 group-hover:opacity-100 transition-opacity">
                Access System Node 
                <svg className="ml-2 w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* System Health Status */}
        <footer className="mt-20 pt-8 border-t border-[#3A3A3A] flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono text-[#666666] tracking-widest uppercase font-bold">
          <div>CORE_SVC: ACTIVE // BUILD_SIG: CLAUDE_MIRROR_3.2</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              DB: PERSISTENT_REPLICA
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              AUTH: SECURE_PROVIDER
            </div>
          </div>
        </footer>

      </div>
    </ProtectedLayout>
  );
}
