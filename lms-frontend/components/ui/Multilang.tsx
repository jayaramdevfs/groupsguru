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
export const Multilang: React.FC<MultilangProps> = ({ en, te, className }) => {
  const { language } = useLanguage();

  if (language === "en") {
    return <span className={className}>{en || te}</span>;
  }
  
  return <span className={className} style={{ fontFamily: "inherit" }}>{te || en}</span>;
};

/**
 * Helper to wrap content with language specific spans
 */
export const BilingualSpan: React.FC<{ children: React.ReactNode; lang: "en" | "te" }> = ({ children, lang }) => {
  const { language } = useLanguage();
  
  if (language !== lang) return null;
  
  return <span>{children}</span>;
};
