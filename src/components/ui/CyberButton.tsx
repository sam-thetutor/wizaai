import React from 'react';
import { Loader2 } from 'lucide-react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon' | 'holographic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const CyberButton: React.FC<CyberButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  glow = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-dark overflow-hidden group';
  
  const variants = {
    primary: `
      bg-gradient-to-r from-cyber-secondary to-cyber-primary text-white 
      hover:from-purple-700 hover:to-cyan-400 
      focus:ring-cyber-primary shadow-cyber-purple
      hover:shadow-cyber-lg hover:-translate-y-1
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent 
      before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700
    `,
    secondary: `
      bg-cyber-card backdrop-blur-xl border border-cyber text-cyber-primary
      hover:bg-slate-700/60 hover:border-cyber-active hover:text-cyan-300
      focus:ring-cyber-primary hover:shadow-cyber
    `,
    outline: `
      border-2 border-cyber text-cyber-primary bg-transparent
      hover:bg-cyber-primary/10 hover:border-cyber-active hover:text-cyan-300
      focus:ring-cyber-primary hover:shadow-cyber
    `,
    ghost: `
      text-cyber-muted hover:text-cyber-primary hover:bg-cyber-primary/10
      focus:ring-cyber-primary
    `,
    neon: `
      bg-gradient-to-r from-neon-purple to-neon-cyan text-white
      hover:from-purple-600 hover:to-cyan-300
      focus:ring-neon-cyan shadow-neon hover:shadow-cyber-lg
      animate-cyber-pulse hover:-translate-y-1
      text-shadow-[0_0_10px_currentColor]
    `,
    holographic: `
      bg-holographic text-transparent bg-clip-text font-bold
      hover:scale-105 focus:ring-cyber-primary
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-purple-500/20 before:to-cyan-500/20 before:rounded-xl
      hover:before:from-purple-400/30 hover:before:to-cyan-400/30
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const glowClass = glow ? 'animate-cyber-pulse' : '';
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${glowClass}
        ${isDisabled ? 'opacity-50 cursor-not-allowed hover:transform-none' : ''} 
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyber-dark/80 rounded-xl">
          <Loader2 className="w-5 h-5 animate-spin text-cyber-primary" />
        </div>
      )}
      
      {/* Cyber effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      <span className="relative z-10 flex items-center">
        {children}
      </span>
    </button>
  );
};

export default CyberButton;
