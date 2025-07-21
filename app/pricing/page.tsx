"use client";
import React, { useState, useEffect } from "react";
import { Clock, Bell, Sparkles, Zap, Star, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

const PricingPage = () => {
  const [isNotifyHovered, setIsNotifyHovered] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleNotifySubmit = () => {
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className="absolute opacity-20"
      style={{
        left: `${20 + i * 15}%`,
        top: `${30 + (i % 3) * 20}%`,
        transform: `translate(${Math.sin(Date.now() * 0.001 + i) * 20}px, ${
          Math.cos(Date.now() * 0.001 + i) * 15
        }px)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {i % 3 === 0 && <Star className="w-4 h-4 text-blue-400" />}
      {i % 3 === 1 && <Sparkles className="w-5 h-5 text-purple-400" />}
      {i % 3 === 2 && <Zap className="w-4 h-4 text-cyan-400" />}
    </div>
  ));

  return (
    <>
      <div className="z-2">
        <Header />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingElements}

          {/* Gradient Orbs */}
          <div
            className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            style={{
              left: `${mousePosition.x * 0.02}px`,
              top: `${mousePosition.y * 0.02}px`,
              transition: "all 0.3s ease-out",
            }}
          />
          <div
            className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/15 to-pink-500/15 rounded-full blur-2xl"
            style={{
              right: `${mousePosition.x * -0.01}px`,
              bottom: `${mousePosition.y * -0.01}px`,
              transition: "all 0.5s ease-out",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4">
          {/* Header Animation */}
          <div className="text-center mb-12 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-30 rounded-full animate-pulse" />
              <Clock
                className="w-24 h-24 text-blue-400 mx-auto relative z-10 drop-shadow-lg animate-bounce"
                style={{
                  animationDuration: "3s",
                  filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
                }}
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Pricing Plans
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full animate-pulse" />
            </div>
          </div>

          {/* Main Card */}
          <div className="relative group max-w-2xl w-full">
            {/* Glowing Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />

            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-slate-700/50 group-hover:border-slate-600/70 transition-all duration-500">
              {/* Content */}
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <p className="text-2xl text-slate-300 font-medium leading-relaxed">
                    Our flexible pricing options are currently under development
                  </p>
                  <p className="text-xl text-slate-400 leading-relaxed">
                    We&apos;re crafting the perfect plans to match your AlignCv
                    needs
                  </p>
                </div>

                {/* Feature Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                  {[
                    {
                      icon: Sparkles,
                      text: "AI-Powered Matching",
                      color: "blue",
                    },
                    { icon: Zap, text: "Lightning Fast", color: "purple" },
                    { icon: Star, text: "Premium Features", color: "cyan" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-3 group/item"
                    >
                      <div
                        className={`p-3 rounded-full bg-gradient-to-r ${
                          feature.color === "blue"
                            ? "from-blue-500/20 to-blue-600/20"
                            : feature.color === "purple"
                            ? "from-purple-500/20 to-purple-600/20"
                            : "from-cyan-500/20 to-cyan-600/20"
                        } group-hover/item:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon
                          className={`w-6 h-6 ${
                            feature.color === "blue"
                              ? "text-blue-400"
                              : feature.color === "purple"
                              ? "text-purple-400"
                              : "text-cyan-400"
                          }`}
                        />
                      </div>
                      <p className="text-sm text-slate-400 group-hover/item:text-slate-300 transition-colors duration-300">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Notify Me Form */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">
                    Get Notified When We Launch
                  </h3>

                  {!isSubmitted ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <button
                        onClick={handleNotifySubmit}
                        className={`w-full py-4 px-8 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                          isNotifyHovered
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-105 shadow-lg"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                        } hover:scale-105 hover:shadow-xl active:scale-95 flex items-center justify-center space-x-3`}
                        onMouseEnter={() => setIsNotifyHovered(true)}
                        onMouseLeave={() => setIsNotifyHovered(false)}
                      >
                        <Bell className="w-5 h-5" />
                        <span>Notify Me</span>
                        <ArrowRight
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isNotifyHovered ? "translate-x-1" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 space-y-4">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            ✓
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xl font-semibold text-green-400">
                        Thanks for your interest!
                      </h4>
                      <p className="text-slate-400">
                        We&apos;ll notify you as soon as pricing is available.
                      </p>
                    </div>
                  )}
                </div>

                {/* Coming Soon Badge */}
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-amber-400 font-medium">
                    Launch Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-lg">
              Building something amazing takes time. Thanks for your patience!
              🚀
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
