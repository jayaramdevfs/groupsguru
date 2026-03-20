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
  const isPassword = type === "password";

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
            autoComplete="off"
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setFocused(true);
              onFocus?.();
            }}
            onBlur={() => {
              setFocused(false);
              onBlur?.();
            }}
            className="absolute inset-0 px-6 bg-[#0f071a] outline-none text-transparent caret-[#EC4899] font-semibold text-lg"
          />

          <div className="absolute left-6 right-6 flex items-center font-semibold text-lg text-white pointer-events-none">
            {(value || "").split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={spring}
                style={{
                  transformOrigin: "center",
                }}
              >
                {isPassword ? "•" : char}
              </motion.span>
            ))}
          </div>

          {!value && (
            <span className="absolute left-6 text-purple-300/60 font-semibold text-lg pointer-events-none">
              {placeholder}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}