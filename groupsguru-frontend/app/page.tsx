"use client";

import React from "react";
import { Multilang } from "@/components/ui/Multilang";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#191919] text-[#E8E8E8]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-8 py-5 max-w-[900px] mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <div className="w-px h-4 bg-[#3A3A3A] hidden md:block" />
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-[8px] border border-[#3A3A3A] hover:border-[#666666] text-[13px] font-medium text-[#A0A0A0] hover:text-[#E8E8E8] transition-colors duration-150 hidden md:block"
          >
            <Multilang en="Log in" te="లాగిన్" />
          </Link>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-[8px] bg-[#D97706] hover:bg-[#F59E0B] text-[14px] font-semibold text-white transition-colors duration-150"
          >
            <Multilang en="Get started" te="ప్రారంభించండి" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-[900px] mx-auto px-6 md:px-8">
        <section className="pt-20 md:pt-32 pb-20">
          <h1
            className="text-[40px] md:text-[56px] leading-[1.1] mb-6 text-[#E8E8E8]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            <Multilang
              en="Predictive preparation for government exams"
              te="ప్రభుత్వ పరీక్షలకు ముందస్తు ప్రిపరేషన్"
            />
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#A0A0A0] max-w-[640px] leading-relaxed mb-10 font-medium">
            <Multilang
              en="GroupsGuru maps APPSC Group 1, 2, 3, 4 syllabi into atomic micro-topics, analyzes PYQ patterns, and predicts what matters most for your preparation."
              te="GroupsGuru APPSC గ్రూప్ 1, 2, 3, 4 సిలబస్‌ను అటామిక్ మైక్రో-టాపిక్‌లుగా మ్యాప్ చేస్తుంది, PYQ నమూనాలను విశ్లేషిస్తుంది."
            />
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-[8px] bg-[#D97706] hover:bg-[#F59E0B] text-[15px] font-semibold text-white transition-colors duration-150"
            >
              <Multilang en="Start preparing" te="ప్రిపరేషన్ మొదలుపెట్టండి" />
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-[8px] border border-[#3A3A3A] hover:border-[#666666] text-[15px] font-medium text-[#A0A0A0] hover:text-[#E8E8E8] transition-colors duration-150"
            >
              <Multilang en="Sign in" te="లాగిన్" />
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#3A3A3A]" />

        {/* Architecture Pool */}
        <section className="py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2
                className="text-[28px] md:text-[36px] text-[#E8E8E8] mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <Multilang en="The architecture" te="ఆర్కిటెక్చర్" />
              </h2>
              <p className="text-[15px] text-[#A0A0A0] max-w-xl font-medium leading-relaxed">
                <Multilang
                  en="A 5-layer hierarchy that maps every testable concept from official syllabi to atomic preparation units."
                  te="ప్రతి పరీక్షా భావనను సిలబస్ నుండి అటామిక్ యూనిట్ల వరకు మ్యాప్ చేసే 5-లేయర్ సోపానక్రమం."
                />
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <span
                  className="text-[24px] font-medium text-[#D97706]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  98%
                </span>
                <div className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider mt-0.5">
                  Coverage
                </div>
              </div>
              <div className="text-center">
                <span
                  className="text-[24px] font-medium text-[#D97706]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  875
                </span>
                <div className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider mt-0.5">
                  Micro-topics
                </div>
              </div>
            </div>
          </div>

          {/* Hierarchy levels */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { l: "L0", name: "Commission", nameTe: "కమిషన్", desc: "APPSC / TSPSC" },
              { l: "L1", name: "Category", nameTe: "కేటగిరీ", desc: "Group 1-4" },
              { l: "L2", name: "Subject", nameTe: "సబ్జెక్ట్", desc: "Prelims / Mains" },
              { l: "L3", name: "Section", nameTe: "సెక్షన్", desc: "History, Polity..." },
              { l: "L4", name: "Micro-Topic", nameTe: "మైక్రో-టాపిక్", desc: "Atomic unit" },
            ].map((item) => (
              <div
                key={item.l}
                className="p-5 rounded-[8px] border border-[#3A3A3A] bg-[#1E1E1E] hover:border-[#666666] transition-colors duration-150"
              >
                <span
                  className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.l}
                </span>
                <h3 className="text-[15px] font-semibold text-[#E8E8E8] mt-2 mb-1">
                  <Multilang en={item.name} te={item.nameTe} />
                </h3>
                <p className="text-[12px] text-[#666666] font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#3A3A3A] py-8 flex items-center justify-between">
          <span className="text-[12px] text-[#666666] font-medium">
            &copy; 2026 GroupsGuru
          </span>
          <div className="flex gap-6 text-[11px] font-medium text-[#666666]">
            <a href="#" className="hover:text-[#A0A0A0] transition-colors duration-150">
              Privacy
            </a>
            <a href="#" className="hover:text-[#A0A0A0] transition-colors duration-150">
              Terms
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
