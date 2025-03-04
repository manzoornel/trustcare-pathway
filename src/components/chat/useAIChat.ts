
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Message } from './types';
import { aiResponseGenerator } from '@/utils/aiResponseGenerator';

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const { toast } = useToast();

  // Initial greeting message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I\'m Doctor Uncle\'s AI assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    
    // Initialize conversation context with greeting
    setConversationContext(['Greeting: Hello! I\'m Doctor Uncle\'s AI assistant.']);
  }, []);

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: 'Hello! I\'m Doctor Uncle\'s AI assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setConversationContext(['Greeting: Hello! I\'m Doctor Uncle\'s AI assistant.']);
    toast({
      title: "Conversation cleared",
      description: "Started a new conversation with AI assistant",
    });
  };

  const handleSendMessage = async (inputValue: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add to conversation context
    const updatedContext = [...conversationContext, `User: ${inputValue}`];
    setConversationContext(updatedContext);
    
    setIsLoading(true);
    
    try {
      // Simulate AI response with memory
      setTimeout(() => {
        // Generate response using the dedicated service
        let botResponse = aiResponseGenerator.generateResponse(inputValue, {
          conversationContext: updatedContext
        });
        
        const botMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessageObj]);
        
        // Add bot response to context
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
    isLoading,
    handleSendMessage,
    clearConversation
  };
};
