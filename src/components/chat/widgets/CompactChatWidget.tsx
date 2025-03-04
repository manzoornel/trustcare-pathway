
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import ChatWidgetHeader from './ChatWidgetHeader';
import { Message } from '../types';
import ChatMessage from '../ChatMessage';

interface CompactChatWidgetProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onClear: () => void;
  onExpand: () => void;
  onClose: () => void;
}

const CompactChatWidget = ({
  messages,
  isLoading,
  inputValue,
  onInputChange,
  onSendMessage,
  onClear,
  onExpand,
  onClose
}: CompactChatWidgetProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col w-80 h-96 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      <ChatWidgetHeader 
        onClear={onClear}
        onExpand={onExpand}
        onClose={onClose}
      />
      
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} isCompact />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="flex items-start max-w-[90%]">
              <div className="rounded-full mr-1.5 bg-gray-100 border border-gray-200">
                <img 
                  src="/lovable-uploads/c4beddef-b77c-4f28-8e9b-8f2f43be79e6.png" 
                  alt="Doctor Uncle AI" 
                  className="h-6 w-6" 
                />
              </div>
              <div className="p-2 rounded-lg bg-white shadow-sm rounded-tl-none text-xs">
                <p className="flex items-center">
                  <span className="mr-1">Typing</span>
                  <span className="animate-pulse">...</span>
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 border-t">
        <form onSubmit={onSendMessage} className="flex gap-1">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs h-8"
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-700 hover:bg-blue-800 h-8 w-8 p-0"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompactChatWidget;
