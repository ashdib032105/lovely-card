'use client';

import { Music, Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

export default function MusicPlayer() {
  const { isPlaying, isMuted, togglePlay, toggleMute } = useMusic();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-base-100 bg-opacity-80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <Music className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-primary' : 'text-base-content'}`} />
        <span className="text-sm font-medium hidden sm:inline">
          {isPlaying ? 'Playing' : 'Paused'}
        </span>
      </div>

      <div className="flex gap-1">
        <button
          onClick={togglePlay}
          className="btn btn-circle btn-sm btn-ghost"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button
          onClick={toggleMute}
          className="btn btn-circle btn-sm btn-ghost"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
