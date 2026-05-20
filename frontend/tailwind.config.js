/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary": "#684000",
        "on-secondary-fixed-variant": "#005049",
        "tertiary-container": "#885500",
        "surface-variant": "#d3e4fe",
        "error": "#ba1a1a",
        "on-tertiary": "#ffffff",
        "on-primary": "#ffffff",
        "surface-container": "#e5eeff",
        "outline": "#777587",
        "tertiary-fixed": "#ffddb8",
        "on-error-container": "#93000a",
        "surface": "#f8f9ff",
        "tertiary-fixed-dim": "#ffb95f",
        "on-primary-container": "#dad7ff",
        "on-surface-variant": "#464555",
        "on-secondary": "#ffffff",
        "on-background": "#0b1c30",
        "on-secondary-fixed": "#00201d",
        "secondary": "#006a61",
        "inverse-surface": "#213145",
        "on-tertiary-container": "#ffd4a4",
        "surface-dim": "#cbdbf5",
        "surface-container-highest": "#d3e4fe",
        "on-tertiary-fixed-variant": "#653e00",
        "secondary-fixed-dim": "#6bd8cb",
        "secondary-container": "#86f2e4",
        "on-error": "#ffffff",
        "surface-bright": "#f8f9ff",
        "inverse-primary": "#c3c0ff",
        "inverse-on-surface": "#eaf1ff",
        "primary-fixed-dim": "#c3c0ff",
        "on-tertiary-fixed": "#2a1700",
        "primary-container": "#4f46e5",
        "background": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "on-secondary-container": "#006f66",
        "surface-tint": "#4d44e3",
        "on-primary-fixed": "#0f0069",
        "on-primary-fixed-variant": "#3323cc",
        "secondary-fixed": "#89f5e7",
        "surface-container-low": "#eff4ff",
        "on-surface": "#0b1c30",
        "primary": "#3525cd",
        "outline-variant": "#c7c4d8",
        "surface-container-high": "#dce9ff",
        "error-container": "#ffdad6",
        "primary-fixed": "#e2dfff"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        base: "8px",
        xl: "64px",
        "container-max": "1280px",
        sm: "12px",
        lg: "40px",
        gutter: "24px",
        md: "24px",
        xs: "4px"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        h1: ["Inter"],
        "label-md": ["Inter"],
        "body-md": ["Inter"],
        h2: ["Inter"],
        "label-sm": ["Inter"],
        "body-lg": ["Inter"],
        h3: ["Inter"]
      },
      fontSize: {
        h1: ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-md": ["14px", { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        h2: ["30px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.04em", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        h3: ["24px", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
