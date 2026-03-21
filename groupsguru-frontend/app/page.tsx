"use client";

import React from "react";
import { motion } from "framer-motion";
import { Multilang } from "@/components/ui/Multilang";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import Link from "next/link";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0114] text-white selection:bg-purple-500/30 overflow-x-hidden">

      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter"
        >
          Groups<span className="text-violet-500">Guru</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 md:gap-6"
        >
          <LanguageToggle />
          <div className="w-[1px] h-6 bg-white/10 hidden md:block" />
          <Link href="/login" className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all font-bold text-sm hidden md:block">
            <Multilang en="Log In" te="లాగిన్" />
          </Link>
          <Link href="/login" className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-sm shadow-lg shadow-violet-500/20">
            <Multilang en="Join Now" te="చోరండి" />
          </Link>
        </motion.div>
      </nav>


      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-40 px-6 max-w-7xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ ...spring, delay: 0.1 }}
        >
          <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest mb-6 inline-block">
            <Multilang en="Intelligence Redefined" te="మేధస్సు పునర్నిర్వచించబడింది" />
          </span>
          <h1 className="text-5xl md:text-8xl font-[900] tracking-tighter leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            <Multilang 
              en="Predictive Preparation" 
              te="ముందస్తు ప్రిపరేషన్"
            /><br />
            <span className="text-violet-500">
               <Multilang en="Engine" te="ఇంజిన్" />
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed mb-12">
            <Multilang 
              en="Transforming APPSC Group 1, 2, 3, 4 preparation through official syllabus hierarchy and PYQ behavior analysis." 
              te="అధికారిక సిలబస్ మరియు గత ప్రశ్నల విశ్లేషణ ద్వారా APPSC గ్రూప్ 1, 2, 3, 4 పరీక్షల ప్రిపరేషన్ ను మార్చండి."
            />
          </p>
        </motion.div>

        {/* Intelligence Pool Interactive */}
        <section className="mt-40 relative">
          {/* Decorative Background for Section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-purple-600/5 blur-[120px] rounded-full hover:bg-purple-600/10 transition-all duration-1000" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.2 }}
            className="p-1 rounded-[48px] bg-gradient-to-br from-white/10 via-transparent to-white/5 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-[#12081f]/80 backdrop-blur-3xl"
          >
            <div className="p-10 md:p-16 text-left relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                    <Multilang en="The Architecture Pool" te="ఆర్కిటెక్చర్ పూల్" />
                  </h2>
                  <p className="max-w-xl text-white/50 font-medium text-lg">
                    <Multilang 
                      en="A precision-engineered 5-layer hierarchy that maps every testable concept from official syllabi to atomic preparation units." 
                      te="ప్రతి పరీక్షా భావనను సిలబస్ నుండి అటామిక్ యూనిట్ల వరకు మ్యాప్ చేసే ఖచ్చితమైన 5-లేయర్ సోపానక్రమం."
                    />
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center min-w-[100px]">
                    <span className="text-3xl font-black text-purple-400">98%</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Coverage</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center min-w-[100px]">
                    <span className="text-3xl font-black text-indigo-400">14k+</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Micro-Topics</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                {/* Connecting Logic (Abstract) */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-y-1/2 pointer-events-none" />

                {[
                  { l: "L0", icon: "🎯", name: "Exam", nameTe: "పరీక్ష", desc: "Category level", descTe: "కేటగిరీ స్థాయి" },
                  { l: "L1", icon: "📚", name: "Subject", nameTe: "సబ్జెక్ట్", desc: "Core mastery", descTe: "కోర్ నైపుణ్యం" },
                  { l: "L2", icon: "📑", name: "Section", nameTe: "సెక్షన్", desc: "Logical units", descTe: "లాజికల్ యూనిట్లు" },
                  { l: "L3", icon: "🏷️", name: "Topic", nameTe: "టాపిక్", desc: "Concept focus", descTe: "కాన్సెప్ట్ ఫోకస్" },
                  { l: "L4", icon: "⚛️", name: "Micro-Topic", nameTe: "మైక్రో-టాపిక్", desc: "Atomic testing", descTe: "అటామిక్ టెస్టింగ్" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: 0.1 * idx }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.05)", borderColor: "rgba(168, 85, 247, 0.2)" }}
                    className="relative z-10 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center transition-all group cursor-default"
                  >
                    <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                    <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">
                      {item.l}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      <Multilang en={item.name} te={item.nameTe} />
                    </h3>
                    <p className="text-xs text-white/30 font-semibold leading-relaxed">
                      <Multilang en={item.desc} te={item.descTe} />
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>


        {/* Footer */}
        <footer className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
           <div className="text-sm font-bold">© 2026 GroupsGuru Intelligence Engine</div>
           <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Architecture</a>
              <a href="#" className="hover:text-white transition-colors">Cloud</a>
           </div>
        </footer>
      </main>
    </div>
  );
}