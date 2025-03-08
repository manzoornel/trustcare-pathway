
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Snowflake } from 'lucide-react';
import { useFestival } from '@/contexts/FestivalContext';

const HeroSection = () => {
  const { theme } = useTheme();
  const { activeFestival } = useFestival();

  const renderDecoration = () => {
    if (!activeFestival || activeFestival === "default") {
      return null;
    }

    if (activeFestival === "christmas" && theme === "xmas") {
      return (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-start gap-4">
            {[...Array(30)].map((_, i) => (
              <Snowflake key={i} className="text-white animate-fall" style={{
                fontSize: `${Math.random() * 2 + 1}rem`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 5 + 5}s`,
                animationDelay: `${Math.random() * 5}s`
              }} />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative">
      {renderDecoration()}
    </div>
  );
};

export default HeroSection;
