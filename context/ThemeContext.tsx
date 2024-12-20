import React, { createContext, useContext, useState } from 'react';

interface ThemeContextProps {
  isSwitchOn: boolean;
  setIsSwitchOn: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProviderx: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  return (
    <ThemeContext.Provider value={{ isSwitchOn, setIsSwitchOn }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};