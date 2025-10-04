'use client';

import { createContext, useContext, useRef, useState, ReactNode, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  startMusic: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Create audio element on client side
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('/audio/background.mp3');
      audioRef.current.loop = true;
      setIsInitialized(true);
    }
  }, []);

  const startMusic = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log('Music play prevented:', error);
        });
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((error) => console.log('Play error:', error));
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, startMusic, togglePlay, toggleMute }}>
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
