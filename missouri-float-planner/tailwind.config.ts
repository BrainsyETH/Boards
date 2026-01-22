import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ozark Float Planner Color Palette
        // Deep navy/purple baseline
        ozark: {
          900: '#1a1a2e',
          800: '#16213e',
          700: '#1f3460',
          600: '#2d4a7c',
          500: '#3d5a80',
        },
        // Teal/blue river water
        river: {
          900: '#134e4a',
          800: '#115e59',
          700: '#0f766e',
          600: '#14b8a6',
          500: '#2dd4bf',
          400: '#5eead4',
          300: '#99f6e4',
          200: '#ccfbf1',
        },
        // Muted Ozark greens
        forest: {
          900: '#1a2e1a',
          800: '#22543d',
          700: '#276749',
          600: '#38a169',
          500: '#48bb78',
          400: '#68d391',
        },
        // Warm coral/pink accents
        sunset: {
          900: '#9d174d',
          800: '#be185d',
          700: '#db2777',
          600: '#ec4899',
          500: '#f472b6',
          400: '#f9a8d4',
          300: '#fbcfe8',
        },
        // Warm golden highlights
        golden: {
          900: '#92400e',
          800: '#b45309',
          700: '#d97706',
          600: '#f59e0b',
          500: '#fbbf24',
          400: '#fcd34d',
        },
        // Limestone bluff grays
        bluff: {
          900: '#1c1917',
          800: '#292524',
          700: '#44403c',
          600: '#57534e',
          500: '#78716c',
          400: '#a8a29e',
          300: '#d6d3d1',
          200: '#e7e5e4',
          100: '#f5f5f4',
          50: '#fafaf9',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-ozark': 'linear-gradient(180deg, var(--tw-gradient-stops))',
        'gradient-sunset': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f766e 70%, #f472b6 100%)',
        'gradient-river': 'linear-gradient(180deg, #14b8a6 0%, #0f766e 50%, #115e59 100%)',
        'gradient-hero': 'linear-gradient(180deg, #fbcfe8 0%, #fcd34d 15%, #5eead4 40%, #0f766e 70%, #16213e 90%, #1a1a2e 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(45, 212, 191, 0.3)',
        'glow-sunset': '0 0 20px rgba(244, 114, 182, 0.3)',
        'card': '0 4px 6px -1px rgba(26, 26, 46, 0.1), 0 2px 4px -2px rgba(26, 26, 46, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(26, 26, 46, 0.15), 0 4px 6px -4px rgba(26, 26, 46, 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
