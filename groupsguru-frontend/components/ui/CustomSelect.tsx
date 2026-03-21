import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Framer motion variants for the dropdown container
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring" as const, stiffness: 400, damping: 25,
        staggerChildren: 0.03 // Stagger the appearance of options
      } 
    },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
  };

  // Framer motion variants for individual options
  const optionVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }
  };

  return (
    <div
      className={`relative w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      ref={containerRef}
    >
      {/* Trigger Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black/40 border rounded-2xl p-4 flex justify-between items-center transition-all duration-300 text-left backdrop-blur-md
          ${isOpen 
            ? "border-purple-500/70 shadow-[0_0_15px_rgba(147,51,234,0.3)] bg-purple-900/10" 
            : "border-white/10 hover:border-white/20 hover:bg-black/60"
          }
        `}
      >
        <span
          className={`font-medium ${
            selectedOption ? "text-white" : "text-white/40 italic"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-5 h-5 ${isOpen ? "text-purple-400" : "text-white/40"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-[999] w-full mt-3 bg-[#0f051d] border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Custom generic CSS scrollbar classes added for tailwind via global CSS logic */}
            <div className="max-h-[300px] overflow-y-auto p-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
              {options.length === 0 ? (
                <div className="px-5 py-4 text-white/40 italic text-center font-medium">
                  No options available
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <motion.button
                      variants={optionVariants}
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3.5 mb-1 last:mb-0 rounded-xl transition-all duration-200 flex items-center justify-between group
                        ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-purple-300 font-bold border border-purple-500/20 shadow-[inset_0_0_10px_rgba(147,51,234,0.1)]"
                            : "text-white/80 hover:bg-white/5 hover:text-white border border-transparent"
                        }
                      `}
                    >
                      <span className="truncate pr-4">{option.label}</span>
                      
                      {/* Checkmark icon for selected item */}
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="w-5 h-5 text-purple-400 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
