"use client";

import { useRouteGuard } from "../../../lib/routeGuard";
import { motion } from "framer-motion";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

export default function StudentDashboard() {
  useRouteGuard({ requiredRole: "STUDENT" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f051d] via-[#12081f] to-[#0a0114] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={spring}
        className="px-12 py-10 rounded-3xl backdrop-blur-2xl border border-purple-500/30 bg-purple-900/30 shadow-[0_20px_70px_rgba(147,51,234,0.45)]"
      >
        <h1 className="text-[40px] font-extrabold">
          Student Dashboard
        </h1>
      </motion.div>
    </div>
  );
}