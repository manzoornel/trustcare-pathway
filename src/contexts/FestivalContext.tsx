
import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_CHANGE_EVENT } from './ThemeContext';

// Festival types
export type FestivalType = 'default' | 'christmas' | 'eid' | 'onam' | 'deepavali' | 'ramzan';

// Festival context type
type FestivalContextType = {
  activeFestival: FestivalType;
  setActiveFestival: (festival: FestivalType) => void;
};

// Create the context
const FestivalContext = createContext<FestivalContextType | undefined>(undefined);

// Provider props
type FestivalProviderProps = {
  children: React.ReactNode;
};

export const FestivalProvider: React.FC<FestivalProviderProps> = ({ children }) => {
  // Get saved festival or use default
  const [activeFestival, setActiveFestivalState] = useState<FestivalType>(() => {
    try {
      const savedFestival = localStorage.getItem('docUncleFestival');
      return (savedFestival as FestivalType) || 'default';
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 'default';
    }
  });

  // Set festival with persistence
  const setActiveFestival = (festival: FestivalType) => {
    try {
      localStorage.setItem('docUncleFestival', festival);
      setActiveFestivalState(festival);
      
      // Dispatch a custom event to notify all components about the festival change
      const festivalEvent = new CustomEvent('festivalChanged', { detail: { festival } });
      window.dispatchEvent(festivalEvent);
    } catch (error) {
      console.error('Error saving festival to localStorage:', error);
    }
  };

  // Listen for theme changes to update festival accordingly
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail && event.detail.theme) {
        // Map theme names to festivals if needed
        const themeToFestival: Record<string, FestivalType> = {
          'xmas': 'christmas',
          'eid': 'eid',
          'onam': 'onam',
          'deepavali': 'deepavali',
          'ramzan': 'ramzan',
          'default': 'default',
        };
        
        const newFestival = themeToFestival[event.detail.theme] || 'default';
        if (newFestival !== activeFestival) {
          setActiveFestivalState(newFestival);
        }
      }
    };
    
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, [activeFestival]);

  return (
    <FestivalContext.Provider value={{ activeFestival, setActiveFestival }}>
      {children}
    </FestivalContext.Provider>
  );
};

// Custom hook to use the festival context
export const useFestival = (): FestivalContextType => {
  const context = useContext(FestivalContext);
  if (context === undefined) {
    throw new Error('useFestival must be used within a FestivalProvider');
  }
  return context;
};
