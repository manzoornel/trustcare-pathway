
import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ChatWidgetButton from './chat/widgets/ChatWidgetButton';
import ChatWidgetHeader from './chat/widgets/ChatWidgetHeader';
import CompactChatWidget from './chat/widgets/CompactChatWidget';
import { useWidgetChat } from './chat/widgets/useWidgetChat';
import ChatMessageList from './chat/ChatMessageList';
import ChatInputForm from './chat/ChatInputForm';

const AIChatWidget = () => {
  const {
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
  } = useWidgetChat();

  if (!isOpen) {
    return <ChatWidgetButton onClick={() => setIsOpen(true)} />;
  }

  if (isExpanded) {
    return (
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="sm:max-w-3xl sm:h-[80vh] flex flex-col p-0">
          <ChatWidgetHeader 
            isFullSize
            onClear={clearConversation}
          />
          
          <ChatMessageList messages={messages} isLoading={isLoading} />
          
          <div className="p-4 border-t">
            <ChatInputForm 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <CompactChatWidget
      messages={messages}
      isLoading={isLoading}
      inputValue={inputValue}
      onInputChange={(value) => setInputValue(value)}
      onSendMessage={handleSendMessage}
      onClear={clearConversation}
      onExpand={() => setIsExpanded(true)}
      onClose={() => setIsOpen(false)}
    />
  );
};

export default AIChatWidget;
