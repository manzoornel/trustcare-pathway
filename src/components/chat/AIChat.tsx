
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import ChatMessageList from './ChatMessageList';
import ChatInputForm from './ChatInputForm';
import { useAIChat } from './useAIChat';

const AIChat = () => {
  const { messages, isLoading, handleSendMessage, clearConversation } = useAIChat();

  return (
    <div className="flex flex-col h-[calc(100vh-400px)] min-h-[500px] max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-blue-700 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/c4beddef-b77c-4f28-8e9b-8f2f43be79e6.png" 
            alt="Doctor Uncle AI" 
            className="h-8 w-8" 
          />
          <div>
            <h2 className="text-xl font-semibold">Doctor Uncle AI Assistant</h2>
            <p className="text-sm opacity-80">Ask questions about our services, schedule appointments, and more</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearConversation}
          className="bg-transparent hover:bg-blue-800 text-white border-white hover:border-white"
        >
          <Eraser className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>
      
      <ChatMessageList messages={messages} isLoading={isLoading} />
      
      <div className="p-4 border-t">
        <ChatInputForm onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AIChat;
