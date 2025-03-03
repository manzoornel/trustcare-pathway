
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
  }, []);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Simulate AI response
      setTimeout(() => {
        // Generate response based on user input
        let botResponse = "I'm sorry, I don't have enough information to answer that. Could you provide more details?";
        
        const userInputLower = inputValue.toLowerCase();
        
        if (userInputLower.includes('appointment') || userInputLower.includes('book') || userInputLower.includes('schedule')) {
          botResponse = "To book an appointment, you can visit our appointments page or call us at (555) 123-4567. Would you like me to redirect you to the appointments page?";
        } else if (userInputLower.includes('hour') || userInputLower.includes('open')) {
          botResponse = "Our clinic is open Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.";
        } else if (userInputLower.includes('location') || userInputLower.includes('address') || userInputLower.includes('where')) {
          botResponse = "Our clinic is located at 123 Health Avenue, Medical District, Your City. You can find directions on our Contact page.";
        } else if (userInputLower.includes('service') || userInputLower.includes('treat') || userInputLower.includes('specialize')) {
          botResponse = "We offer a wide range of services including preventive care, chronic disease management, pediatrics, women's health, and more. You can check our Services page for a complete list.";
        } else if (userInputLower.includes('insurance')) {
          botResponse = "We accept most major insurance plans. Please contact our office for specific information about your insurance coverage.";
        } else if (userInputLower.includes('covid') || userInputLower.includes('vaccine') || userInputLower.includes('vaccination')) {
          botResponse = "We offer COVID-19 testing and vaccinations. Please call our office to schedule an appointment for either service.";
        } else if (userInputLower.includes('doctor') || userInputLower.includes('physician') || userInputLower.includes('specialist')) {
          botResponse = "Our clinic has several experienced doctors specializing in different areas of medicine. You can view their profiles on our About page.";
        } else if (userInputLower.includes('emergency')) {
          botResponse = "If you're experiencing a medical emergency, please call 911 immediately. For urgent but non-emergency issues, you can call our after-hours line at (555) 987-6543.";
        } else if (userInputLower.includes('hi') || userInputLower.includes('hello') || userInputLower.includes('hey')) {
          botResponse = "Hello! How can I assist you with your healthcare needs today?";
        } else if (userInputLower.includes('thank')) {
          botResponse = "You're welcome! Is there anything else I can help you with?";
        } else if (userInputLower.includes('bye') || userInputLower.includes('goodbye')) {
          botResponse = "Thank you for chatting with me. If you have more questions later, feel free to come back. Take care!";
        }
        
        const botMessageObj: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessageObj]);
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

  return (
    <div className="flex flex-col h-[calc(100vh-400px)] min-h-[500px] max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-blue-700 text-white">
        <h2 className="text-xl font-semibold">Healthcare AI Assistant</h2>
        <p className="text-sm opacity-80">Ask questions about our services, schedule appointments, and more</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
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
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start max-w-[80%]">
              <div className="rounded-full p-2 mr-2 bg-gray-300">
                <Bot className="h-5 w-5 text-gray-700" />
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
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
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
      </div>
    </div>
  );
};

export default AIChatInterface;
