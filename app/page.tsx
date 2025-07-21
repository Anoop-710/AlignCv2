"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import FeatureCard from "../components/FeatureCard";
import UploadSection, {
  AnalysisResult,
  OptimizationResult,
} from "../components/UploadSection";
import ResultSection from "../components/ResultSection";

import { Zap, CheckCircle, Target, XCircle } from "lucide-react";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL_PROD // Full Render URL for production
    : process.env.NEXT_PUBLIC_BACKEND_URL; // Empty string for dev (to use Next.js rewrites)

const ResumeRestructureApp = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [optimizationResult, setOptimizationResult] =
    useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState({
    analysis: false,
    optimization: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // NEW STATE: To control the active tab in ResultSection
  const [activeResultTab, setActiveResultTab] = useState<string>("overview");

  useEffect(() => {
    console.log("Current analysisResult state:", analysisResult);
    if (analysisResult) {
      console.log(
        "Analysis Result IS present. ResultSection should be visible."
      );
    } else {
      console.log("Analysis Result is NULL. ResultSection should be hidden.");
    }
  }, [analysisResult]);

  useEffect(() => {
    console.log("Current errorMessage state:", errorMessage);
  }, [errorMessage]);

  const handleFilesChange = useCallback(
    (files: { resume: File | null; jobDesc: File | null }) => {
      console.log("handleFilesChange triggered. Resetting states.");
      setResumeFile(files.resume);
      setJobDescFile(files.jobDesc);
      setAnalysisResult(null);
      setOptimizationResult(null);
      setErrorMessage(null);
      setActiveResultTab("overview"); // Reset tab to overview on new files
    },
    []
  );

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescFile) {
      setErrorMessage("Please upload both resume and job description files.");
      console.log("Analyze: Missing files.");
      return;
    }

    setErrorMessage(null);
    setIsLoading((prev) => ({ ...prev, analysis: true }));
    setAnalysisResult(null);
    setOptimizationResult(null);
    setActiveResultTab("overview");

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_file", jobDescFile);
    formData.append("min_match_percentage", "0.40");

    try {
      console.log("Sending analyze request...");
      const response = await fetch(`${API_BASE_URL}/analyze/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Analysis failed with status ${response.status}`
        );
      }

      const data: AnalysisResult = await response.json();
      console.log("Analysis request successful. Setting analysisResult:", data);
      setAnalysisResult(data);
    } catch (error: unknown) {
      console.error("Analysis Error (Caught):", error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred during analysis.");
      }
      setAnalysisResult(null);
    } finally {
      setIsLoading((prev) => ({ ...prev, analysis: false }));
      console.log("Analysis process finished.");
    }
  };

  const handleOptimize = async () => {
    if (!resumeFile || !jobDescFile) {
      setErrorMessage("Please upload both resume and job description files.");
      return;
    }
    if (!analysisResult || analysisResult.match_percentage < 40) {
      setErrorMessage(
        "Please perform analysis first and ensure match is 40% or higher."
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading((prev) => ({ ...prev, optimization: true }));
    setOptimizationResult(null);

    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_file", jobDescFile);
    formData.append("required_match_for_optimization", "0.40");

    try {
      const response = await fetch(`${API_BASE_URL}/optimize/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail ||
            `Optimization failed with status ${response.status}`
        );
      }

      const data: OptimizationResult = await response.json();
      setOptimizationResult(data);
      // NEW: Set active tab to 'optimized' after successful optimization
      setActiveResultTab("optimized");
    } catch (error: unknown) {
      console.error("Optimization Error:", error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred during optimization.");
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, optimization: false }));
    }
  };

  const handleDownloadOptimizedResume = (optimizedText: string) => {
    const filename = `optimized_resume_${Date.now()}.txt`; // Dynamic filename
    const blob = new Blob([optimizedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // This will set the download filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Clean up the temporary link
    URL.revokeObjectURL(url); // Clean up the Blob URL
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </motion.div>

      <Header />

      <main className="container mx-auto px-4 py-12 relative z-10">
        <HeroSection />

        <div className="max-w-6xl mx-auto space-y-12">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-800/30 border border-red-700 text-red-300 p-4 rounded-lg text-center flex items-center justify-center space-x-2"
            >
              <XCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <UploadSection
              onFilesChange={handleFilesChange}
              onAnalyze={handleAnalyze}
              onOptimize={handleOptimize}
              isLoading={isLoading}
              analysisResult={analysisResult}
              errorMessage={errorMessage}
            />
          </motion.div>

          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ResultSection
                analysisResult={analysisResult}
                optimizationResult={optimizationResult}
                onDownloadOptimizedResume={handleDownloadOptimizedResume}
                // NEW PROPS: Pass active tab state and setter
                activeTab={activeResultTab}
                setActiveTab={setActiveResultTab}
              />
            </motion.div>
          )}
        </div>

        <motion.div
          className="mt-24 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Why Choose AlignCV?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Intelligent tools and intuitive design provide the competitive
              edge you need in your job search.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Lightning Fast Analysis"
              description="Get comprehensive resume analysis in seconds for quick, actionable insights."
              icon={Zap}
              gradient="from-blue-500 to-blue-600"
              delay={0}
            />
            <FeatureCard
              title="ATS Optimization"
              description="Maximize your resume's compatibility with Applicant Tracking Systems."
              icon={CheckCircle}
              gradient="from-green-500 to-green-600"
              delay={0.2}
            />
            <FeatureCard
              title="Smart Keyword Matching"
              description="Intelligent alignment of your skills with job requirements for maximum impact"
              icon={Target}
              gradient="from-purple-500 to-purple-600"
              delay={0.4}
            />
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ResumeRestructureApp;
