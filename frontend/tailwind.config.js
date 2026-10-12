/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px', // Full HD / 2K
        '4k': '2560px',  // Ultra HD / 4K
      },
      colors: {
        game: {
          bg: "#0B0F19",
          card: "#161F30",
          border: "#2A364F",
          neonCyan: "#00F0FF",
          neonPurple: "#A855F7",
          neonPink: "#FF007F",
          neonYellow: "#FEE75C",
          neonGreen: "#10B981",
        }
      },
      fontFamily: {
        game: ['"Orbitron"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '4k-neon': '0 0 35px rgba(0, 240, 255, 0.35)',
        '4k-pink': '0 0 35px rgba(255, 0, 127, 0.35)',
        '4k-purple': '0 0 35px rgba(168, 85, 247, 0.35)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.7))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.3))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
