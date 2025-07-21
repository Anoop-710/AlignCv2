import React from "react";
import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

const Card = ({ children, className = "", hover = true }: CardProps) => (
  <motion.div
    className={`bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl ${className}`}
    whileHover={
      hover
        ? {
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }
        : {}
    }
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default Card;
