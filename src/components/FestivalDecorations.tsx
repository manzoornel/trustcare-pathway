
import React, { useEffect, useState } from 'react';
import { useTheme, ThemeType, THEME_CHANGE_EVENT } from '@/contexts/ThemeContext';
import { Star, Moon, Flower, Heart, Gift, Snowflake, FlowerIcon, Sparkles } from 'lucide-react';

const FestivalDecorations: React.FC = () => {
  const { theme } = useTheme();
  const [localTheme, setLocalTheme] = useState<ThemeType>(theme);
  
  // Update local theme when global theme changes
  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  // Listen for theme changes from other components
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail && event.detail.theme) {
        console.log('FestivalDecorations: detected theme change:', event.detail.theme);
        setLocalTheme(event.detail.theme);
      }
    };
    
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);
  
  if (localTheme === 'default') return null;
  
  const renderDecorations = () => {
    switch (localTheme) {
      case 'eid':
        return (
          <>
            <div className="fixed top-20 left-10 z-10 text-festival-primary opacity-40 animate-float">
              <Moon size={40} />
            </div>
            <div className="fixed bottom-20 right-10 z-10 text-festival-secondary opacity-30 animate-float" style={{ animationDelay: '1s' }}>
              <Star size={40} />
            </div>
            <div className="fixed top-40 right-20 z-10 text-festival-accent opacity-20 animate-float" style={{ animationDelay: '2s' }}>
              <Star size={30} />
            </div>
          </>
        );
        
      case 'ramzan':
        return (
          <>
            <div className="fixed top-20 left-10 z-10 text-festival-primary opacity-40 animate-float">
              <Star size={40} />
            </div>
            <div className="fixed bottom-20 right-10 z-10 text-festival-secondary opacity-30 animate-float" style={{ animationDelay: '1s' }}>
              <Moon size={40} />
            </div>
            <div className="fixed top-40 right-20 z-10 text-festival-accent opacity-20 animate-float" style={{ animationDelay: '2s' }}>
              <Star size={30} />
            </div>
          </>
        );
        
      case 'onam':
        return (
          <>
            <div className="fixed top-20 left-10 z-10 text-festival-primary opacity-40 animate-float">
              <FlowerIcon size={40} />
            </div>
            <div className="fixed bottom-20 right-10 z-10 text-festival-secondary opacity-30 animate-float" style={{ animationDelay: '1s' }}>
              <Flower size={40} />
            </div>
            <div className="fixed top-40 right-20 z-10 text-festival-accent opacity-20 animate-float" style={{ animationDelay: '2s' }}>
              <Flower size={30} />
            </div>
          </>
        );
      
      case 'deepavali':
        return (
          <>
            <div className="fixed top-20 left-10 z-10 text-festival-primary opacity-40 animate-pulse-soft">
              <Sparkles size={40} />
            </div>
            <div className="fixed bottom-20 right-10 z-10 text-festival-secondary opacity-30 animate-pulse-soft" style={{ animationDelay: '1s' }}>
              <Sparkles size={40} />
            </div>
            <div className="fixed top-40 right-20 z-10 text-festival-accent opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}>
              <Sparkles size={30} />
            </div>
          </>
        );
        
      case 'health':
        return (
          <>
            <div className="fixed top-20 left-10 z-10 text-festival-primary opacity-40 animate-pulse-soft">
              <Heart size={40} />
            </div>
            <div className="fixed bottom-20 right-10 z-10 text-festival-secondary opacity-30 animate-pulse-soft" style={{ animationDelay: '1s' }}>
              <Heart size={40} />
            </div>
            <div className="fixed top-40 right-20 z-10 text-festival-accent opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}>
              <Heart size={30} />
            </div>
          </>
        );
        
      case 'xmas':
        return (
          <>
            <div className="fixed top-20 left-10 z-10 text-festival-primary opacity-40 animate-float">
              <Gift size={40} />
            </div>
            <div className="fixed bottom-20 right-10 z-10 text-festival-secondary opacity-30 animate-float" style={{ animationDelay: '1s' }}>
              <Snowflake size={40} />
            </div>
            <div className="fixed top-40 right-20 z-10 text-festival-accent opacity-20 animate-float" style={{ animationDelay: '2s' }}>
              <Gift size={30} />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <div className="festival-decoration-top"></div>
      {renderDecorations()}
      <div className="festival-decoration-bottom"></div>
    </>
  );
};

export default FestivalDecorations;
