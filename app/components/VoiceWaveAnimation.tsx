'use client'
import { motion } from "framer-motion";
import { BsFlower1 } from "react-icons/bs";
import { IoMicOutline, IoStopCircleOutline, IoClose } from "react-icons/io5";
import { MdOutlineCallEnd } from "react-icons/md";

interface VoiceWaveProps {
    isRecording: boolean;
    isSpeaking: boolean;
    isTyping: boolean; // Add isTyping prop
    onToggleRecording: () => void;
    onStop: () => void;
    onClose: () => void;
}

const VoiceWaveAnimation = ({ isRecording, isSpeaking, isTyping, onToggleRecording, onStop, onClose }: VoiceWaveProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-[9999]"
        >
            <div className="relative flex flex-col items-center gap-6 p-8 w-full h-full justify-center">
                <div className="relative flex items-center justify-center">
                    {/* Listening waves - shown when recording but not speaking */}
                    {isRecording && !isSpeaking && !isTyping && [...Array(3)].map((_, i) => (
                        <motion.div
                            key={`listening-${i}`}
                            className="absolute border-4 border-green-400 rounded-full"
                            style={{
                                width: 80 + i * 20,
                                height: 80 + i * 20,
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.4, 0.2, 0.4],
                                borderRadius: ["50%", "45%", "50%"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Speaking waves - shown when bot is speaking */}
                    {isSpeaking && !isTyping && [...Array(4)].map((_, i) => (
                        <motion.div
                            key={`speaking-${i}`}
                            className="absolute border-4 border-blue-400 rounded-full"
                            style={{
                                width: 100 + i * 30,
                                height: 100 + i * 30,
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.1, 0.3],
                                rotate: [0, 360, 0], // Extra animation
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Typing indicator - shown when bot is typing a response */}
                    {isTyping && [...Array(3)].map((_, i) => (
                        <motion.div
                            key={`typing-${i}`}
                            className="absolute bg-gray-400 rounded-full"
                            style={{
                                width: 20 + i * 10,
                                height: 20 + i * 10,
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Central flower icon with dynamic animation */}
                    <motion.div
                        className={`relative w-32 h-32 ${
                            isRecording && !isSpeaking && !isTyping
                                ? "bg-gradient-to-r from-green-500 to-green-600" 
                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                        } rounded-full shadow-lg flex items-center justify-center z-10`}
                        animate={
                            isRecording && !isSpeaking && !isTyping
                                ? { scale: [1, 1.05, 1] }
                                : isSpeaking && !isTyping
                                ? { scale: [1, 1.1, 1] }
                                : {}
                        }
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <BsFlower1 
                            size={72} 
                            className={`${
                                isRecording && !isSpeaking && !isTyping
                                    ? "text-[rgb(241,255,51)] rotate-45" 
                                    : "text-[rgb(241,255,51)]"
                            }`}
                        />
                    </motion.div>
                </div>
                <div className="relative inset-0 flex gap-4 mt-4 items-center justify-center">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onStop}
                        className="bg-red-500 p-4 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <MdOutlineCallEnd size={40} className="text-white" />
                    </motion.button>
                </div>
                <div className="text-sm text-gray-600">
                    Voice-only mode enabled
                </div>
            </div>
        </motion.div>
    );
};

export default VoiceWaveAnimation;