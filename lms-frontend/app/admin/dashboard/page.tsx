"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
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

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

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
      title: "Exam Categories",
      titleTe: "పరీక్షా విభాగాలు",
      description: "Manage Level 0: Top-level exam categories (UPSC, APPSC, etc.)",
      descriptionTe: "టాప్-లెవల్ పరీక్షా విభాగాలను నిర్వహించండి.",
      icon: "🎯",
      href: "/admin/categories",
      color: "from-indigo-600 to-purple-600",
      shadowColor: "rgba(99, 102, 241, 0.25)",
      stat: stats.categories,
      statLabel: "Exams",
      disabled: false,
    },
    {
      title: "Subject Management",
      titleTe: "సబ్జెక్ట్ నిర్వహణ",
      description: "Manage Level 1: Core subjects and syllabus structures.",
      descriptionTe: "కోర్ సబ్జెక్టులు మరియు సిలబస్ నిర్మాణాలను నిర్వహించండి.",
      icon: "📚",
      href: "/admin/subcategories",
      color: "from-purple-600 to-pink-500",
      shadowColor: "rgba(147, 51, 234, 0.25)",
      stat: stats.subcategories,
      statLabel: "Subjects",
      disabled: false,
    },
    {
      title: "Section Architecture",
      titleTe: "సెక్షన్ ఆర్కిటెక్చర్",
      description: "Manage Level 2: Sub-divide subjects into logical study sections.",
      descriptionTe: "సబ్జెక్టులను లాజికల్ స్టడీ సెక్షన్లుగా విభజించండి.",
      icon: "📑",
      href: "/admin/sections",
      color: "from-indigo-600 to-blue-500",
      shadowColor: "rgba(99, 102, 241, 0.25)",
      stat: stats.sections,
      statLabel: "Sections",
      disabled: false,
    },
    {
      title: "Topic Engine",
      titleTe: "టాపిక్ ఇంజిన్",
      description: "Manage Level 3: Atomic study topics under each section.",
      descriptionTe: "ప్రతి సెక్షన్ కింద అటామిక్ స్టడీ టాపిక్‌లను నిర్వహించండి.",
      icon: "🧠",
      href: "/admin/topics",
      color: "from-emerald-500 to-blue-500",
      shadowColor: "rgba(16, 185, 129, 0.25)",
      stat: stats.topics,
      statLabel: "Topics",
      disabled: false,
    },
    {
      title: "Intelligence Engine",
      titleTe: "ఇంటెలిజెన్స్ ఇంజిన్",
      level: "ENGINE",
      description: "Manage PYQ analysis and AI prediction confidence scores.",
      descriptionTe: "హై ఇంపాక్ట్ ప్రిడిక్షన్ స్కోర్లు",
      icon: "⚛️",
      href: "/admin/intelligence",
      color: "from-purple-600 to-indigo-600",
      shadowColor: "rgba(147, 51, 234, 0.25)",
      stat: stats.microTopics,
      statLabel: "Intelligence",
      disabled: false,
    },
    {
      title: "Question Bank",
      titleTe: "ప్రశ్న బ్యాంక్",
      description: "Manage bilingual MCQs parsed from Moodle XML — filterable by subject, difficulty, type.",
      descriptionTe: "ద్విభాషా MCQలను నిర్వహించండి — సబ్జెక్ట్, కఠినత, రకం ద్వారా ఫిల్టర్ చేయండి.",
      icon: "❓",
      href: "/admin/questions",
      color: "from-violet-600 to-fuchsia-500",
      shadowColor: "rgba(139, 92, 246, 0.25)",
      stat: stats.questions,
      statLabel: "MCQs",
      disabled: false,
    },
  ];

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen py-10 px-6 md:px-12 w-full max-w-[92%] mx-auto flex flex-col items-center gap-8">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="text-center"
        >
          <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4 inline-block">
            Intelligence Command
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
            GroupsGuru<span className="text-purple-500">.</span>
          </h1>
          <p className="mt-2 text-white/40 text-base font-medium">
            <Multilang en="APPSC Exam Intelligence Engine — Admin Console" te="APPSC పరీక్షా ఇంటెలిజెన్స్ ఇంజిన్ — అడ్మిన్ కన్సోల్" />
          </p>
        </motion.div>

        {/* Live Stats Summary Bar */}
        {statsLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="w-full flex flex-wrap justify-center gap-6"
          >
            {[
              { label: "Exams", labelTe: "పరీక్షలు", value: stats.categories, color: "text-indigo-400" },
              { label: "Subjects", labelTe: "సబ్జెక్టులు", value: stats.subcategories, color: "text-purple-400" },
              { label: "Sections", labelTe: "సెక్షన్లు", value: stats.sections, color: "text-pink-400" },
              { label: "Topics", labelTe: "టాపిక్‌లు", value: stats.topics, color: "text-violet-400" },
              { label: "Micro-Topics", labelTe: "మైక్రో-టాపిక్‌లు", value: stats.microTopics, color: "text-purple-400" },
              { label: "Questions", labelTe: "ప్రశ్నలు", value: stats.questions, color: "text-violet-400" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center px-6 py-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                  <Multilang en={s.label} te={s.labelTe} />
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full">
          {navCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: index * 0.08 }}
              whileHover={card.disabled ? {} : { y: -8, scale: 1.02 }}
            >
              <Link
                href={card.href}
                className={`group block p-8 rounded-[32px] border h-full transition-all relative overflow-hidden backdrop-blur-xl
                  ${card.disabled
                    ? "opacity-40 cursor-not-allowed border-white/5 bg-white/5"
                    : "border-white/10 bg-white/[0.03] hover:border-purple-500/40 hover:bg-purple-500/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                  }
                `}
                onClick={card.disabled ? (e) => e.preventDefault() : undefined}
              >
                {/* Gradient Glow */}
                {!card.disabled && (
                  <div
                    className={`absolute -top-20 -right-20 w-52 h-52 bg-gradient-to-br ${card.color} opacity-10 blur-3xl group-hover:opacity-25 transition-all duration-500`}
                  />
                )}

                <div className="relative z-10">
                  {/* Icon + Stat */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-5xl">{card.icon}</div>
                    {/* Live stat badge */}
                    <div className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest border ${card.disabled ? "border-white/10 bg-white/5 text-white/30" : `bg-gradient-to-br ${card.color} bg-opacity-10 border-white/10 text-white`}`}>
                      {card.stat !== null ? (
                        <span>
                          {statsLoaded ? card.stat : "—"} {card.statLabel}
                        </span>
                      ) : (
                        <span>{card.statLabel}</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3">
                    <Multilang en={card.title} te={card.titleTe} />
                  </h3>
                  <p className="text-white/50 font-medium leading-relaxed mb-6 text-sm">
                    <Multilang en={card.description} te={card.descriptionTe} />
                  </p>

                  {!card.disabled && (
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                      <span>Manage</span>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className="group-hover:translate-x-2 transition-transform duration-200"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </ProtectedLayout>
  );
}
