
import { Message } from '@/components/chat/types';

export const createUserMessage = (content: string): Message => {
  return {
    id: Date.now().toString(),
    content,
    sender: 'user',
    timestamp: new Date()
  };
};

export const createBotMessage = (content: string): Message => {
  return {
    id: (Date.now() + 1).toString(),
    content,
    sender: 'bot',
    timestamp: new Date()
  };
};

export const createInitialBotMessage = (): Message => {
  return {
    id: '1',
    content: 'Hello! I\'m Doctor Uncle\'s AI assistant. How can I help you today?',
    sender: 'bot',
    timestamp: new Date()
  };
};
