import { motion } from 'framer-motion';
import Message from './Message';
import { useRef, useEffect, useCallback } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  isNew?: boolean;  // Add this property
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isTyping?: boolean;
}

const ChatContainer = ({ messages, isTyping }: ChatContainerProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto px-4 pb-20 w-full"
    >
      <div className="container mx-auto">
        {messages.map((message, index) => (
          <Message 
            key={message.id}
            id={message.id}
            content={message.content}
            isBot={message.isBot}
            shouldAnimate={message.isNew && message.isBot} // Only animate new bot messages
          />
        ))}
        {isTyping && (
          <Message 
            key="typing-indicator" 
            content="" 
            isBot={true} 
            isTyping={true} 
          />
        )}
        <div ref={messagesEndRef} />
      </div>
    </motion.div>
  );
};

export default ChatContainer;