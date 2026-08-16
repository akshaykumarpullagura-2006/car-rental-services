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
        main: '#F5F5F3',
        surface: '#FFFFFF',
        primary: '#111111',
        secondary: '#666666',
        borderLight: '#E5E5E5',
        mutedBg: '#F0F0EE',
        gold: {
          50: '#FDFBF0',
          100: '#F7F0D0',
          200: '#EFE099',
          300: '#E5C158',
          400: '#D4AF37', // Primary Luxury Gold Accent
          500: '#C5A059',
          600: '#AA7C11',
          700: '#865E0C',
          800: '#64440B',
          900: '#48300A',
          950: '#291A04',
        },
        dark: {
          50: '#1e212b',
          100: '#181b24',
          200: '#14161f',
          300: '#10121a',
          400: '#0d0f16',
          500: '#0b0c10',
          600: '#08090c',
          700: '#050608',
          800: '#030405',
          900: '#010102',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          medium: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(229, 229, 229, 0.8)',
          gold: 'rgba(212, 175, 55, 0.12)',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Inter', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        'gold-gradient': 'linear-gradient(135deg, #F7F0D0 0%, #D4AF37 50%, #AA7C11 100%)',
        'dark-card': 'linear-gradient(180deg, rgba(26, 29, 40, 0.8) 0%, rgba(13, 15, 22, 0.9) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
