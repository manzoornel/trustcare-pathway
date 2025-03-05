
import React, { createContext, useContext, useState, useEffect } from 'react';

// Available themes
export type ThemeType = 'default' | 'eid' | 'onam' | 'health' | 'xmas';

// Theme color properties
type ThemeColors = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  festivalPrimary: string;
  festivalSecondary: string;
  festivalAccent: string;
  festivalLight: string;
  festivalDark: string;
};

// Theme definitions with their color schemes
const themeColors: Record<ThemeType, ThemeColors> = {
  default: {
    primary: '#00C6C6',
    primaryForeground: '#FFFFFF',
    secondary: '#2D3B41',
    secondaryForeground: '#FFFFFF',
    accent: '#004F9F',
    accentForeground: '#FFFFFF',
    muted: '#F0F0F0',
    mutedForeground: '#666666',
    festivalPrimary: '#00C6C6',
    festivalSecondary: '#2D3B41',
    festivalAccent: '#004F9F',
    festivalLight: '#F0F0F0',
    festivalDark: '#2D3B41',
  },
  eid: {
    primary: '#24936E',
    primaryForeground: '#FFFFFF',
    secondary: '#4A3933',
    secondaryForeground: '#FFFFFF',
    accent: '#D4AF37',
    accentForeground: '#000000',
    muted: '#F5F5F5',
    mutedForeground: '#666666',
    festivalPrimary: '#24936E', // Green
    festivalSecondary: '#D4AF37', // Gold
    festivalAccent: '#7B5D2F', // Brown gold
    festivalLight: '#F8F0DD', // Light cream
    festivalDark: '#4A3933', // Dark brown
  },
  onam: {
    primary: '#F97316', // Orange
    primaryForeground: '#FFFFFF',
    secondary: '#2E7D32', // Green
    secondaryForeground: '#FFFFFF',
    accent: '#FFD700', // Yellow
    accentForeground: '#000000',
    muted: '#FEF7CD', // Light Yellow
    mutedForeground: '#666666',
    festivalPrimary: '#F97316', // Orange
    festivalSecondary: '#2E7D32', // Green
    festivalAccent: '#FFD700', // Yellow
    festivalLight: '#FEF7CD', // Light Yellow
    festivalDark: '#8D4004', // Dark Orange
  },
  health: {
    primary: '#2196F3', // Blue
    primaryForeground: '#FFFFFF',
    secondary: '#E91E63', // Pink
    secondaryForeground: '#FFFFFF',
    accent: '#4CAF50', // Green
    accentForeground: '#FFFFFF',
    muted: '#E3F2FD', // Light Blue
    mutedForeground: '#666666',
    festivalPrimary: '#2196F3', // Blue
    festivalSecondary: '#E91E63', // Pink
    festivalAccent: '#4CAF50', // Green
    festivalLight: '#E3F2FD', // Light Blue
    festivalDark: '#0D47A1', // Dark Blue
  },
  xmas: {
    primary: '#D32F2F', // Red
    primaryForeground: '#FFFFFF',
    secondary: '#388E3C', // Green
    secondaryForeground: '#FFFFFF',
    accent: '#FFC107', // Gold
    accentForeground: '#000000',
    muted: '#FFEBEE', // Light Red
    mutedForeground: '#666666',
    festivalPrimary: '#D32F2F', // Red
    festivalSecondary: '#388E3C', // Green
    festivalAccent: '#FFC107', // Gold
    festivalLight: '#FFEBEE', // Light Red
    festivalDark: '#B71C1C', // Dark Red
  },
};

// Theme context type
type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isThemeChanging: boolean;
};

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get saved theme or use default
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('docUncleTheme');
    return (savedTheme as ThemeType) || 'default';
  });
  
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  // Set theme with animation transition
  const setTheme = (newTheme: ThemeType) => {
    setIsThemeChanging(true);
    setTimeout(() => {
      setThemeState(newTheme);
      localStorage.setItem('docUncleTheme', newTheme);
      setTimeout(() => {
        setIsThemeChanging(false);
      }, 500);
    }, 300);
  };

  // Update CSS variables when theme changes
  useEffect(() => {
    const colors = themeColors[theme];
    
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-primary-foreground', colors.primaryForeground);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-secondary-foreground', colors.secondaryForeground);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
    document.documentElement.style.setProperty('--color-accent-foreground', colors.accentForeground);
    document.documentElement.style.setProperty('--color-muted', colors.muted);
    document.documentElement.style.setProperty('--color-muted-foreground', colors.mutedForeground);
    
    // Festival specific colors
    document.documentElement.style.setProperty('--festival-primary', colors.festivalPrimary);
    document.documentElement.style.setProperty('--festival-secondary', colors.festivalSecondary);
    document.documentElement.style.setProperty('--festival-accent', colors.festivalAccent);
    document.documentElement.style.setProperty('--festival-light', colors.festivalLight);
    document.documentElement.style.setProperty('--festival-dark', colors.festivalDark);
    
    // Add theme-specific class to body
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isThemeChanging }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
