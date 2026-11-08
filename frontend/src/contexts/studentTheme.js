import { createContext, useContext } from "react";

export const StudentThemeContext = createContext(null);

export function useStudentTheme() {
  const context = useContext(StudentThemeContext);
  if (!context) {
    throw new Error("useStudentTheme must be used inside StudentThemeProvider");
  }
  return context;
}
