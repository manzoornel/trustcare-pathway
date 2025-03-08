
import React, { createContext, useContext, useState, ReactNode } from 'react';

type FestivalType = 'default' | 'christmas' | 'newyear' | 'thanksgiving' | 'halloween';

interface FestivalContextType {
  activeFestival: FestivalType;
  setActiveFestival: (festival: FestivalType) => void;
}

const defaultFestivalContext: FestivalContextType = {
  activeFestival: 'default',
  setActiveFestival: () => {}
};

const FestivalContext = createContext<FestivalContextType>(defaultFestivalContext);

export const useFestival = () => useContext(FestivalContext);

interface FestivalProviderProps {
  children: ReactNode;
}

export const FestivalProvider = ({ children }: FestivalProviderProps) => {
  const [activeFestival, setActiveFestival] = useState<FestivalType>('default');

  const value = {
    activeFestival,
    setActiveFestival
  };

  return (
    <FestivalContext.Provider value={value}>
      {children}
    </FestivalContext.Provider>
  );
};
