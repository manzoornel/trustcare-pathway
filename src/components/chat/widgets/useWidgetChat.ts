
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Message } from '../types';
import { aiResponseGenerator } from '@/utils/aiResponseGenerator';
import { createUserMessage, createBotMessage, createInitialBotMessage } from '@/utils/chatMessageUtils';

export const useWidgetChat = () => {
  const [messages, setMessages] = useState<Message[]>([createInitialBotMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>(['Greeting: Hello! I\'m Doctor Uncle\'s AI assistant.']);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const clearConversation = () => {
    const initialMessage = createInitialBotMessage();
    setMessages([initialMessage]);
    setConversationContext(['Greeting: Hello! I\'m Doctor Uncle\'s AI assistant.']);
    toast({
      title: "Conversation cleared",
      description: "Started a new conversation with AI assistant",
    });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage = createUserMessage(message);
    
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
        
        const botMessageObj = createBotMessage(botResponse);
        
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
