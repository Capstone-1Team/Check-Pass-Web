import { createContext, useContext, useState } from "react";

interface Theme {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface ModeProviderProps {
  children: React.ReactNode;
}

const initialMode: Theme = {
  isDarkMode: false,
  toggleTheme: () => {},
};

const DarkModeContext = createContext<Theme>(initialMode);

export const useTheme = () => {
  return useContext(DarkModeContext);
};

export const DarkModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((mode) => !mode);
  };

  return <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</DarkModeContext.Provider>;
};
