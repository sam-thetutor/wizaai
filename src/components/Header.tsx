import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Rocket } from "lucide-react";
import { useApp } from "../contexts/AppContext";

const Header: React.FC = () => {
  const { navigateTo } = useApp();
  const location = useLocation();

  if (location.pathname !== "/") return null;

  return (
    <header className="sticky top-0 z-50 cyber-card backdrop-blur-cyber border-b border-cyber">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Cyber Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer hover:cyber-glow transition-all duration-300 group"
            onClick={() => navigateTo("/")}
          >
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-cyber-primary neon-text-cyan font-cyber">Wiza</h1>
            </div>
          </div>

          {/* Cyber Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#features"
              className="cyber-nav-item text-cyan-200 hover:text-cyber-primary transition-colors font-cyber"
            >
              Features
            </a>
            <Link
              to="/app/courses"
              className="cyber-nav-item text-cyan-200 hover:text-cyber-primary transition-colors font-cyber"
            >
              Courses
            </Link>
            <a
              href="#creators"
              className="cyber-nav-item text-cyan-200 hover:text-cyber-primary transition-colors font-cyber"
            >
              For Creators
            </a>
            <Link
              to="/docs"
              className="cyber-nav-item text-cyan-200 hover:text-cyber-primary transition-colors font-cyber"
            >
              Docs
            </Link>
            <Link
              to="/pitch-deck"
              className="cyber-nav-item text-cyan-200 hover:text-cyber-primary transition-colors font-cyber"
            >
              Pitch Deck
            </Link>
          </nav>

          {/* Cyber CTA Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateTo("/app/courses")}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center">
                Launch App
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
