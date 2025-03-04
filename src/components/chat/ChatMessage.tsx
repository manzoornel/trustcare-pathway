
import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div 
      className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`rounded-full p-2 mr-2 ${message.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-300'}`}>
          {message.sender === 'user' ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-gray-700" />
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white shadow-sm rounded-tl-none'
        }`}>
          <p>{message.content}</p>
          <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
