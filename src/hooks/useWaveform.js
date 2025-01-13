import { useEffect, useRef, useState } from 'react';

const useWaveform = (audioUrl, isDarkMode) => {
  const canvasRef = useRef(null);
  const [audioData, setAudioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!audioUrl) return;

    const fetchAudioData = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get the raw audio data
        const rawData = audioBuffer.getChannelData(0);
        const samples = 100; // Number of bars to display
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];

        for (let i = 0; i < samples; i++) {
          const blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }

        setAudioData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading audio data:', error);
        setIsLoading(false);
      }
    };

    fetchAudioData();
  }, [audioUrl]);

  useEffect(() => {
    if (!canvasRef.current || !audioData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waveform
    const barWidth = width / audioData.length;
    const multiplier = height / Math.max(...audioData);

    ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    audioData.forEach((value, index) => {
      const barHeight = value * multiplier;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });
  }, [audioData, isDarkMode]);

  return { canvasRef, isLoading };
};

export default useWaveform; 