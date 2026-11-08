import { createContext, useContext } from "react";

export const TeacherThemeContext = createContext(null);

export function useTeacherTheme() {
  const context = useContext(TeacherThemeContext);
  if (!context) {
    throw new Error("useTeacherTheme must be used inside TeacherThemeProvider");
  }
  return context;
}
