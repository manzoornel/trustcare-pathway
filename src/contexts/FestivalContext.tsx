
import React, { createContext, useContext, useState, useEffect } from 'react';

type FestivalType = 'default' | 'eid' | 'ramzan' | 'onam' | 'deepavali' | 'health' | 'xmas';

interface FestivalContextType {
  activeFestival: FestivalType;
  setActiveFestival: (festival: FestivalType) => void;
}

const FestivalContext = createContext<FestivalContextType>({
  activeFestival: 'default',
  setActiveFestival: () => {},
});

export const FestivalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFestival, setActiveFestival] = useState<FestivalType>('default');

  // Check if there's a saved festival preference
  useEffect(() => {
    const savedFestival = localStorage.getItem('activeFestival');
    if (savedFestival) {
      setActiveFestival(savedFestival as FestivalType);
    }
  }, []);

  // Save festival preference when changed
  useEffect(() => {
    localStorage.setItem('activeFestival', activeFestival);
  }, [activeFestival]);

  const value = {
    activeFestival,
    setActiveFestival,
  };

  return <FestivalContext.Provider value={value}>{children}</FestivalContext.Provider>;
};

export const useFestival = () => useContext(FestivalContext);
