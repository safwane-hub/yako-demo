import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {50:"#E8FFF5",100:"#CFFFEA",200:"#9FFFD5",300:"#6FFFC1",400:"#3FFFAC",500:"#00F598",600:"#00C27A",700:"#00925C",800:"#00613D",900:"#00311F"},
        darkbg:"#0B0F14"
      },
      borderRadius: { xl:"1rem","2xl":"1.5rem" },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'IBM Plex Sans Arabic', 'Segoe UI', 'sans-serif'],
      }
    }
  },
  plugins: []
};
export default config;
