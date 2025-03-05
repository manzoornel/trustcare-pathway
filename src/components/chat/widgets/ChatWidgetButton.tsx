
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';

interface ChatWidgetButtonProps {
  onClick: () => void;
}

const ChatWidgetButton = ({ onClick }: ChatWidgetButtonProps) => {
  const { theme } = useTheme();
  
  // Theme-specific button colors
  const getButtonBgColor = () => {
    switch(theme) {
      case 'eid':
        return 'bg-[#24936E] hover:bg-[#24936E]/80';
      case 'ramzan':
        return 'bg-[#3A6351] hover:bg-[#3A6351]/80';
      case 'onam':
        return 'bg-[#F97316] hover:bg-[#F97316]/80';
      case 'deepavali':
        return 'bg-[#9B4DCA] hover:bg-[#9B4DCA]/80';
      case 'health':
        return 'bg-[#2196F3] hover:bg-[#2196F3]/80';
      case 'xmas':
        return 'bg-[#D32F2F] hover:bg-[#D32F2F]/80';
      default:
        return 'bg-blue-700 hover:bg-blue-800';
    }
  };
  
  const buttonBgColor = getButtonBgColor();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={onClick} 
        className={`rounded-full w-14 h-14 ${buttonBgColor} flex items-center justify-center shadow-lg`}
      >
        <img 
          src="/lovable-uploads/ae63c3bf-5d6c-4576-8d59-1311ca468c30.png" 
          alt="Doctor Uncle AI" 
          className="h-10 w-10" 
        />
      </Button>
    </div>
  );
};

export default ChatWidgetButton;
