"use client";

import { useState } from "react";

interface AnimatedInputProps {
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: any) => void;
  label?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  name?: string;
  required?: boolean;
}

export default function AnimatedInput({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  label,
  onBlur,
  onFocus,
  name,
  required,
}: AnimatedInputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest ml-1">
          {label} {required && <span className="text-[#C74444]">*</span>}
        </label>
      )}
      <div className="relative group/input">
        <input
          type={inputType}
          name={name}
          value={value}
          required={required}
          autoComplete="on"
          placeholder={placeholder}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full bg-[#141414] border border-[#3A3A3A] rounded p-4 text-[#E8E8E8] text-sm font-medium placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#D97706]/50 transition-colors"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-[#666666] uppercase hover:text-[#D97706] tracking-widest bg-[#1E1E1E] px-2 py-1 rounded border border-[#3A3A3A]"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}
