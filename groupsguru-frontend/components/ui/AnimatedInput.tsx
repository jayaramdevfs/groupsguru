"use client";

interface AnimatedInputProps {
  type?: string;
  placeholder?: string;
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
  placeholder = "",
  value = "",
  onChange,
  label,
  onBlur,
  onFocus,
  name,
  required,
}: AnimatedInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[13px] font-medium text-[#A0A0A0]">
          {label} {required && <span className="text-[#D97706]">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        autoComplete="on"
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full h-12 px-4 bg-[#141414] border border-[#3A3A3A] rounded-[8px] text-[#E8E8E8] text-[15px] font-medium placeholder:text-[#666666] outline-none transition-colors duration-150 focus:border-[#D97706] caret-[#D97706]"
      />
    </div>
  );
}
