'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react';

type MusicContextType = {
  isPlaying: boolean;
  currentEmotion: string | null;
  volume: number;
  togglePlay: () => void;
  setEmotion: (emotion: string) => void;
  setVolume: (volume: number) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Placeholder music URLs - replace with actual music files
const emotionMusics: { [key: string]: string } = {
  Angry: 'https://d1xg8aht389zfw.cloudfront.net/songs/test/124510.mp3',
  Sad: 'https://d1xg8aht389zfw.cloudfront.net/songs/test/182678.mp3',
  Frustrated: 'https://d1xg8aht389zfw.cloudfront.net/songs/test/185784.mp3',
  Anxious: 'https://d1xg8aht389zfw.cloudfront.net/songs/test/145705.mp3'
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [volume, setVolume] = useState(5); // Default volume at 20%
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
    setCurrentEmotion(emotion);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, currentEmotion, togglePlay, setEmotion, volume, setVolume }}>
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
