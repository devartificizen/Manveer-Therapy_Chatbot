import { motion } from 'framer-motion';
import Message from './Message';
import { useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;  // Add id to interface
  content: string;
  isBot: boolean;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isTyping?: boolean;
}

const ChatContainer = ({ messages, isTyping }: ChatContainerProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto px-4 pb-20 w-full"
    >
      <div className="container mx-auto">
        {messages.map((message) => (
          <Message 
            key={message.id}
            id={message.id}
            content={message.content}
            isBot={message.isBot}
          />
        ))}
        {isTyping && (
          <Message content="" isBot={true} isTyping={true} />
        )}
        <div ref={messagesEndRef} />
      </div>
    </motion.div>
  );
};

export default ChatContainer;