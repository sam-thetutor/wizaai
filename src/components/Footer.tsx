import React from "react";
import { useApp } from "../contexts/AppContext";
import {
  Zap,
  BookOpen,
  Award,
  Users,
  X,
  Github,
  Send as Telegram,
  Mail,
  ExternalLink,
} from "lucide-react";

const Footer: React.FC = () => {
  const { navigateTo, stats } = useApp();

  const footerLinks = {
    platform: [
      { label: "Browse Courses", onClick: () => navigateTo("/app/courses") },
      { label: "Create Course", onClick: () => navigateTo("/app/create") },
      { label: "Analytics", onClick: () => navigateTo("/analytics") },
      { label: "Community", href: "#" },
    ],
    resources: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Blog", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: X, href: "#", label: "X" },
    { icon: Telegram, href: "https://t.me/liven_kaia", label: "Telegram" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-cyber-darker text-white relative overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      
      {/* Top border effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Cyber Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4 group">
                <img src="/logo.png" alt="Wiza" className="h-10 w-10" />
              <div>
                <h3 className="text-xl font-bold text-cyber-primary neon-text-cyan font-cyber">Wiza</h3>
              </div>
            </div>
            <p className="text-cyan-100 text-sm mb-4">
              <span className="text-cyber-primary font-semibold">Decentralized education platform</span> empowering learners and creators
              worldwide with <span className="text-cyber-accent">blockchain-verified certificates</span> and NFT rewards.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg cyber-card border-cyber hover:cyber-glow hover:text-cyber-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold mb-4 text-cyber-primary font-cyber">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className="text-cyan-200 hover:text-cyber-primary hover:neon-text-cyan transition-all duration-300 text-sm font-cyber"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-cyan-200 hover:text-cyber-primary hover:neon-text-cyan transition-all duration-300 text-sm flex items-center space-x-1 font-cyber"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4 text-cyber-primary font-cyber">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cyan-200 hover:text-cyber-primary hover:neon-text-cyan transition-all duration-300 text-sm flex items-center space-x-1 font-cyber"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cyan-200 hover:text-cyber-primary hover:neon-text-cyan transition-all duration-300 text-sm flex items-center space-x-1 font-cyber"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cyber Stats Section */}
        <div className="border-t border-cyber pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group hover:cyber-glow transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-cyber-secondary animate-cyber-pulse" />
              </div>
              <div className="text-2xl font-bold text-cyber-primary neon-text-cyan font-cyber">
                {stats.totalCourses.toLocaleString()}+
              </div>
              <div className="text-sm text-cyber-muted">Courses</div>
            </div>
            <div className="text-center group hover:cyber-glow transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-neon-blue animate-cyber-pulse delay-200" />
              </div>
              <div className="text-2xl font-bold text-cyber-primary neon-text-cyan font-cyber">{stats.totalStudents}+</div>
              <div className="text-sm text-cyber-muted">Students</div>
            </div>
            <div className="text-center group hover:cyber-glow transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-neon-orange animate-cyber-pulse delay-400" />
              </div>
              <div className="text-2xl font-bold text-cyber-primary neon-text-cyan font-cyber">
                {stats.totalCertificates}+
              </div>
              <div className="text-sm text-cyber-muted">Certificates</div>
            </div>
            <div className="text-center group hover:cyber-glow transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-cyber-accent animate-cyber-pulse delay-600" />
              </div>
              <div className="text-2xl font-bold text-cyber-primary neon-text-cyan font-cyber">100%</div>
              <div className="text-sm text-cyber-muted">Decentralized</div>
            </div>
          </div>
        </div>

        {/* Cyber Bottom Section */}
        <div className="border-t border-cyber pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-cyan-200 mb-4 md:mb-0 font-cyber">
            © 2025 <span className="text-cyber-primary font-semibold">Wiza</span>. Built on <span className="text-cyber-primary font-semibold neon-text-cyan">Kaia</span>. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm text-cyan-200">
            <span className="font-cyber">Powered by</span>
            <div className="flex items-center space-x-2 cyber-badge">
              <div className="w-4 h-4 bg-cyber-primary rounded animate-cyber-pulse"></div>
              <span className="font-medium text-cyber-primary">Kaia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
