"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-full bg-[#1E1E1E] border border-[#3A3A3A] text-[11px] font-semibold flex items-center gap-2 transition-colors duration-150 hover:border-[#666666]"
    >
      <span className={language === "en" ? "text-[#D97706]" : "text-[#666666]"}>
        EN
      </span>
      <div className="w-px h-3 bg-[#3A3A3A]" />
      <span className={language === "te" ? "text-[#D97706]" : "text-[#666666]"}>
        తెలుగు
      </span>
    </button>
  );
};
