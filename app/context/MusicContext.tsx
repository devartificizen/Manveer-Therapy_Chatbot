'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react';

type MusicContextType = {
  isPlaying: boolean;
  currentEmotion: string | null;
  volume: number;
  isOpen: boolean;  // Add this
  togglePlay: () => void;
  setEmotion: (emotion: string) => void;
  setVolume: (volume: number) => void;
  setIsOpen: (isOpen: boolean) => void;  // Add this
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Placeholder music URLs - replace with actual music files
const emotionMusics: { [key: string]: string } = {
  'sad': 'https://d1xg8aht389zfw.cloudfront.net/songs/test/182678.mp3',
  'angry': 'https://d1xg8aht389zfw.cloudfront.net/songs/test/124510.mp3',
  'frustrated': 'https://d1xg8aht389zfw.cloudfront.net/songs/test/185784.mp3',
  'anxious': 'https://d1xg8aht389zfw.cloudfront.net/songs/test/145705.mp3'
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [volume, setVolume] = useState(2); // Default volume at 20%
  const [isOpen, setIsOpen] = useState(false);  // Add this
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentEmotion) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(emotionMusics[currentEmotion]);
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio playback error:', e));
        audioRef.current.loop = true;
      }
    }
  }, [currentEmotion]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio playback error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const setEmotion = (emotion: string) => {
    console.log("MusicContext: Setting emotion to:", emotion);
    setCurrentEmotion(emotion.toLowerCase());
    setIsPlaying(true);
    setIsOpen(true);  // Automatically open the music panel
  };

  return (
    <MusicContext.Provider value={{ 
      isPlaying, 
      currentEmotion, 
      togglePlay, 
      setEmotion, 
      volume, 
      setVolume,
      isOpen,
      setIsOpen 
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
