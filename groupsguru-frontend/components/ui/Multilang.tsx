"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";

interface MultilangProps {
  en?: string;
  te?: string;
  className?: string;
}

/**
 * Multilang component to show text based on current language.
 * Usage: <Multilang en="History" te="చరిత్ర" />
 */
export const Multilang: React.FC<MultilangProps> = ({ en, te, className = "" }) => {
  const { language } = useLanguage();

  // If language is Telugu, we often want to override font-serif to font-sans
  // since most sherif fonts don't support Telugu well.
  const isTelugu = language === "te";
  const finalContent = isTelugu ? (te || en) : (en || te);
  
  return (
    <span className={`${className} ${isTelugu ? "font-sans italic-none" : ""}`}>
      {finalContent}
    </span>
  );
};

/**
 * Helper to wrap content with language specific spans
 */
export const BilingualSpan: React.FC<{ children: React.ReactNode; lang: "en" | "te" }> = ({ children, lang }) => {
  const { language } = useLanguage();
  
  if (language !== lang) return null;
  
  return <span>{children}</span>;
};
