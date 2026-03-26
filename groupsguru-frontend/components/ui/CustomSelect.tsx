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
  placeholder = "Select option...",
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

  return (
    <div
      className={`relative w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#141414] border rounded p-3 flex justify-between items-center transition-all duration-150 text-left 
          ${isOpen 
            ? "border-[#D97706] ring-1 ring-[#D97706]/20" 
            : "border-[#3A3A3A] hover:border-[#666666]"
          }
        `}
      >
        <span
          className={`text-sm font-medium truncate pr-4 ${
            selectedOption ? "text-[#E8E8E8]" : "text-[#666666]"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-150 ${isOpen ? "rotate-180 text-[#D97706]" : "text-[#666666]"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[999] w-full mt-1 bg-[#1E1E1E] border border-[#3A3A3A] rounded shadow-xl overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-[#666666] text-sm text-center">
                  No options available
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center justify-between
                        ${
                          isSelected
                            ? "bg-[#D97706]/10 text-[#D97706] font-bold"
                            : "text-[#A0A0A0] hover:bg-[#2D2D2D] hover:text-[#E8E8E8]"
                        }
                      `}
                    >
                      <span className="truncate pr-4">{option.label}</span>
                      {isSelected && (
                        <svg className="w-4 h-4 text-[#D97706] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
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
