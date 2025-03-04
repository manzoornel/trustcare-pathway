
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from './types';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessageList = ({ messages, isLoading }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="flex items-start max-w-[80%]">
            <div className="rounded-full p-1 mr-2 bg-white border border-gray-200 flex items-center justify-center">
              <img 
                src="/lovable-uploads/ae63c3bf-5d6c-4576-8d59-1311ca468c30.png" 
                alt="Doctor Uncle AI" 
                className="h-6 w-6 object-contain"
              />
            </div>
            <div className="p-3 rounded-lg bg-white shadow-sm rounded-tl-none">
              <p className="flex items-center">
                <span className="mr-2">Typing</span>
                <span className="animate-pulse">...</span>
              </p>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
