// pages/features.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckCircle,
  Target,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";
import Header from "@/components/Header";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  delay: number;
  benefits: string[];
  isPopular?: boolean;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  gradient,
  delay,
  benefits,
  isPopular = false,
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border transition-all duration-500 ${
        isHovered
          ? "border-blue-400/60 shadow-blue-500/20 shadow-2xl scale-105 -translate-y-2"
          : "border-slate-700/40 hover:border-slate-600/60"
      }`}
      initial={{ opacity: 0, y: 30, rotateX: 5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 120,
        damping: 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular badge */}
      {isPopular && (
        <motion.div
          className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg"
          initial={{ scale: 0, rotate: 12 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ delay: delay + 0.3 }}
        >
          <Star className="w-3 h-3" />
          Popular
        </motion.div>
      )}

      {/* Animated background glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 rounded-2xl`}
        animate={{
          opacity: isHovered ? 0.1 : 0.05,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon with enhanced styling */}
      <motion.div
        className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${gradient} shadow-lg`}
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? 5 : 0,
        }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <Icon className="w-10 h-10 text-white drop-shadow-lg" />

        {/* Animated rings */}
        <motion.div
          className={`absolute inset-0 rounded-2xl border-2 border-white/20`}
          animate={{
            scale: isHovered ? [1, 1.3, 1] : 1,
            opacity: isHovered ? [0.5, 0, 0.5] : 0,
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <motion.h3
          className="text-2xl font-bold text-white mb-4 leading-tight"
          animate={{
            color: isHovered ? "#60a5fa" : "#ffffff",
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>

        <p className="text-slate-300 mb-6 leading-relaxed text-base">
          {description}
        </p>

        {/* Benefits list with animation */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="border-t border-slate-600/50 pt-4 space-y-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-sm text-slate-400"
                initial={{ x: -10, opacity: 0 }}
                animate={{
                  x: isHovered ? 0 : -10,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <ArrowRight className="w-3 h-3 text-blue-400" />
                {benefit}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-4 right-4 text-blue-400 opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.3 }}
      >
        <ArrowRight className="w-5 h-5" />
      </motion.div>
    </motion.div>
  );
};

const FeaturesPage = () => {
  const features = [
    {
      title: "In-depth Resume Analysis",
      description:
        "Get a comprehensive breakdown of your resume's strengths and areas for improvement against any job description.",
      icon: Zap,
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      benefits: [
        "Detailed compatibility score",
        "Section-by-section feedback",
        "Industry-specific recommendations",
      ],
      isPopular: true,
    },
    {
      title: "ATS Compatibility Check",
      description:
        "Optimize your resume to pass through Applicant Tracking Systems, ensuring recruiters see your application.",
      icon: CheckCircle,
      gradient: "from-emerald-500 via-green-600 to-teal-600",
      benefits: [
        "Format optimization tips",
        "Keyword density analysis",
        "ATS-friendly templates",
      ],
    },
    {
      title: "Intelligent Keyword Matching",
      description:
        "Our system intelligently identifies and suggests keywords from job descriptions to boost your resume's relevance.",
      icon: Target,
      gradient: "from-purple-500 via-violet-600 to-indigo-600",
      benefits: [
        "Smart keyword extraction",
        "Relevance scoring",
        "Context-aware suggestions",
      ],
    },
    {
      title: "Secure Data Protection",
      description:
        "Protect your sensitive personal information with our enterprise-grade security and data masking capabilities.",
      icon: ShieldCheck,
      gradient: "from-red-500 via-orange-600 to-amber-600",
      benefits: [
        "End-to-end encryption",
        "Personal data masking",
        "GDPR compliant processing",
      ],
    },
    {
      title: "AI-Powered Optimization",
      description:
        "Leverage cutting-edge artificial intelligence to refine your resume content for maximum impact and interview success.",
      icon: Cpu,
      gradient: "from-cyan-500 via-teal-600 to-blue-600",
      benefits: [
        "AI powered suggestions",
        "Industry best practices",
        "Continuous learning algorithms",
      ],
    },
    {
      title: "Intuitive Experience",
      description:
        "An elegant, user-centric design that makes resume optimization effortless and enjoyable.",
      icon: Sparkles,
      gradient: "from-indigo-500 via-purple-600 to-pink-600",
      benefits: [
        "One-click optimization",
        "Real-time preview",
        "Mobile-friendly interface",
      ],
    },
  ];

  return (
    <>
      <div className="z-100 fixed top-0 w-full">
        <Header />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-8">
        {/* Hero Section */}
        <motion.div
          className="relative overflow-hidden pt-20 pb-16 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
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
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Unlock Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Career Potential
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                AlignCV offers a comprehensive suite of{" "}
                <span className="text-blue-400 font-semibold">
                  intelligent features
                </span>{" "}
                designed to give your job application the{" "}
                <span className="text-purple-400 font-semibold">
                  decisive edge
                </span>
                . From precise analysis to AI-powered optimization and
                enterprise-grade security.
              </motion.p>

              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">
                    Hover over cards to explore benefits
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              initial={{ opacity: 1 }}
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  delay={0.05 * (index + 1)}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          className="py-20 px-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of professionals who have already upgraded their
              job search with AlignCV.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default FeaturesPage;
