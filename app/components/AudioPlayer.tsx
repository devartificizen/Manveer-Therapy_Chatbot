import { useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';

export default function AudioPlayer() {
  const { isPlaying, currentEmotion, volume } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio playback error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  return (
    <audio ref={audioRef} src={currentEmotion ? `https://d1xg8aht389zfw.cloudfront.net/songs/test/${currentEmotion}.mp3` : ''} />
  );
}
