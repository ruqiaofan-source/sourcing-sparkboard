import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "dark", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("equilinq-theme") as Theme) || "dark";
    }
    return "dark";
  });

  const isPublicThemeRoute = useMemo(() => {
    const publicRoutes = new Set([
      "/",
      "/contact",
      "/insights",
      "/customization",
      "/pricing",
      "/quality-control",
      "/oem-odm",
      "/how-it-works",
      "/demo",
      "/sourcing-guide",
      "/trending",
      "/privacy",
      "/cookies",
    ]);

    return (
      publicRoutes.has(location.pathname) ||
      location.pathname.startsWith("/insights/") ||
      location.pathname.startsWith("/how-it-works/") ||
      location.pathname.startsWith("/trending/")
    );
  }, [location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme: Theme = isPublicThemeRoute ? "dark" : theme;

    if (resolvedTheme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("equilinq-theme", theme);
  }, [theme, isPublicThemeRoute]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
