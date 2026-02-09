import React, { createContext, useContext } from 'react';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  notification: string;
  placeholder: string;
  highlight: string;
  cardShadow: string;
}

// Logo-inspired teal, slightly muted to avoid harsh brightness
const PRIMARY_ACCENT = '#2BBE9A';

// Reactiv.ai inspired dark theme - professional, soothing accent
export const colors: ThemeColors = {
  background: '#000000',
  surface: '#1A1A1A',
  primary: PRIMARY_ACCENT,
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#2D2D2D',
  error: '#FF8F73',
  success: '#57D9A3',
  notification: PRIMARY_ACCENT,
  placeholder: '#262626',
  highlight: '#0D3330',
  cardShadow: 'rgba(0,0,0,0.5)',
};

type ThemeContextValue = {
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue>({ colors });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={{ colors }}>
    {children}
  </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
