
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eraser, Maximize2, X } from "lucide-react";

interface ChatWidgetHeaderProps {
  isFullSize?: boolean;
  onClear: () => void;
  onExpand?: () => void;
  onClose?: () => void;
}

const ChatWidgetHeader = ({ isFullSize = false, onClear, onExpand, onClose }: ChatWidgetHeaderProps) => {
  return (
    <div className={`${isFullSize ? 'p-4' : 'p-3'} bg-blue-700 text-white flex justify-between items-center`}>
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/ae63c3bf-5d6c-4576-8d59-1311ca468c30.png" 
          alt="Doctor Uncle AI" 
          className={isFullSize ? "h-8 w-8" : "h-6 w-6"} 
        />
        <div>
          <h2 className={isFullSize ? "text-xl font-semibold" : "text-sm font-semibold"}>
            {isFullSize ? "Doctor Uncle AI Assistant" : "Doctor Uncle AI"}
          </h2>
          {isFullSize && (
            <p className="text-sm opacity-80">Ask questions about our services, schedule appointments, and more</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className={`${isFullSize 
            ? 'bg-transparent hover:bg-blue-800 text-white border-white hover:border-white' 
            : 'h-7 w-7 p-0 bg-transparent hover:bg-blue-800 text-white'}`}
        >
          <Eraser className={isFullSize ? "h-4 w-4 mr-2" : "h-3.5 w-3.5"} />
          {isFullSize && "Clear Chat"}
        </Button>
        {onExpand && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onExpand}
            className="h-7 w-7 p-0 bg-transparent hover:bg-blue-800 text-white"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        )}
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-7 w-7 p-0 bg-transparent hover:bg-blue-800 text-white"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatWidgetHeader;
