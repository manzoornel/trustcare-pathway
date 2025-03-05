
import React from 'react';
import { useTheme, ThemeType } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Flower, Heart, Gift } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, isThemeChanging } = useTheme();

  const themes: Array<{ id: ThemeType; label: string; icon: React.ReactNode }> = [
    { id: 'default', label: 'Default', icon: <Sun className="h-4 w-4" /> },
    { id: 'eid', label: 'Eid', icon: <Moon className="h-4 w-4" /> },
    { id: 'onam', label: 'Onam', icon: <Flower className="h-4 w-4" /> },
    { id: 'health', label: 'Health Day', icon: <Heart className="h-4 w-4" /> },
    { id: 'xmas', label: 'Xmas', icon: <Gift className="h-4 w-4" /> },
  ];

  return (
    <div className={`fixed top-20 right-6 z-50 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-2 transition-opacity duration-300 ${isThemeChanging ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex flex-col gap-2">
        {themes.map((t) => (
          <Button
            key={t.id}
            variant={theme === t.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme(t.id)}
            className={`flex items-center justify-start gap-2 w-full ${theme === t.id ? 'bg-festival-primary text-white' : ''}`}
          >
            {t.icon}
            <span className="text-xs">{t.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
