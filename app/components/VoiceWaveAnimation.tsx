'use client'
import { motion } from "framer-motion";
import { BsFlower1 } from "react-icons/bs";
import { IoMicOutline, IoStopCircleOutline, IoClose } from "react-icons/io5";

interface VoiceWaveProps {
    isRecording: boolean;
    isSpeaking: boolean;
    onToggleRecording: () => void;
    onStop: () => void;
    onClose: () => void;
}

const VoiceWaveAnimation = ({ isRecording, isSpeaking, onToggleRecording, onStop, onClose }: VoiceWaveProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999]"
        >
            <div className="relative flex flex-col items-center gap-6 bg-white p-8 rounded-lg shadow-lg w-80">
                <div className="relative flex items-center justify-center">
                    {/* Sound waves */}
                    {isSpeaking && [...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
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

                    {/* Interactive center circle with buttons */}
                    <motion.div
                        className="relative w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center z-10"
                        animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <BsFlower1 size={72} className="text-[rgb(241,255,51)]" />
                    </motion.div>
                </div>
                <div className="relative inset-0 flex gap-4 mt-4 items-center justify-center">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onStop}
                        className="bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <IoStopCircleOutline size={40} className="text-white" />
                    </motion.button>
                </div>
                {/* Status text */}
                <div className="text-gray-800 font-medium text-lg mt-4">
                    {isRecording ? "Listening..." : "Voice chat active"}
                </div>
                {/* Close button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
                >
                    <IoClose size={24} className="text-white" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default VoiceWaveAnimation;