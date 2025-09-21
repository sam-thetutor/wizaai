/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00ffff',     // Cyan
          secondary: '#9333ea',   // Purple
          accent: '#22c55e',      // Green
          dark: '#0f0f23',        // Dark blue
          darker: '#0a0a1a',      // Darker blue
          card: '#1e293b',        // Slate
          muted: '#64748b',       // Slate gray
        },
        neon: {
          cyan: '#00ffff',
          purple: '#9333ea',
          pink: '#ec4899',
          green: '#10b981',
          blue: '#3b82f6',
          orange: '#f59e0b',
        }
      },
      fontFamily: {
        'cyber': ['Inter', 'system-ui', 'sans-serif'],
        'mono-cyber': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'cyber-pulse': 'cyberpulse 2s ease-in-out infinite',
        'neon-glow': 'neonGlow 2s ease-in-out infinite',
        'data-stream': 'dataStream 4s linear infinite',
        'holographic': 'holographicShift 3s ease infinite',
        'quantum-float': 'quantumFloat 6s ease-in-out infinite',
        'circuit-trace': 'circuitTrace 2s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
        'bounce-in': 'bounceIn 1s ease-out forwards',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1)',
        'cyber-lg': '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 255, 255, 0.2)',
        'cyber-purple': '0 0 20px rgba(147, 51, 234, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)',
        'cyber-green': '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)',
        'neon': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
      },
      backgroundImage: {
        'cyber-gradient': '#00ffff',
        'cyber-card': 'rgba(15, 15, 35, 0.95)',
        'cyber-button': '#00ffff',
        'holographic': 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff, #00ffff, #ff00ff)',
        'grid-cyber': 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
      },
      backdropBlur: {
        'cyber': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
};
