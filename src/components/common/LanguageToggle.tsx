import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs px-3 py-1 h-7"
      >
        EN
      </Button>
      <Button
        variant={language === 'ml' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('ml')}
        className="text-xs px-3 py-1 h-7"
      >
        മലയാളം
      </Button>
    </div>
  );
};