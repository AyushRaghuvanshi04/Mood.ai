'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  previewUrl: string | undefined;
  title: string;
  artist: string;
  spotifyId?: string | null;
  className?: string;
  onAddToPlaylist?: () => void;
  onShareSong?: () => void;
}

export default function AudioPlayer({ previewUrl, title, artist, spotifyId, className = '', onAddToPlaylist, onShareSong }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update current time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [previewUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    setIsLoading(true);

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // If no preview URL, show disabled state with enhanced Spotify integration
  if (!previewUrl) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <button
          disabled
          className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white/50 cursor-not-allowed"
          title="No preview available"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate" title={title}>
            {title}
          </div>
          <div className="text-xs text-white/70 truncate" title={artist}>
            {artist}
          </div>
          <div className="text-xs text-white/50 mt-1">No preview available</div>
          
          {/* Enhanced Spotify Actions */}
          {spotifyId && (
            <div className="flex items-center space-x-3 mt-2">
              <a
                href={`https://open.spotify.com/track/${spotifyId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Play on Spotify</span>
              </a>
              
              <button
                onClick={onAddToPlaylist}
                className="inline-flex items-center space-x-1 text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors duration-200"
                title="Add to playlist"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <span>Add to Playlist</span>
              </button>
              
              <button
                onClick={onShareSong}
                className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
                title="Share song"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                <span>Share</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <audio ref={audioRef} src={previewUrl} preload="metadata" />
      
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="w-10 h-10 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 flex items-center justify-center text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isPlaying ? 'Pause preview' : 'Play preview'}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate" title={title}>
          {title}
        </div>
        <div className="text-xs text-white/70 truncate" title={artist}>
          {artist}
        </div>
        
        {duration > 0 && (
          <div className="mt-1">
            <div className="flex items-center space-x-2 text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1 bg-white/20 rounded-full h-1">
                <div 
                  className="bg-fuchsia-400 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        {/* Quick Actions for tracks with preview */}
        {spotifyId && (
          <div className="flex items-center space-x-3 mt-2">
            <a
              href={`https://open.spotify.com/track/${spotifyId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Play on Spotify</span>
            </a>
            
            <button
              onClick={onAddToPlaylist}
              className="inline-flex items-center space-x-1 text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors duration-200"
              title="Add to playlist"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              <span>Add to Playlist</span>
            </button>
            
            <button
              onClick={onShareSong}
              className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
              title="Share song"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span>Share</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
