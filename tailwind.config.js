/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--bg)",
        surface: "var(--bg-surface)",
        sheet: "var(--bg-sheet)",
        ink: {
          DEFAULT: "var(--ink)",
          secondary: "var(--ink-secondary)",
          muted: "var(--ink-muted)",
          tertiary: "var(--ink-tertiary)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          hover: "var(--brand-hover)",
          tint: "var(--brand-tint)",
        },
        terracotta: {
          DEFAULT: "var(--terracotta)",
          tint: "var(--terracotta-tint)",
        },
        sage: {
          DEFAULT: "#4a6352",
          tint: "rgba(74, 99, 82, 0.08)",
        },
      },
      fontFamily: {
        serif: ["'Instrument Serif'", "Newsreader", "Georgia", "serif"],
        sans: ["Geist", "'Plus Jakarta Sans'", "-apple-system", "sans-serif"],
        mono: ["'Geist Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        bezel: "var(--radius-bezel)",
        core: "var(--radius-core)",
      },
      boxShadow: {
        'bezel': '0 20px 48px -12px rgba(14, 32, 23, 0.08), 0 1px 3px rgba(14, 32, 23, 0.04)',
        'soft': '0 12px 32px -8px rgba(14, 32, 23, 0.05)',
      },
    },
  },
  plugins: [],
}
