export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-strong": "var(--color-primary-strong)",
        "primary-soft": "var(--color-primary-soft)",
        secondary: "var(--color-secondary)",
        "secondary-soft": "var(--color-secondary-soft)",
        text: "var(--color-text)",
        "text-strong": "var(--color-text-strong)",
        "text-muted": "var(--color-text-muted)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)"
      },
      fontFamily: {
        sans: ["Funnel Sans", "Manrope", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
