// Header.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Add AnimatePresence here
import { Sparkles } from "lucide-react";
import Link from "next/link"; // Import Link

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  return (
    <motion.header
      className="z-10 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            {/* Wrap the logo in Link as well if it goes to homepage */}
            <Link href="/" className="flex items-center space-x-3">
              {" "}
              {/* Added Link */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer">
                  AlignCV
                </span>
              </h1>
            </Link>{" "}
            {/* End Link */}
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.div // motion.div or motion.span here
                key={item.name}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile Nav Menu (Wrapped in AnimatePresence) */}
        <AnimatePresence>
          {" "}
          {/* Add AnimatePresence here */}
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} // This exit animation will now work!
              className="md:hidden mt-4 flex flex-col space-y-4 bg-slate-800/95 rounded-xl p-4 shadow-lg"
            >
              {navItems.map((item) => (
                <Link // Use Link here too
                  key={item.name}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-colors duration-200 text-lg"
                  onClick={() => setMenuOpen(false)} // Close menu on click
                >
                  {item.name}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>{" "}
        {/* End AnimatePresence */}
      </div>
    </motion.header>
  );
};

export default Header;
