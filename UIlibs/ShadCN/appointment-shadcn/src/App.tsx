import * as React from "react";
import SchedulerDashboardPage from "@/pages/SchedulerDashboardPage";
import ProfilePage from "@/pages/ProfilePage";
import { Toaster } from "@/components/ui/sonner";
import { AppButton } from "@/components/ui/app-button";
import { useThemeMode } from "@/hooks/useThemeMode";
import { Moon, Sun } from "lucide-react";

export default function App() {
  const [page, setPage] = React.useState<"dashboard" | "profile">("dashboard");
  const { mode, toggle } = useThemeMode();

  return (
    <>
      {/* Toggle dark mode (top-right) */}
      <div className="fixed right-4 top-4 z-50">
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background/80 shadow-sm backdrop-blur hover:bg-muted"
          aria-label="Toggle theme"
          title={mode === "dark" ? "Modo claro" : "Modo noturno"}
        >
          {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* mini nav */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="rounded-2xl border bg-background/80 p-2 shadow-sm backdrop-blur">
          <div className="flex gap-2">
            <AppButton
              intent={page === "dashboard" ? "primary" : "ghost"}
              className="h-9"
              onClick={() => setPage("dashboard")}
            >
              Agenda
            </AppButton>
            <AppButton
              intent={page === "profile" ? "primary" : "ghost"}
              className="h-9"
              onClick={() => setPage("profile")}
            >
              Perfil
            </AppButton>
          </div>
        </div>
      </div>

      {page === "dashboard" ? <SchedulerDashboardPage /> : <ProfilePage />}

      <Toaster />
    </>
  );
}
