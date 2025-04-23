import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseClasses = "px-4 py-2 rounded font-medium transition";

  const variantClasses =
    variant === "primary"
      ? "bg-[#444e57] hover:bg-[#333a45] text-white"
      : variant === "secondary"
      ? "bg-[#784d1e] hover:bg-[#5a3516] text-white"
      : "bg-white text-gray-700 border border-gray-400 hover:bg-gray-100";

  return (
    <button {...props} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  );
};
