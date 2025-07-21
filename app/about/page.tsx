"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Users, Lock, Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  gradient: string;
  direction: "left" | "right";
  delay: number;
}

const SectionCard = ({
  title,
  description,
  icon: Icon,
  iconColor,
  gradient,
  direction,
  delay,
}: SectionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border transition-all duration-500 ${
        isHovered
          ? "border-blue-400/50 shadow-2xl shadow-blue-500/10 scale-[1.02]"
          : "border-slate-700/40"
      }`}
      initial={{
        opacity: 0,
        x: direction === "left" ? -60 : 60,
        rotateY: direction === "left" ? -10 : 10,
      }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-2xl`}
        animate={{
          opacity: isHovered ? 0.1 : 0.05,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 ${iconColor
              .replace("text-", "bg-")
              .replace("-400", "-300")} rounded-full opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={
              isHovered
                ? {
                    y: [-10, -30, -10],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.5, 1],
                  }
                : {}
            }
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Enhanced icon with glow effect */}
        <motion.div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg mb-6 relative`}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <Icon className={`w-8 h-8 text-white drop-shadow-lg`} />

          {/* Pulsing glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient}`}
            animate={
              isHovered
                ? {
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-white mb-6 leading-tight"
          animate={{
            color: isHovered ? "#60a5fa" : "#ffffff",
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h2>

        <p className="text-lg text-slate-300 leading-relaxed mb-4">
          {description}
        </p>

        {/* Hover indicator */}
        <motion.div
          className="flex items-center gap-2 text-blue-400 font-medium opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          Learn more <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const AboutPage = () => {
  const sections = [
    {
      title: "Our Mission",
      description:
        "At AlignCV, our mission is to democratize career success by leveraging cutting-edge AI technology. We provide clear, actionable insights that help you craft resumes that truly resonate with both Applicant Tracking Systems and human recruiters. We believe every talented individual deserves a fair opportunity to showcase their potential and land their dream job.",
      icon: Sparkles,
      iconColor: "text-blue-400",
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      direction: "left" as const,
      delay: 0.2,
    },
    {
      title: "Our Vision",
      description:
        "We envision a world where talent transcends traditional barriers—where skilled professionals are never overlooked due to formatting issues or keyword mismatches. AlignCV aspires to be the global standard for career advancement, continuously innovating to deliver the most effective, intuitive, and powerful tools for job application success.",
      icon: Users,
      iconColor: "text-emerald-400",
      gradient: "from-emerald-500 via-green-600 to-teal-600",
      direction: "right" as const,
      delay: 0.4,
    },
    {
      title: "Privacy & Security",
      description:
        "Your privacy isn't just important to us—it's fundamental to everything we do. AlignCV is architected with privacy-first principles, featuring enterprise-grade security, built-in data masking capabilities, and end-to-end encryption. Your sensitive information remains completely secure and confidential throughout every stage of analysis and optimization.",
      icon: Lock,
      iconColor: "text-red-400",
      gradient: "from-red-500 via-orange-600 to-amber-600",
      direction: "left" as const,
      delay: 0.6,
    },
  ];

  return (
    <>
      <div className="z-100 fixed top-0 w-full">
        <Header />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-4">
        {/* Hero Section with animated background */}
        <motion.div
          className="relative overflow-hidden pt-20 pb-16 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 0.8, 1.2],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-6xl md:text-7xl font-black mb-8 leading-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  About AlignCV
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Empowering the next generation of{" "}
                <span className="text-blue-400 font-semibold">job seekers</span>{" "}
                with intelligent tools to navigate and{" "}
                <span className="text-purple-400 font-semibold">excel</span> in
                the modern hiring landscape.
              </motion.p>
            </motion.div>

            {/* Main content sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <SectionCard key={index} {...section} />
              ))}
            </div>

            {/* Call to action */}
            <motion.div
              className="mt-20 text-center bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl rounded-2xl p-12 border border-slate-600/30"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Join Our Community
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Be part of a growing community of professionals who are
                transforming their careers with AlignCV. Your success story
                starts here.
              </p>
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage;
