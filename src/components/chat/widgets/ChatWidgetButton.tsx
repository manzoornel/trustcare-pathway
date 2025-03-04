
import React from 'react';
import { Button } from "@/components/ui/button";

interface ChatWidgetButtonProps {
  onClick: () => void;
}

const ChatWidgetButton = ({ onClick }: ChatWidgetButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={onClick} 
        className="rounded-full w-14 h-14 bg-blue-700 hover:bg-blue-800 flex items-center justify-center shadow-lg"
      >
        <img 
          src="/lovable-uploads/c4beddef-b77c-4f28-8e9b-8f2f43be79e6.png" 
          alt="Doctor Uncle AI" 
          className="h-10 w-10" 
        />
      </Button>
    </div>
  );
};

export default ChatWidgetButton;
