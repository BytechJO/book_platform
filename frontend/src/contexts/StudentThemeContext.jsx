import { useMemo, useState } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { StudentThemeContext } from "./studentTheme";

const STORAGE_KEY = "student-theme-mode";

export function StudentThemeProvider({ children }) {
  const [mode, setMode] = useState(() =>
    localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light",
  );

  const changeMode = (nextMode) => {
    const safeMode = nextMode === "dark" ? "dark" : "light";
    setMode(safeMode);
    localStorage.setItem(STORAGE_KEY, safeMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#8ab4f8" : "#1A4D96" },
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
        typography: { fontFamily: '"Inter", sans-serif' },
        components: {
          MuiPaper: {
            styleOverrides: { root: { backgroundImage: "none" } },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode],
  );

  const value = useMemo(() => ({ mode, changeMode }), [mode]);

  return (
    <StudentThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StudentThemeContext.Provider>
  );
}
