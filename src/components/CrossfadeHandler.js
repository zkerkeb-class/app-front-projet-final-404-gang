import { useEffect, useRef } from 'react';
import { usePlayer } from '../contexts/PlayerContext';

const CROSSFADE_DURATION = 3; // seconds

const CrossfadeHandler = () => {
  const { audioRef, currentTrack } = usePlayer();
  const nextAudioRef = useRef(new Audio());
  
  useEffect(() => {
    const audio = audioRef.current;
    const nextAudio = nextAudioRef.current;

    const handleTimeUpdate = () => {
      if (currentTrack && audio.duration) {
        const timeLeft = audio.duration - audio.currentTime;
        
        if (timeLeft <= CROSSFADE_DURATION) {
          // Start fading out current track
          audio.volume = timeLeft / CROSSFADE_DURATION;
          
          // If next track exists, start playing and fading in
          if (nextAudio.src) {
            nextAudio.volume = 1 - (timeLeft / CROSSFADE_DURATION);
            if (nextAudio.paused) {
              nextAudio.play().catch(console.error);
            }
          }
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [audioRef, currentTrack]);

  return null;
};

export default CrossfadeHandler; 