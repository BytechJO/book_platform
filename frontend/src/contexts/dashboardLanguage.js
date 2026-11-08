import { createContext, useContext } from "react";

export const DashboardLanguageContext = createContext(null);

export function useDashboardLanguage() {
  const context = useContext(DashboardLanguageContext);
  if (!context) {
    throw new Error("useDashboardLanguage must be used inside DashboardLanguageProvider");
  }
  return context;
}
