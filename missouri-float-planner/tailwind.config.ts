import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // =========================================
        // Eddy the Otter — Neo-Brutalist Theme
        // Bold, flat, chunky with thick black outlines
        // Palette from mascot: Adventure Night, Bluewater,
        // Green Treeline, Neon Pink (#F07052)
        // =========================================

        // Primary — Adventure Night (#161748) deep indigo-navy
        primary: {
          50: '#EEEEF8',
          100: '#D5D5ED',
          200: '#ABABDB',
          300: '#8181C9',
          400: '#5757B7',
          500: '#3D3D9E', // Base mid-tone
          600: '#2D2D7A',
          700: '#222260',
          800: '#1C1C54',
          900: '#161748', // Brand dark
        },

        // Secondary — Bluewater (#39a0ca) river blue
        secondary: {
          50: '#EBF6FB',
          100: '#D0EAF5',
          200: '#A1D5EB',
          300: '#72C0E1',
          400: '#52B0D8',
          500: '#39A0CA', // Base
          600: '#2E80A2',
          700: '#236079',
          800: '#184051',
          900: '#0D2028',
        },

        // Accent — Neon Pink / Sunset Coral (#F07052)
        accent: {
          50: '#FEF5F3',
          100: '#FDE7E1',
          200: '#FACABD',
          300: '#F7AC9A',
          400: '#F48E76',
          500: '#F07052', // Base — Eddy's sunglasses
          600: '#E5573F',
          700: '#CC3E2B',
          800: '#A33122',
          900: '#7A2419',
        },

        // Support — Green Treeline (#478559) forest green
        support: {
          50: '#EDF5EF',
          100: '#D4E8D9',
          200: '#A9D1B3',
          300: '#7EBA8D',
          400: '#5FA774',
          500: '#478559', // Base
          600: '#396B47',
          700: '#2B5135',
          800: '#1D3724',
          900: '#0F1D12',
        },

        // Neutrals — Cool-toned for Neo-Brutalist contrast
        neutral: {
          50: '#F8F8FA',
          100: '#EDEDF0',
          200: '#DCDCE2',
          300: '#C4C4CE',
          400: '#9E9EAD',
          500: '#78788A',
          600: '#5C5C6E',
          700: '#454556',
          800: '#33333F',
          900: '#22222C',
          950: '#16161E',
        },

        // Semantic shorthand colors
        background: '#F8F8FA',   // neutral-50 — clean white-ish
        surface: '#FFFFFF',
        success: '#478559',      // support-500
        warning: '#E5A000',
        error: '#DC2626',
        info: '#39A0CA',         // secondary-500
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.15' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
      },
      borderWidth: {
        'thin': '1px',
        'base': '2px',
        'thick': '3px',
        'chunky': '4px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      backgroundImage: {
        // Neo-Brutalist: flat colors preferred, but keep subtle options
        'gradient-page': 'none',
        'gradient-primary': 'none',
        'gradient-accent': 'none',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'spin-slow': 'spin 1.5s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
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
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        // Neo-Brutalist shadows — hard black offsets, no blur
        'xs': '1px 1px 0 #22222C',
        'sm': '2px 2px 0 #22222C',
        'md': '3px 3px 0 #22222C',
        'lg': '4px 4px 0 #22222C',
        'xl': '6px 6px 0 #22222C',

        // Soft variants for less aggressive contexts
        'soft-sm': '0 1px 3px rgba(22, 22, 30, 0.12)',
        'soft-md': '0 4px 6px rgba(22, 22, 30, 0.12)',
        'soft-lg': '0 10px 15px rgba(22, 22, 30, 0.12)',

        // Colored shadows for brand emphasis
        'accent': '3px 3px 0 #E5573F',
        'primary': '3px 3px 0 #161748',
        'water': '3px 3px 0 #2E80A2',

        // Inset for pressed states
        'inset': 'inset 2px 2px 4px rgba(22, 22, 30, 0.2)',
      },
      transitionDuration: {
        '0': '0ms',
        'fast': '100ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '500ms',
      },
    },
  },
  plugins: [],
};
export default config;
