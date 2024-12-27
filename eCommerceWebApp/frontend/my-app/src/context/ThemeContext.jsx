import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return savedTheme === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (respectTheme = true) => {
    const context = useContext(ThemeContext);
    if(context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    if(!respectTheme) {
        return {isDarkMode: false, toggleTheme: () => {}};
    }

    return context;
}
