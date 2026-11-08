import { createContext, useContext } from "react";

export const AdminThemeContext = createContext(null);

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used inside AdminThemeProvider");
  }
  return context;
}
