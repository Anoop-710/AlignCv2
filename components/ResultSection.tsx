"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  BarChart3,
  Settings,
  Sparkles,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Info,
  XCircle,
} from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import { AnalysisResult, OptimizationResult } from "./UploadSection";

type ResultSectionProps = {
  analysisResult: AnalysisResult | null;
  optimizationResult: OptimizationResult | null;
  onDownloadOptimizedResume: (optimizedText: string) => void;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

const ResultSection = ({
  analysisResult,
  optimizationResult,
  onDownloadOptimizedResume,
  activeTab, // Use prop
  setActiveTab, // Use prop
}: ResultSectionProps) => {
  if (!analysisResult) {
    return null;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "suggestions", label: "Suggestions", icon: Settings },
    ...(optimizationResult &&
    optimizationResult.optimization_status === "success"
      ? [
          { id: "optimized", label: "Optimized Resume", icon: Sparkles },
          { id: "download", label: "Download", icon: Download },
        ]
      : []),
  ];

  const ScoreCard = ({
    label,
    value,
    color,
    icon: Icon,
  }: {
    label: string;
    value: number;
    color: string;
    icon: React.ElementType;
  }) => (
    <motion.div
      className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300 text-sm">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-white">{value}%</div>
      <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
        <motion.div
          className={`h-2 rounded-full bg-gradient-to-r ${
            color.includes("blue")
              ? "from-blue-500 to-blue-600"
              : color.includes("green")
              ? "from-green-500 to-green-600"
              : "from-purple-500 to-purple-600"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );

  return (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Analysis Results
          </h2>
          <p className="text-slate-400">Your resume optimization report</p>
        </div>
        <motion.div
          className="flex items-center space-x-2 text-green-400"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-semibold">Analysis Complete</span>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-slate-700/30 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} // Use prop setter
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-600/50"
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <ScoreCard
                label="Overall match of original resume"
                value={analysisResult.match_percentage}
                color={
                  analysisResult.match_percentage >= 70
                    ? "text-green-400"
                    : analysisResult.match_percentage >= 40
                    ? "text-blue-400"
                    : "text-red-400"
                }
                icon={TrendingUp}
              />
            </div>

            {analysisResult.warnings && analysisResult.warnings.length > 0 && (
              <div className="bg-slate-700/20 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-yellow-400" /> Warnings &
                  Suggestions
                </h3>
                <div className="space-y-3">
                  {analysisResult.warnings.map(
                    (warning: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 text-slate-300"
                      >
                        <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>{warning}</span>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "suggestions" && (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-slate-700/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Keyword Suggestions (Coming Soon: Enhanced!)
              </h3>
              {analysisResult.suggestions &&
              analysisResult.suggestions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysisResult.suggestions.map(
                    (suggestion: string, index: number) => (
                      <motion.span
                        key={index}
                        className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {suggestion}
                      </motion.span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-slate-400">
                  No specific keyword suggestions at this time or already
                  well-matched!
                </p>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "optimized" && (
          <motion.div
            key="optimized"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-slate-700/20 rounded-xl p-6 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Optimized Resume Content
              </h3>
              {optimizationResult &&
              optimizationResult.optimization_status === "success" ? (
                <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {optimizationResult.optimized_resume_text}
                </pre>
              ) : (
                <div className="text-center text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                  <p>
                    No optimized resume available yet. Click &#39;Optimize
                    Resume&#39; after analysis.
                  </p>
                  {optimizationResult &&
                    optimizationResult.optimization_status === "error" && (
                      <p className="text-red-400 mt-2 flex items-center justify-center">
                        <XCircle className="w-4 h-4 mr-1" />{" "}
                        {optimizationResult.message || "Optimization failed."}
                      </p>
                    )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "download" && (
          <motion.div
            key="download"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-slate-700/20 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Download Your Optimized Resume
              </h3>
              {optimizationResult &&
              optimizationResult.optimized_resume_text ? (
                <>
                  <p className="text-slate-300 mb-6">
                    Your optimized resume is ready! Click the button below to
                    download it.
                  </p>
                  <Button
                    size="lg"
                    icon={Download}
                    onClick={() =>
                      // Pass the optimized_resume_text directly
                      onDownloadOptimizedResume(
                        optimizationResult.optimized_resume_text!
                      )
                    }
                  >
                    Download Optimized Resume
                  </Button>
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <Download className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p>No optimized resume available for download yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ResultSection;
