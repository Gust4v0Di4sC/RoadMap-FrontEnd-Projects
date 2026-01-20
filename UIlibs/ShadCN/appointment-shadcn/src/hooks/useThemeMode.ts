import * as React from "react";

type ThemeMode = "light" | "dark";

function getInitialMode(): ThemeMode {
  const saved = localStorage.getItem("theme") as ThemeMode | null;
  if (saved === "light" || saved === "dark") return saved;

  // fallback: sistema
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function useThemeMode() {
  const [mode, setMode] = React.useState<ThemeMode>(() => getInitialMode());

  React.useEffect(() => {
    const root = document.documentElement; // <html />
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", mode);
  }, [mode]);

  return {
    mode,
    setMode,
    toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
  };
}
