
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme, ThemeType, THEME_CHANGE_EVENT } from '@/contexts/ThemeContext';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Flower, Heart, Gift, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

const ThemeManagement = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', label: 'Default', icon: <Sun className="h-5 w-5" />, color: 'bg-[#00C6C6]' },
    { id: 'eid', label: 'Eid', icon: <Moon className="h-5 w-5" />, color: 'bg-[#24936E]' },
    { id: 'ramzan', label: 'Ramzan', icon: <Star className="h-5 w-5" />, color: 'bg-[#3A6351]' },
    { id: 'onam', label: 'Onam', icon: <Flower className="h-5 w-5" />, color: 'bg-[#F97316]' },
    { id: 'deepavali', label: 'Deepavali', icon: <Sparkles className="h-5 w-5" />, color: 'bg-[#9B4DCA]' },
    { id: 'health', label: 'Health Day', icon: <Heart className="h-5 w-5" />, color: 'bg-[#2196F3]' },
    { id: 'xmas', label: 'Xmas', icon: <Gift className="h-5 w-5" />, color: 'bg-[#D32F2F]' },
  ];

  useEffect(() => {
    // Listen for theme changes from other components/tabs
    const handleThemeChange = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail && event.detail.theme) {
        console.log('ThemeManagement: detected theme change:', event.detail.theme);
      }
    };
    
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, []);

  const handleThemeChange = (value: string) => {
    const newTheme = value as ThemeType;
    setTheme(newTheme);
    toast.success(`Theme changed to ${value}`, {
      position: "top-center",
      autoClose: 2000
    });
    console.log('Theme changed to:', newTheme);
    
    // Print to console for debugging
    console.log(`Theme changed to: ${newTheme}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Management</CardTitle>
        <CardDescription>
          Change the website theme based on festivals or seasons. 
          The selected theme will be applied site-wide for all users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> When you change the theme, it will be visible to all visitors on the website. 
            The current active theme is: <span className="font-semibold">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
          </p>
        </div>
        <RadioGroup value={theme} onValueChange={handleThemeChange} className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {themes.map((t) => (
            <div key={t.id} className={cn(
              "flex items-center space-x-2 rounded-md border p-4 cursor-pointer transition-all",
              theme === t.id ? "border-primary bg-primary/5" : "hover:bg-muted"
            )}>
              <RadioGroupItem value={t.id} id={t.id} />
              <Label htmlFor={t.id} className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center space-x-2">
                  <div className={`rounded-full p-1 text-white ${t.color}`}>
                    {t.icon}
                  </div>
                  <span>{t.label}</span>
                </div>
                {theme === t.id && (
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                    Active
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ThemeManagement;
