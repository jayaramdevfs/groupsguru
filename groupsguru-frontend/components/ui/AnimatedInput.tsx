"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 24,
  mass: 0.8,
};

interface AnimatedInputProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  name?: string;
  required?: boolean;
}

export default function AnimatedInput({
  type = "text",
  placeholder,
  value = "",
  onChange,
  label,
  onBlur,
  onFocus,
  name,
  required,
}: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-semibold text-white/60 ml-1">
          {label} {required && <span className="text-pink-500">*</span>}
        </label>
      )}
      <motion.div
        animate={{
          boxShadow: focused
            ? "0px 0px 40px rgba(147,51,234,0.4)"
            : "0px 0px 0px rgba(0,0,0,0)",
          scale: focused ? 1.02 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="w-full rounded-2xl"
      >
        <div className="relative h-16 rounded-2xl bg-[#0f071a] border border-purple-500/30 flex items-center overflow-hidden">
          <input
            type={type}
            name={name}
            value={value}
            required={required}
            autoComplete="on"
            placeholder=" "
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setFocused(true);
              onFocus?.();
            }}
            onBlur={() => {
              setFocused(false);
              onBlur?.();
            }}
            className="floating-input peer w-full h-full px-6 pt-4 bg-transparent outline-none text-white caret-[#EC4899] font-semibold text-lg"
          />
          {/* Floating label — uses pure CSS peer selectors for autofill detection */}
          {!label && (
            <span className="floating-label absolute left-6 top-1/2 -translate-y-1/2 text-lg text-purple-300/60 transition-all duration-200 pointer-events-none font-semibold peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-purple-400">
              {placeholder}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
