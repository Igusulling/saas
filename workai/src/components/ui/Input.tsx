import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  success,
  type = "text",
  onChange,
  value,
  name,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label className="block text-white/90 text-sm font-medium">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </div>
        <input
          type={showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 ${icon ? "pl-11" : ""} py-3 bg-white/[0.03] 
            border rounded-lg text-white placeholder:text-white/30
            transition-all duration-300
            ${
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : success
                ? "border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                : "border-white/[0.05] focus:border-[#E100FF] focus:ring-2 focus:ring-[#E100FF]/20"
            }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};
