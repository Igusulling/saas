import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading = false,
  icon,
  ...props
}) => {
  return (
    <button
      className={`
        relative w-full py-3 px-6 rounded-lg font-medium text-base
        transition-all duration-300 transform
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E100FF]
        ${loading ? "cursor-wait" : "hover:scale-[1.02] active:scale-[0.98]"}
        ${
          variant === "primary"
            ? "bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white hover:shadow-lg hover:shadow-[#E100FF]/20"
            : "bg-gradient-to-r from-[#00F260] to-[#0575E6] text-white hover:shadow-lg hover:shadow-[#0575E6]/20"
        }
      `}
      disabled={loading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <>
            {icon && <span className="w-5 h-5">{icon}</span>}
            {children}
          </>
        )}
      </div>
    </button>
  );
};
