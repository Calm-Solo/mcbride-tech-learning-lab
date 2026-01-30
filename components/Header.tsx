"use client";

import { useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#games", label: "Games" },
    { href: "#features", label: "Features" },
    { href: "#progress", label: "Progress" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a
                href="/"
                className="text-xl sm:text-2xl font-display font-semibold bg-gradient-to-r from-cyan-300 via-blue-200 to-violet-300 bg-clip-text text-transparent"
              >
                McBride Tech Learning Lab
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/auth"
                className="text-slate-200 hover:text-cyan-300 transition-colors"
              >
                Sign Up
              </a>
              <a
                href="/auth"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 px-4 py-2 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-colors shadow-lg shadow-cyan-500/20"
              >
                Log In
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-slate-200 hover:bg-white/10"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
