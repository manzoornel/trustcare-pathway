
import React from 'react';
import { User } from 'lucide-react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  isCompact?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCompact = false }) => {
  return (
    <div 
      className={`${isCompact ? 'mb-3' : 'mb-4'} flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start ${isCompact ? 'max-w-[90%]' : 'max-w-[80%]'} ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`${message.sender === 'user' 
          ? `rounded-full ${isCompact ? 'p-1.5' : 'p-2'} ${isCompact ? 'ml-1.5' : 'ml-2'} bg-blue-600` 
          : `rounded-full ${isCompact ? 'p-1' : 'p-1'} ${isCompact ? 'mr-1.5' : 'mr-2'} bg-white border border-gray-200 flex items-center justify-center`}`}
        >
          {message.sender === 'user' ? (
            <User className={`${isCompact ? 'h-3 w-3' : 'h-5 w-5'} text-white`} />
          ) : (
            <img 
              src="/lovable-uploads/ae63c3bf-5d6c-4576-8d59-1311ca468c30.png" 
              alt="Doctor Uncle AI" 
              className={`${isCompact ? "h-5 w-5" : "h-6 w-6"} object-contain`}
            />
          )}
        </div>
        <div className={`${isCompact ? 'p-2' : 'p-3'} rounded-lg ${
          message.sender === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white shadow-sm rounded-tl-none'
        }`}>
          <p className={isCompact ? 'text-xs' : ''}>{message.content}</p>
          <div className={`${isCompact ? 'text-[10px]' : 'text-xs'} mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
