import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group flex flex-col items-center justify-center gap-1.5 w-full rounded-xl py-2.5 px-1 transition-all text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/40"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-6 w-6" strokeWidth={1.7} /> : <Moon className="h-6 w-6" strokeWidth={1.7} />}
      {!collapsed && (
        <span className="text-[13px] font-semibold leading-none text-center">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
