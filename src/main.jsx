import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <App />
    </NextThemesProvider>
  </StrictMode>
);
