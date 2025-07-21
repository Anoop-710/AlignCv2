import React from "react";
import { motion } from "framer-motion";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  icon?: React.ElementType;
  type?: "button" | "submit" | "reset";
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  icon: Icon,
  type = "button",
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 relative overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary:
      "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white hover:border-white/20",
    ghost: "hover:bg-white/5 text-slate-300 hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${
        sizes[size]
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;
