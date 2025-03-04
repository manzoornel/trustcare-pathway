
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Eraser, Maximize2, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AIChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    
    // Initialize conversation context with greeting
    setConversationContext(['Greeting: Hello! I\'m Doctor Uncle\'s AI assistant.']);
  }, []);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    
    // Add to conversation context
    const updatedContext = [...conversationContext, `User: ${inputValue}`];
    setConversationContext(updatedContext);
    
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Simulate AI response with memory
      setTimeout(() => {
        // Generate response based on user input and conversation context
        let botResponse = generateContextualResponse(inputValue, updatedContext);
        
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

  const generateContextualResponse = (userInput: string, context: string[]): string => {
    // Using the same response generation logic from the original component
    const userInputLower = userInput.toLowerCase();
    let botResponse = "I'm sorry, I don't have enough information to answer that. Could you provide more details?";
    
    // Check if this is a follow-up question
    const isFollowUp = context.length > 2 && (
      userInputLower.includes('what about') || 
      userInputLower.includes('how about') || 
      userInputLower.includes('and') || 
      userInputLower.includes('also') ||
      userInputLower.includes('?') ||
      userInputLower.length < 15 // Short questions are often follow-ups
    );
    
    // Check for repeated questions or topics in the conversation
    const recentTopics = new Set<string>();
    context.forEach(item => {
      if (item.startsWith('User:')) {
        const userMsg = item.substring(6).toLowerCase();
        if (userMsg.includes('appointment')) recentTopics.add('appointment');
        if (userMsg.includes('hour') || userMsg.includes('open')) recentTopics.add('hours');
        if (userMsg.includes('location') || userMsg.includes('address')) recentTopics.add('location');
        if (userMsg.includes('service') || userMsg.includes('treat')) recentTopics.add('services');
        if (userMsg.includes('insurance')) recentTopics.add('insurance');
        if (userMsg.includes('covid') || userMsg.includes('vaccine')) recentTopics.add('covid');
        if (userMsg.includes('doctor') || userMsg.includes('physician')) recentTopics.add('doctors');
        if (userMsg.includes('emergency')) recentTopics.add('emergency');
      }
    });
    
    // Base responses for different topics
    if (userInputLower.includes('appointment') || userInputLower.includes('book') || userInputLower.includes('schedule')) {
      botResponse = "To book an appointment, you can visit our appointments page or call us at (555) 123-4567. Would you like me to redirect you to the appointments page?";
      
      // If this is a follow-up about appointments
      if (recentTopics.has('appointment') && isFollowUp) {
        botResponse = "For your appointment, you'll need your insurance card and ID. Our online appointment system also lets you select your preferred doctor if they have availability.";
      }
    } else if (userInputLower.includes('hour') || userInputLower.includes('open')) {
      botResponse = "Our clinic is open Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.";
      
      // If this is a follow-up about hours
      if (recentTopics.has('hours') && isFollowUp) {
        botResponse = "For urgent care needs outside our regular hours, we have an after-hours phone service at (555) 987-6543. Emergency cases should always go to the nearest ER.";
      }
    } else if (userInputLower.includes('location') || userInputLower.includes('address') || userInputLower.includes('where')) {
      botResponse = "Our clinic is located at 123 Health Avenue, Medical District, Your City. You can find directions on our Contact page.";
      
      // If this is a follow-up about location
      if (recentTopics.has('location') && isFollowUp) {
        botResponse = "We have ample parking available onsite, and we're also accessible by public transport. Bus routes 10 and 15 stop right in front of our building.";
      }
    } else if (userInputLower.includes('service') || userInputLower.includes('treat') || userInputLower.includes('specialize')) {
      botResponse = "We offer a wide range of services including preventive care, chronic disease management, pediatrics, women's health, and more. You can check our Services page for a complete list.";
      
      // If this is a follow-up about services
      if (recentTopics.has('services') && isFollowUp) {
        botResponse = "Our most requested services include annual physicals, vaccinations, and chronic disease management. We also provide telehealth consultations for qualified cases.";
      }
    } else if (userInputLower.includes('insurance')) {
      botResponse = "We accept most major insurance plans including BlueCross, Aetna, Cigna, and Medicare. Please contact our office for specific information about your insurance coverage.";
      
      // If this is a follow-up about insurance
      if (recentTopics.has('insurance') && isFollowUp) {
        botResponse = "For insurance verification, please bring your card to your appointment. We also offer payment plans for those with high deductibles or without insurance coverage.";
      }
    } else if (userInputLower.includes('covid') || userInputLower.includes('vaccine') || userInputLower.includes('vaccination')) {
      botResponse = "We offer COVID-19 testing and vaccinations. Please call our office to schedule an appointment for either service.";
      
      // If this is a follow-up about COVID
      if (recentTopics.has('covid') && isFollowUp) {
        botResponse = "We provide both rapid antigen and PCR tests. COVID vaccination appointments are available Monday through Friday, and no referral is needed.";
      }
    } else if (userInputLower.includes('doctor') || userInputLower.includes('physician') || userInputLower.includes('specialist')) {
      botResponse = "Our clinic has several experienced doctors specializing in different areas of medicine. You can view their profiles on our About page.";
      
      // If this is a follow-up about doctors
      if (recentTopics.has('doctors') && isFollowUp) {
        botResponse = "Our medical team includes family physicians, pediatricians, and specialists in internal medicine. Dr. Sarah Chen and Dr. Michael Rodriguez are currently accepting new patients.";
      }
    } else if (userInputLower.includes('emergency')) {
      botResponse = "If you're experiencing a medical emergency, please call 911 immediately. For urgent but non-emergency issues, you can call our after-hours line at (555) 987-6543.";
      
      // If this is a follow-up about emergency
      if (recentTopics.has('emergency') && isFollowUp) {
        botResponse = "We have an urgent care clinic that handles non-life-threatening emergencies during business hours. For serious conditions like chest pain or severe bleeding, please go to the ER.";
      }
    } else if (userInputLower.includes('hi') || userInputLower.includes('hello') || userInputLower.includes('hey')) {
      botResponse = "Hello! How can I assist you with your healthcare needs today?";
    } else if (userInputLower.includes('thank')) {
      botResponse = "You're welcome! Is there anything else I can help you with?";
    } else if (userInputLower.includes('bye') || userInputLower.includes('goodbye')) {
      botResponse = "Thank you for chatting with me. If you have more questions later, feel free to come back. Take care!";
    }
    
    // Look for name references in the conversation
    let userName = "";
    context.forEach(item => {
      if (item.startsWith('User:')) {
        const userMsg = item.substring(6).toLowerCase();
        if (userMsg.includes('my name is') || userMsg.includes("i'm ") || userMsg.includes("i am ")) {
          const nameMatch = userMsg.match(/my name is (\w+)|i'?m (\w+)|i am (\w+)/i);
          if (nameMatch) {
            const capturedName = nameMatch[1] || nameMatch[2] || nameMatch[3];
            if (capturedName && capturedName.length > 2) { // Avoid capturing "I'm a" etc.
              userName = capturedName.charAt(0).toUpperCase() + capturedName.slice(1);
            }
          }
        }
      }
    });
    
    // Personalize response if we know the user's name
    if (userName && !userInputLower.includes('bye') && !userInputLower.includes('thank')) {
      botResponse = `${botResponse} ${Math.random() > 0.5 ? `Is there anything else I can help you with today, ${userName}?` : ''}`;
    }
    
    return botResponse;
  };

  // Render widget button when collapsed
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full w-14 h-14 bg-blue-700 hover:bg-blue-800 flex items-center justify-center shadow-lg"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  // Widget content (compact version)
  const renderWidget = () => (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col w-80 h-96 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
      <div className="p-3 bg-blue-700 text-white flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearConversation}
            className="h-7 w-7 p-0 bg-transparent hover:bg-blue-800 text-white"
          >
            <Eraser className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(true)}
            className="h-7 w-7 p-0 bg-transparent hover:bg-blue-800 text-white"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="h-7 w-7 p-0 bg-transparent hover:bg-blue-800 text-white"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[90%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`rounded-full p-1.5 mr-1.5 ${message.sender === 'user' ? 'bg-blue-600 ml-1.5' : 'bg-gray-300'}`}>
                {message.sender === 'user' ? (
                  <User className="h-3 w-3 text-white" />
                ) : (
                  <Bot className="h-3 w-3 text-gray-700" />
                )}
              </div>
              <div className={`p-2 rounded-lg text-xs ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white shadow-sm rounded-tl-none'
              }`}>
                <p>{message.content}</p>
                <div className={`text-[10px] mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="flex items-start max-w-[90%]">
              <div className="rounded-full p-1.5 mr-1.5 bg-gray-300">
                <Bot className="h-3 w-3 text-gray-700" />
              </div>
              <div className="p-2 rounded-lg bg-white shadow-sm rounded-tl-none text-xs">
                <p className="flex items-center">
                  <span className="mr-1">Typing</span>
                  <span className="animate-pulse">...</span>
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-1">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs h-8"
          />
          <Button 
            type="submit" 
            size="sm"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-700 hover:bg-blue-800 h-8 w-8 p-0"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );

  // Full screen dialog version
  return (
    <>
      {isExpanded ? (
        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="sm:max-w-3xl sm:h-[80vh] flex flex-col p-0">
            <div className="p-4 bg-blue-700 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Healthcare AI Assistant</h2>
                <p className="text-sm opacity-80">Ask questions about our services, schedule appointments, and more</p>
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
          </DialogContent>
        </Dialog>
      ) : (
        renderWidget()
      )}
    </>
  );
};

export default AIChatWidget;
