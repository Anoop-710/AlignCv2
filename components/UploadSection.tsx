// src/components/UploadSection.tsx
"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Target,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export interface AnalysisResult {
  message: string;
  match_percentage: number;
  warnings: string[];
  suggestions: string[];
  extracted_text_debug: {
    resume_text: string;
    jd_text: string;
  };
}

export interface OptimizationResult {
  optimization_status: "success" | "error";
  message: string;
  optimized_resume_text?: string;
  download_link?: string;
}

type UploadSectionProps = {
  onFilesChange: (files: { resume: File | null; jobDesc: File | null }) => void;
  onAnalyze: () => Promise<void>;
  onOptimize: () => Promise<void>;
  isLoading: {
    analysis: boolean;
    optimization: boolean;
  };
  analysisResult: AnalysisResult | null;
  errorMessage: string | null;
};

const UploadSection = ({
  onFilesChange,
  onAnalyze,
  onOptimize,
  isLoading,
  analysisResult,
  errorMessage,
}: UploadSectionProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    onFilesChange({ resume: resumeFile, jobDesc: jobDescFile });
  }, [resumeFile, jobDescFile, onFilesChange]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "jobDesc"
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedFileTypes = [".pdf", ".doc", ".docx", ".txt"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedFileTypes.includes(fileExtension || "")) {
        alert(
          `Unsupported file type: ${file.name}. Please upload PDF, DOC, DOCX, or TXT files.`
        );
        if (type === "resume") {
          setResumeFile(null);
        } else {
          setJobDescFile(null);
        }
        return;
      }

      if (type === "resume") {
        setResumeFile(file);
      } else {
        setJobDescFile(file);
      }
    }
  };

  const FileUploadBox = ({
    type,
    title,
    subtitle,
    icon: Icon,
    file,
    inputRef,
  }: {
    type: "resume" | "jobDesc";
    title: string;
    subtitle: string;
    icon: React.ElementType;
    file: File | null;

    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <motion.div
      className="relative border-2 border-dashed border-slate-600 hover:border-slate-500 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, type)}
        accept=".pdf,.doc,.docx,.txt"
      />
      <Icon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">
        {file ? file.name : subtitle}
      </p>
      {file && (
        <span className="text-sm text-green-400 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 mr-1" /> File Selected
        </span>
      )}
      {!file && (
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      )}
    </motion.div>
  );

  const isAnalyzeButtonDisabled =
    !resumeFile || !jobDescFile || isLoading.analysis || isLoading.optimization;
  const isOptimizeButtonDisabled =
    !analysisResult ||
    analysisResult.match_percentage < 40 ||
    isLoading.optimization;

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Upload className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          Upload Documents
        </h2>
        <p className="text-slate-400">
          Upload your resume and job description to get started
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <FileUploadBox
          type="resume"
          title="Resume"
          subtitle="PDF, DOCX, or TXT format"
          icon={FileText}
          file={resumeFile}
          inputRef={resumeInputRef}
        />
        <FileUploadBox
          type="jobDesc"
          title="Job Description"
          subtitle="PDF, DOCX, or TXT format"
          icon={Target}
          file={jobDescFile}
          inputRef={jdInputRef}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          size="lg"
          icon={BarChart3}
          onClick={onAnalyze}
          disabled={isAnalyzeButtonDisabled}
          className={isLoading.analysis ? "animate-pulse" : ""}
        >
          {isLoading.analysis ? "Analyzing..." : "Analyze Resume"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button
          size="lg"
          variant="secondary"
          icon={Sparkles}
          onClick={onOptimize}
          disabled={isOptimizeButtonDisabled}
          className={isLoading.optimization ? "animate-pulse" : ""}
        >
          {isLoading.optimization ? "Optimizing..." : "Optimize Resume"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      {analysisResult && analysisResult.match_percentage < 40 && (
        <p className="text-red-400 text-center mt-4 text-sm">
          Match score is below 40%. Optimization is disabled. Please adjust your
          resume first.
        </p>
      )}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-800/30 border border-red-700 text-red-300 p-4 rounded-lg text-center flex items-center justify-center space-x-2 mt-4"
        >
          <XCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}
    </Card>
  );
};

export default UploadSection;
