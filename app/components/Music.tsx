'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoMdMusicalNote } from 'react-icons/io';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';

export default function Music() {
  const [isOpen, setIsOpen] = useState(false);
  const { isPlaying, currentEmotion, togglePlay, setEmotion, volume, setVolume } = useMusic();

  const emotions = ['Angry', 'Sad', 'Frustrated', 'Anxious'];

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: isOpen ? 0 : 250 }}
      className="fixed right-0 top-1/4 z-50 bg-white/80 backdrop-blur-md rounded-l-2xl shadow-lg"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-white/80 p-2 rounded-l-lg shadow-lg"
      >
        <IoMdMusicalNote size={24} className="text-[rgb(84,138,220)]" />
      </button>

      <div className="p-6 w-64">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          How are you feeling today?
        </h3>

        <div className="space-y-2">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              onClick={() => setEmotion(emotion)}
              className={`w-full p-2 rounded-lg text-left transition-colors ${
                currentEmotion === emotion
                  ? 'bg-[rgb(84,138,220)] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>

        {currentEmotion && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Now Playing:</p>
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-[rgb(84,138,220)] text-white hover:bg-blue-600"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
            <p className="text-sm font-medium mt-1">{currentEmotion} Therapy Music</p>
            
            {isPlaying && (
              <motion.div
                className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-[rgb(84,138,220)]"
                  animate={{
                    width: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}

            <div className="mt-4">
              <label className="text-sm text-gray-600">Volume: {volume}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
