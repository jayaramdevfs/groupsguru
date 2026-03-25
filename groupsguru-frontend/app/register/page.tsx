"use client";

import RegisterForm from "../../components/auth/RegisterForm";
import { motion } from "framer-motion";

const spring = {
  
  duration: 0.25, ease: "easeOut" as const,
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        className="relative z-10 w-full max-w-xl min-h-[400px] px-12 py-10 rounded-3xl
                   
                   border border-[#57534E]/40
                   bg-[#292524]
                   shadow-md"
      >
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-[48px] font-extrabold leading-tight">
            Create Account
          </h1>
          <p className="text-[#F97316]/70 text-base font-semibold">
            Start Your Government Exams Journey
          </p>
        </div>

        <RegisterForm />
      </motion.div>
    </div>
  );
}