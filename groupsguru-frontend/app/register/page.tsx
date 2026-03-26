"use client";

import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-[#1C1C1C] border border-[#3A3A3A] rounded p-12 shadow-2xl relative overflow-hidden">
        
        {/* Header Section */}
        <header className="mb-10 text-center">
          <div className="inline-block px-2 py-0.5 rounded border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
            REGISTRATION_V2.0
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E8E8] mb-4">
            Create <span className="text-[#D97706]">Account</span>
          </h1>
          <p className="text-[#666666] font-mono text-[10px] uppercase tracking-widest leading-relaxed">
            Begin the public service examination protocol
          </p>
        </header>

        <RegisterForm />
        
        <div className="mt-8 pt-6 border-t border-[#3A3A3A] text-center">
          <span className="text-[10px] font-mono font-bold text-[#3A3A3A] uppercase tracking-[0.25em]">
            GroupsGuru_Secure_Auth
          </span>
        </div>
      </div>
    </div>
  );
}