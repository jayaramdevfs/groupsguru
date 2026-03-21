"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

const navCards = [
  {
    title: "Exam Categories",
    description: "Browse APPSC Group 1, 2, 3 & 4 and other competitive exams.",
    href: "/student/categories",
    icon: "📚",
    gradient: "from-purple-500 to-indigo-500",
    shadow: "shadow-purple-500/20",
  },
  {
    title: "My Dashboard",
    description: "Track your progress, scores, and study analytics.",
    href: "#",
    icon: "📊",
    gradient: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/20",
    comingSoon: true,
  },
  {
    title: "Practice Exams",
    description: "Take topic-wise, section-wise, and full-length mock tests.",
    href: "/student/exams",
    icon: "📝",
    gradient: "from-indigo-500 to-blue-500",
    shadow: "shadow-indigo-500/20",
  },
];

export default function StudentDashboard() {
  const { logout } = useAuth();

  return (
    <ProtectedLayout requiredRole="STUDENT">
      <div className="min-h-screen py-10 px-6 md:px-12 w-full max-w-[92%] mx-auto text-white text-center">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className="text-[32px] md:text-[48px] font-[800] leading-tight mb-3 bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-base text-white/70 font-[600] max-w-2xl mx-auto">
            Your intelligent exam preparation journey starts here.
          </p>
        </motion.div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {navCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: index * 0.1 }}
              whileHover={!card.comingSoon ? { y: -10, transition: { duration: 0.2 } } : {}}
            >
              {card.comingSoon ? (
                <div className="group relative block h-full p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden opacity-60 cursor-default">
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-3xl shadow-lg ${card.shadow}`}
                    >
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                    <p className="text-white/60 font-medium leading-relaxed">
                      {card.description}
                    </p>
                    <div className="mt-8">
                      <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white/50 border border-white/10">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={card.href}
                  className="group relative block h-full p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 backdrop-blur-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-transparent to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-500" />
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-3xl shadow-lg ${card.shadow}`}
                    >
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-white/60 font-medium leading-relaxed">
                      {card.description}
                    </p>
                    <div className="mt-8 flex items-center text-purple-400 font-bold group/btn">
                      <span>Explore</span>
                      <svg
                        className="ml-2 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </ProtectedLayout>
  );
}
