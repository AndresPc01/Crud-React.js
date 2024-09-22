
import { nextui } from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-color-button": "var(--color-background-button-default)",
        "hover-color-button": "var(--color-hover-button)",
        "background-header": "var(--color-background-header-mode-dark)",
        "background-sidebar":"var(--color-background-sidebar-mode-dark)",
      },
    },
  },
  darkMode: "class", // Modo oscuro habilitado
  plugins: [nextui()],
}
