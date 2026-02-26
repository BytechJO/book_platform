import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1f3c88",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin", // Firefox
        },
        "*::-webkit-scrollbar": {
          width: "8px",
        },
        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#2D5B9E",
          borderRadius: "20px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#2D5B9E",
        },
      },
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
