'use client'
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import TypingAnimation from './TypingAnimation';
import { BsFlower1 } from "react-icons/bs";

interface MessageProps {
  id?: string;
  content: string;
  isBot: boolean;
  isTyping?: boolean;
  shouldAnimate?: boolean;
}

const Message = ({ id, content, isBot, isTyping, shouldAnimate = false }: MessageProps) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    console.log("Displayed Text: ", displayedText);
    if (!shouldAnimate || !isBot || isTyping) {
      setDisplayedText(content);
      return;
    }

    setDisplayedText('');
    let currentText = '';
    const contentArray = content.split('');
    let i = 0;

    const intervalId = setInterval(() => {
      if (i < contentArray.length) {
        currentText += contentArray[i];
        setDisplayedText(currentText);
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 5);

    return () => clearInterval(intervalId);
  }, [content, isBot, isTyping, shouldAnimate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    >
      {isBot && (
        <div className="flex justify-center items-start mt-1  mr-2">
          <div className="bg-blue-200 p-2 rounded-full">
            <BsFlower1 className="text-[rgb(241,255,51)] w-5 h-5" />
          </div>
        </div>
      )}
      <div
        className={`rounded-2xl px-4 py-2 max-w-[70%] ${
          isBot
            ? 'text-gray-800 font-semibold  markdown-content'
            : 'bg-blue-100 font-semibold text-black'
        }`}
      >
        {isTyping ? (
          <TypingAnimation />
        ) : (
          <div className="text-sm md:text-base">
            {isBot ? (
              <ReactMarkdown
                components={{
                  // Style markdown elements
                  p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />
                  ),
                  code: ({node, ...props}) => (
                    <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                  ),
                }}
              >
                {displayedText}
              </ReactMarkdown>
            ) : (
              content
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Message;