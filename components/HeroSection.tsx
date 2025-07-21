import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <motion.div
      className="text-center mb-16 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-5xl font-bold text-white mb-6 leading-tight"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        Optimize Your Resume for
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {" "}
          ATS Success
        </span>
      </motion.h2>
      <motion.p
        className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Elevate your resume with intelligent AI optimization. Precisely align
        your qualifications with job descriptions, enhance ATS visibility, and
        significantly boost your interview opportunities.
      </motion.p>
    </motion.div>
  );
};

export default HeroSection;
