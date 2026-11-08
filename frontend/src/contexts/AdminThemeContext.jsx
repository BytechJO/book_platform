import { useCallback, useMemo, useRef, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AdminThemeContext } from "./adminTheme";
import { updateUserPreferences, useAuthMe } from "../api";

const STORAGE_KEY = "admin-theme-mode";
export function AdminThemeProvider({ children }) {
  const { user } = useAuthMe();
  const cachedMode = localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  const accountMode = ["light", "dark"].includes(user?.preferred_theme)
    ? user.preferred_theme
    : cachedMode;
  const [pendingMode, setPendingMode] = useState(null);
  const preferenceRequest = useRef(0);
  const mode = pendingMode ?? accountMode;

  const changeMode = useCallback(async (nextMode) => {
    const safeMode = nextMode === "dark" ? "dark" : "light";
    const previousMode = mode;
    const requestId = ++preferenceRequest.current;
    setPendingMode(safeMode);
    localStorage.setItem(STORAGE_KEY, safeMode);

    try {
      await updateUserPreferences({ preferred_theme: safeMode });
      if (requestId === preferenceRequest.current) setPendingMode(null);
    } catch (error) {
      if (requestId === preferenceRequest.current) {
        setPendingMode(null);
        localStorage.setItem(STORAGE_KEY, previousMode);
      }
      console.error("Failed to update theme preference:", error);
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#8ab4f8" : "#1A4D96",
          },
          background: {
            default: mode === "dark" ? "#0f172a" : "#f7f9fc",
            paper: mode === "dark" ? "#182235" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#f1f5f9" : "#172033",
            secondary: mode === "dark" ? "#a9b5c7" : "#667085",
          },
          divider: mode === "dark" ? "rgba(255,255,255,0.12)" : "#e6eaf0",
        },
        typography: {
          fontFamily: '"Inter", sans-serif',
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode],
  );

  const value = useMemo(() => ({ mode, changeMode }), [changeMode, mode]);

  return (
    <AdminThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AdminThemeContext.Provider>
  );
}
