
import React from 'react';
import { User } from 'lucide-react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div 
      className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`${message.sender === 'user' 
          ? 'rounded-full p-2 ml-2 bg-blue-600' 
          : 'rounded-full p-1 mr-2 bg-gray-100 border border-gray-200'}`}
        >
          {message.sender === 'user' ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <img 
              src="/lovable-uploads/c4beddef-b77c-4f28-8e9b-8f2f43be79e6.png" 
              alt="Doctor Uncle AI" 
              className="h-8 w-8"
            />
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
