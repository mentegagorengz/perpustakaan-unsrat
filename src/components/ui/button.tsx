import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses = "rounded font-medium transition";

  const variantClasses =
    variant === "primary"
      ? "bg-[#444e57] hover:bg-[#333a45] text-white"
      : variant === "secondary"
      ? "bg-[#784d1e] hover:bg-[#5a3516] text-white"
      : "bg-white text-gray-700 border border-gray-400 hover:bg-gray-100";

  const sizeClasses =
    size === "sm"
      ? "px-2 py-1 text-sm"
      : size === "lg"
      ? "px-5 py-3 text-lg"
      : "px-4 py-2 text-base";

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
};
