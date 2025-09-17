/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './Components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))',
        },
        foreground: {
          DEFAULT: 'hsl(var(--foreground))',
          muted: 'hsl(var(--foreground-muted))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          secondary: 'hsl(var(--accent-secondary))',
          tertiary: 'hsl(var(--accent-tertiary))',
        },
        glass: {
          DEFAULT: 'hsl(var(--glass))',
          border: 'hsl(var(--glass-border))',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, hsl(var(--background)), hsl(var(--background-secondary)))',
        'gradient-glow': 'radial-gradient(circle at center, hsl(var(--primary-glow) / 0.15), transparent 70%)',
        'gradient-mesh': 'conic-gradient(from 180deg at 50% 50%, hsl(var(--accent) / 0.1), hsl(var(--accent-secondary) / 0.1), hsl(var(--accent-tertiary) / 0.1))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'typewriter': 'typewriter 3s steps(40) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '50%': { width: '100%' },
          '100%': { width: '0' },
        },
        glowPulse: {
          '0%': { textShadow: '0 0 5px hsl(var(--primary-glow)), 0 0 10px hsl(var(--primary-glow))' },
          '100%': { textShadow: '0 0 10px hsl(var(--primary-glow)), 0 0 20px hsl(var(--primary-glow)), 0 0 30px hsl(var(--primary-glow))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px hsl(var(--primary-glow) / 0.3)',
        'glow-lg': '0 0 40px hsl(var(--primary-glow) / 0.4)',
        'glow-xl': '0 0 60px hsl(var(--primary-glow) / 0.3)',
        'glass': '0 8px 32px hsl(var(--glass) / 0.1)',
        'glass-lg': '0 16px 64px hsl(var(--glass) / 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
