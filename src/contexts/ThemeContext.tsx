import React, { createContext, useContext, useState, useEffect } from 'react';

// Available themes
export type ThemeType = 'default' | 'eid' | 'onam' | 'health' | 'xmas' | 'ramzan' | 'deepavali';

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
    festivalPrimary: '#24936E',
    festivalSecondary: '#D4AF37',
    festivalAccent: '#7B5D2F',
    festivalLight: '#F8F0DD',
    festivalDark: '#4A3933',
  },
  onam: {
    primary: '#F97316',
    primaryForeground: '#FFFFFF',
    secondary: '#2E7D32',
    secondaryForeground: '#FFFFFF',
    accent: '#FFD700',
    accentForeground: '#000000',
    muted: '#FEF7CD',
    mutedForeground: '#666666',
    festivalPrimary: '#F97316',
    festivalSecondary: '#2E7D32',
    festivalAccent: '#FFD700',
    festivalLight: '#FEF7CD',
    festivalDark: '#8D4004',
  },
  health: {
    primary: '#2196F3',
    primaryForeground: '#FFFFFF',
    secondary: '#E91E63',
    secondaryForeground: '#FFFFFF',
    accent: '#4CAF50',
    accentForeground: '#FFFFFF',
    muted: '#E3F2FD',
    mutedForeground: '#666666',
    festivalPrimary: '#2196F3',
    festivalSecondary: '#E91E63',
    festivalAccent: '#4CAF50',
    festivalLight: '#E3F2FD',
    festivalDark: '#0D47A1',
  },
  xmas: {
    primary: '#D32F2F',
    primaryForeground: '#FFFFFF',
    secondary: '#388E3C',
    secondaryForeground: '#FFFFFF',
    accent: '#FFC107',
    accentForeground: '#000000',
    muted: '#FFEBEE',
    mutedForeground: '#666666',
    festivalPrimary: '#D32F2F',
    festivalSecondary: '#388E3C',
    festivalAccent: '#FFC107',
    festivalLight: '#FFEBEE',
    festivalDark: '#B71C1C',
  },
  ramzan: {
    primary: '#3A6351',
    primaryForeground: '#FFFFFF',
    secondary: '#6D9886',
    secondaryForeground: '#FFFFFF',
    accent: '#F0CAA3',
    accentForeground: '#000000',
    muted: '#F7F7F7',
    mutedForeground: '#666666',
    festivalPrimary: '#3A6351',
    festivalSecondary: '#6D9886',
    festivalAccent: '#F0CAA3',
    festivalLight: '#F7F7F7',
    festivalDark: '#3A6351',
  },
  deepavali: {
    primary: '#9B4DCA',
    primaryForeground: '#FFFFFF',
    secondary: '#F39C12',
    secondaryForeground: '#FFFFFF',
    accent: '#FFC300',
    accentForeground: '#000000',
    muted: '#F1E5F9',
    mutedForeground: '#666666',
    festivalPrimary: '#9B4DCA',
    festivalSecondary: '#F39C12',
    festivalAccent: '#FFC300',
    festivalLight: '#F1E5F9',
    festivalDark: '#6A1B9A',
  },
};

// Theme context type
type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isThemeChanging: boolean;
  isAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin on mount
  useEffect(() => {
    const checkAdmin = () => {
      const adminRole = localStorage.getItem('adminRole');
      setIsAdmin(adminRole === 'admin');
    };
    
    checkAdmin();
    
    // Listen for admin login/logout events
    window.addEventListener('adminStatusChanged', checkAdmin);
    
    return () => {
      window.removeEventListener('adminStatusChanged', checkAdmin);
    };
  }, []);

  // Set theme with animation transition
  const setTheme = (newTheme: ThemeType) => {
    // Only allow theme change if user is admin
    if (!isAdmin) {
      console.warn('Only admin users can change the theme');
      return;
    }
    
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
    <ThemeContext.Provider value={{ theme, setTheme, isThemeChanging, isAdmin }}>
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
