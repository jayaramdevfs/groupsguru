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
      title: "Content Tree",
      titleTe: "కంటెంట్ సోపానక్రమం",
      description: "Manage the full hierarchy from exams to topics in a precision tree view.",
      descriptionTe: "పరీక్షల నుండి టాపిక్‌ల వరకు పూర్తి కంటెంట్‌ను నిర్వహించండి.",
      icon: "🌳",
      href: "/admin/content-tree",
      stat: null,
      statLabel: "Hierarchy",
    },
    {
      title: "Intelligence Engine",
      titleTe: "ఇంటెలిజెన్స్ ఇంజిన్",
      description: "PYQ analysis, prediction scores, and syllabus coverage heatmaps.",
      descriptionTe: "ప్రిడిక్షన్ స్కోర్లు మరియు సిలబస్ కవరేజీని చూడండి.",
      icon: "⚛️",
      href: "/admin/intelligence",
      stat: stats.microTopics,
      statLabel: "Micro-Topics",
    },
    {
      title: "Question Bank",
      titleTe: "ప్రశ్న బ్యాంక్",
      description: "Manage bilingual MCQs, difficulty levels, and cognitive tagging.",
      descriptionTe: "ద్విభాషా MCQలను నిర్వహించండి మరియు క్రియేట్ చేయండి.",
      icon: "❓",
      href: "/admin/questions",
      stat: stats.questions,
      statLabel: "MCQs",
    },
    {
      title: "Pricing & Access",
      titleTe: "ధర & యాక్సెస్",
      description: "Set paywall layers and subscription access for students.",
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
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-widest mb-4">
            Command Center
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Administrative <span className="text-[#D97706]">Dashboard</span>
          </h1>
          <p className="text-[#A0A0A0] max-w-xl leading-relaxed">
            <Multilang 
              en="Manage your educational ecosystem with precision. Track coverage, analyze trends, and curate high-impact content." 
              te="మీ విద్యా వ్యవస్థను ఖచ్చితత్వంతో నిర్వహించండి. కవరేజీని ట్రాక్ చేయండి మరియు కంటెంట్‌ను క్యూరేట్ చేయండి."
            />
          </p>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Exams", value: stats.categories },
            { label: "Subjects", value: stats.subcategories },
            { label: "Sections", value: stats.sections },
            { label: "Topics", value: stats.topics },
            { label: "Intelligence", value: stats.microTopics },
            { label: "MCQs", value: stats.questions },
          ].map((s, i) => (
            <div key={i} className="bg-[#1E1E1E] border border-[#3A3A3A] p-4 rounded-lg">
              <div className="text-[#666666] text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</div>
              <div className="text-2xl font-mono text-[#E8E8E8]">{statsLoaded ? s.value : "—"}</div>
            </div>
          ))}
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group bg-[#1E1E1E] border border-[#3A3A3A] p-6 rounded-lg hover:border-[#D97706]/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{card.icon}</span>
                {card.statLabel && (
                  <span className="text-[10px] font-mono text-[#666666] border border-[#3A3A3A] px-2 py-1 rounded">
                    {statsLoaded && card.stat !== null ? `${card.stat} ` : ""}{card.statLabel}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-[#E8E8E8] mb-2 group-hover:text-[#D97706] transition-colors">
                <Multilang en={card.title} te={card.titleTe} />
              </h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                <Multilang en={card.description} te={card.descriptionTe} />
              </p>
              
              <div className="mt-8 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D97706] opacity-0 group-hover:opacity-100 transition-opacity">
                Configure Module 
                <svg className="ml-2 w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* System Status Footer */}
        <footer className="mt-16 pt-8 border-t border-[#3A3A3A] flex justify-between items-center text-[10px] font-mono text-[#666666]">
          <div>SYSTEM_VERSION: 3.2.5_PROD</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D9A5F]"></span>
            DATABASE_PERSISTENT
          </div>
        </footer>

      </div>
    </ProtectedLayout>
  );
}
