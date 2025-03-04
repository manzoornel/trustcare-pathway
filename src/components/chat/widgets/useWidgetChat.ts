
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Message } from '../types';
import { aiResponseGenerator } from '@/utils/aiResponseGenerator';

export const useWidgetChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: 'Hello! I\'m Doctor Uncle\'s AI assistant. How can I help you today?',
    sender: 'bot',
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>(['Greeting: Hello! I\'m Doctor Uncle\'s AI assistant.']);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const clearConversation = () => {
    setMessages([{
      id: Date.now().toString(),
      content: 'Hello! I\'m Doctor Uncle\'s AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }]);
    setConversationContext(['Greeting: Hello! I\'m Doctor Uncle\'s AI assistant.']);
    toast({
      title: "Conversation cleared",
      description: "Started a new conversation with AI assistant",
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const updatedContext = [...conversationContext, `User: ${message}`];
    setConversationContext(updatedContext);
    setInputValue('');
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        const botResponse = aiResponseGenerator.generateResponse(message, {
          conversationContext: updatedContext
        });
        
        const botMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessageObj]);
        setConversationContext([...updatedContext, `AI: ${botResponse}`]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isOpen,
    setIsOpen,
    isExpanded,
    setIsExpanded,
    handleSendMessage,
    clearConversation
  };
};
