"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { motion } from "framer-motion";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleLanguage}
      className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] flex items-center gap-2 transition-all shadow-lg"
    >
      <span className={language === "en" ? "text-purple-400" : "text-white/40"}>EN</span>
      <div className="w-[1px] h-3 bg-white/10" />
      <span className={language === "te" ? "text-purple-400" : "text-white/40"}>తెలుగు</span>
    </motion.button>

  );
};
