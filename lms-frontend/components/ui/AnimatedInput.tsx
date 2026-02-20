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
}

export default function AnimatedInput({
  type = "text",
  placeholder,
  value,
  onChange,
}: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0px 0px 30px rgba(147,51,234,0.6)"
          : "0px 0px 0px rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.25 }}
      className="w-full rounded-2xl"
    >
      <div className="relative h-16 rounded-2xl bg-black/40 border border-purple-500/40 backdrop-blur-xl px-6 flex items-center overflow-hidden">

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 px-6 bg-transparent outline-none text-transparent caret-[#EC4899] font-semibold text-lg"
        />

        <div className="absolute left-6 right-6 flex items-center font-semibold text-lg text-white pointer-events-none">
          {value.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={spring}
              style={{
                transformOrigin: "center",
                textShadow:
                  "0px 0px 12px rgba(147,51,234,0.8)",
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
  );
}