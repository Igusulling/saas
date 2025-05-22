import React from "react";

interface LogoIconProps {
  className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = "" }) => {
  return (
    <div className={`${className} relative`}>
      <div className="absolute inset-0 blur-xl bg-gradient-to-r from-[#7F00FF] to-[#E100FF] opacity-50"></div>
      <div className="relative bg-gradient-to-r from-[#7F00FF] to-[#E100FF] rounded-xl p-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  );
};
