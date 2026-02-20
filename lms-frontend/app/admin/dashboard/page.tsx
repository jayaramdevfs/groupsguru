"use client";

import ProtectedLayout from "@/components/layout/ProtectedLayout";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <ProtectedLayout requiredRole="ADMIN">
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          className="px-12 py-10 rounded-3xl backdrop-blur-2xl border border-purple-500/30 bg-purple-900/30 shadow-[0_20px_70px_rgba(147,51,234,0.45)]"
        >
          <h1 className="text-[40px] font-extrabold">
            Admin Dashboard
          </h1>
        </motion.div>

        <button
          onClick={() => {
            void logout();
          }}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold"
        >
          Logout
        </button>
      </div>
    </ProtectedLayout>
  );
}
