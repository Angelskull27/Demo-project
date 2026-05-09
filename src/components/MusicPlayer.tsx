import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { MUSIC_TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.error("Playback failed", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;;
      audioRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-6 font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        preload="metadata"
      />
      
      {/* Current Track Info */}
      <div className="flex flex-col gap-2">
         {MUSIC_TRACKS.map((track, idx) => (
           <div 
            key={track.id} 
            className={`p-3 flex items-center gap-4 cursor-pointer border-l-4 transition-all ${
              idx === currentTrackIndex 
                ? 'bg-blue-900/20 border-blue-600' 
                : 'hover:bg-gray-800 border-gray-700'
            }`}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setProgress(0);
              setIsPlaying(true);
            }}
           >
             <div className={`w-10 h-10 flex items-center justify-center border ${idx === currentTrackIndex ? 'border-blue-500 bg-blue-900/30 text-blue-400' : 'border-gray-600 bg-gray-900 text-gray-500'}`}>
                 {idx === currentTrackIndex && isPlaying ? (
                    <div className="flex space-x-[2px] h-4">
                      <div className="w-1 bg-blue-500 animate-[bounce_0.8s_infinite]"></div>
                      <div className="w-1 bg-blue-500 animate-[bounce_1.2s_infinite]"></div>
                      <div className="w-1 bg-blue-500 animate-[bounce_1.0s_infinite]"></div>
                    </div>
                 ) : (
                    <span className="text-xs">{(idx + 1).toString().padStart(2, '0')}</span>
                 )}
             </div>
             <div className="flex-1 overflow-hidden">
               <div className={`text-sm tracking-tight truncate ${idx === currentTrackIndex ? 'text-blue-400' : 'text-gray-400'}`}>{track.title}</div>
               <div className={`text-[10px] truncate uppercase tracking-widest ${idx === currentTrackIndex ? 'text-blue-500/70' : 'text-gray-600'}`}>{track.artist}</div>
             </div>
           </div>
         ))}
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-6 mt-4 pt-6 border-t border-gray-800">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase text-gray-500 tracking-tighter">
            <span>DATA.SYNC</span>
            <span className="text-blue-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full relative group h-2 bg-gray-900 border border-gray-700">
            <div 
               className="h-full bg-blue-600 transition-all duration-100 relative"
               style={{ width: `${progress}%` }}
            >
               <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse"></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 py-2">
          <button 
            onClick={handlePrev} 
            className="text-gray-500 hover:text-blue-400 hover:scale-110 transition-all"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-14 h-14 border border-blue-600 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-black transition-all shadow-[0_0_15px_rgba(0,0,255,0.2)]"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="translate-x-0.5" fill="currentColor" />}
          </button>
          
          <button 
            onClick={handleNext} 
            className="text-gray-500 hover:text-blue-400 hover:scale-110 transition-all"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
          <span className="text-[10px] uppercase tracking-tighter text-gray-500">VOL</span>
          <div className="flex-1 relative flex items-center h-2 bg-gray-900 border border-gray-700">
            <div 
               className="h-full bg-gray-500 pointer-events-none"
               style={{ width: `${volume * 100}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-gray-500 hover:text-blue-400 ml-2">
            {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
