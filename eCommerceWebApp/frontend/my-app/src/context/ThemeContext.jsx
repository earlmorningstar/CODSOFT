import { createContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { darkTheme } from "../utils/theme";

const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => {
    return mode === "dark" ? darkTheme : createTheme();
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
