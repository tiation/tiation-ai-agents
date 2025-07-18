/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark neon theme colors
        'neon-cyan': '#00ffff',
        'neon-magenta': '#ff00ff',
        'neon-blue': '#0099ff',
        'neon-purple': '#9900ff',
        'neon-green': '#00ff99',
        'neon-pink': '#ff0099',
        'dark-bg': '#0a0a0a',
        'dark-surface': '#1a1a1a',
        'dark-elevated': '#2a2a2a',
        'dark-border': '#333333',
        'dark-text': '#e0e0e0',
        'dark-muted': '#666666',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(45deg, #00ffff, #ff00ff)',
        'neon-gradient-reverse': 'linear-gradient(225deg, #00ffff, #ff00ff)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a, #1a1a1a, #0a0a0a)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px #00ffff40',
        'neon-magenta': '0 0 20px #ff00ff40',
        'neon-blue': '0 0 20px #0099ff40',
        'neon-glow': '0 0 40px #00ffff20, 0 0 60px #ff00ff20',
        'dark-elevated': '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        neonPulse: {
          '0%': { 
            boxShadow: '0 0 20px #00ffff40, 0 0 40px #ff00ff20',
            transform: 'scale(1)',
          },
          '100%': { 
            boxShadow: '0 0 40px #00ffff60, 0 0 60px #ff00ff40',
            transform: 'scale(1.02)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        glow: {
          '0%': { 
            textShadow: '0 0 10px #00ffff40, 0 0 20px #ff00ff20',
          },
          '100%': { 
            textShadow: '0 0 20px #00ffff60, 0 0 30px #ff00ff40',
          },
        },
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for neon utilities
    function({ addUtilities }) {
      const neonUtilities = {
        '.neon-text': {
          textShadow: '0 0 10px currentColor',
        },
        '.neon-border': {
          border: '1px solid currentColor',
          boxShadow: '0 0 10px currentColor',
        },
        '.glass-effect': {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.dark-glass': {
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      };
      
      addUtilities(neonUtilities, ['responsive', 'hover']);
    },
  ],
};
