'use client'
import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import axios from "axios";
import { motion } from "framer-motion";
import { IoPaperPlaneOutline, IoArrowBack, IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import ChatContainer from "../../components/ChatContainer";
import { useSession } from "next-auth/react";
import VoiceChat from "../../components/VoiceChat";
import { RiVoiceAiFill } from "react-icons/ri";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
}

export default function Chat() {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const {data: session} = useSession();
  const username = session?.user?.name;
  const [messages, setMessages] = useState<Message[]>([
  { id: '1', content: `Hello ${username?.split(" ")[0]}! How can I help you today?`, isBot: true }
]);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  useEffect(() => {
    console.log("Session data:", session?.user.id);
}, [session]);


  useEffect(() => {
    if (showVoiceChat && typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserInput(transcript);
          
          // Automatically submit the voice input
          const userMessageId = Date.now().toString();
          setMessages(prev => [...prev, { 
            id: userMessageId, 
            content: transcript, 
            isBot: false 
          }]);

          setIsTyping(true);
          try {
            const response = await axios.post("/api/therapy-chat", {
              input: transcript,
              user_id: session?.user.id || "anonymous"
            });
            
            const botMessage = response.data.response;
            const botMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { 
              id: botMessageId, 
              content: botMessage, 
              isBot: true 
            }]);
            
            if (voiceMode) {
              speakText(botMessage);
            }
            
            setUserInput("");
            setIsTyping(false);
          } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { 
              id: Date.now().toString(), 
              content: "Sorry, I encountered an error. Please try again.", 
              isBot: true 
            }]);
            setIsTyping(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    };
  }, [showVoiceChat]); // Add showVoiceChat as dependency

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        // Start new recording session
        recognitionRef.current.abort(); // Clear any existing session
        recognitionRef.current.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
    }
  };

  const handleStopSpeaking = () => {
    window.speechSynthesis.cancel();
    if (!isRecording) {
      toggleRecording();
    }
  };

  const handleCloseVoiceChat = () => {
    setShowVoiceChat(false);
    setIsRecording(false);
    setVoiceMode(false); // Ensure voice mode is turned off
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis.cancel();
  };

  // Update speakText to handle speech completion better
  const speakText = (text: string) => {
    if (!voiceMode) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-UK';
    utterance.rate = 1.85;
    utterance.pitch = 1.55;
    
    // Set the voice directly
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.lang === 'en-UK') || voices[0];
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Automatically start listening after bot finishes speaking
      if (voiceMode && !isRecording) {
        setTimeout(() => {
          toggleRecording();
        }, 1000);
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, content: userInput, isBot: false }]);
    
    setIsTyping(true);
    try {
      const response = await axios.post("/api/therapy-chat", {
        input: userInput.trim(),
        user_id: session?.user?.id || "anonymous"
      });
      
      const botMessage = response.data.response;
      const botMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { 
        id: botMessageId, 
        content: botMessage, 
        isBot: true 
      }]);
      
      if (voiceMode) {
        speakText(botMessage);
      }
      
      setUserInput("");
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        content: "Sorry, I encountered an error. Please try again.", 
        isBot: true 
      }]);
      setIsTyping(false);
    }
  };

  const handleStopVoiceChat = () => {
    setShowVoiceChat(false);
    setIsRecording(false);
    setVoiceMode(false); // Ensure voice mode is turned off
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceModeToggle = () => {
    setShowVoiceChat(true);
    setVoiceMode(true); // Ensure voice mode is turned on
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col relative w-full">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoArrowBack size={24} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            {session?.user ? (
              <img src={session.user.image || ""} alt={session.user.name || ""} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <FaUser size={28} />
            )}
          </button>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] w-full">
        <div className="flex-1 w-full relative">
          <ChatContainer messages={messages} isTyping={isTyping} />
        
          {/* Move VoiceChat here so it appears above the chat but below the form */}
          {showVoiceChat && (
            <VoiceChat 
              isRecording={isRecording}
              isSpeaking={isSpeaking}
              onToggleRecording={toggleRecording}
              onStop={handleStopVoiceChat}
              onStopSpeaking={handleStopSpeaking}
              onClose={handleCloseVoiceChat}
            />
          )}
        </div>
        
        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleSubmit}
          className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white shadow-lg w-full"
        >
          <div className="container mx-auto px-4">
            <div className="flex gap-2">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tell me what's on your mind..."
                className="flex-1 resize-none border rounded-full py-4 px-8 focus:outline-none h-12 max-h-32"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (userInput.trim()) {
                      handleSubmit(e);
                    }
                  }
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleVoiceModeToggle}
                className="bg-[rgb(132,181,255)] text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                <RiVoiceAiFill size={28} className="text-[rgb(241,255,39)]"/>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-[rgb(132,181,255)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                <IoPaperPlaneOutline size={28} className="text-[rgb(241,255,39)]"/>
              </motion.button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
