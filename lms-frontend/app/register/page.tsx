"use client";

import RegisterForm from "../../components/auth/RegisterForm";
import { motion } from "framer-motion";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f051d] via-[#12081f] to-[#0a0114] px-6">

      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[400px] bg-purple-700/35 rounded-full blur-3xl" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[400px] bg-purple-700/35 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        className="relative z-10 w-full max-w-xl min-h-[400px] px-12 py-10 rounded-3xl
                   backdrop-blur-2xl
                   border border-purple-500/30
                   bg-gradient-to-br from-purple-900/30 to-black/40
                   shadow-[0_20px_70px_rgba(147,51,234,0.45)]"
      >
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-[48px] font-extrabold leading-tight">
            Create Account
          </h1>
          <p className="text-purple-300/70 text-base font-semibold">
            Start Your Government Exams Journey
          </p>
        </div>

        <RegisterForm />
      </motion.div>
    </div>
  );
}