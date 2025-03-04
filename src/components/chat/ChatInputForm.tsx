
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInputForm = ({ onSendMessage, isLoading }: ChatInputFormProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Type your message here..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()}
        className="bg-blue-700 hover:bg-blue-800"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInputForm;
