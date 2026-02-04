'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMusicStore } from '@/stores/musicStore';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceCreatedRef = useRef(false);
  const [barHeights, setBarHeights] = useState<number[]>([8, 8, 8, 8, 8]);
  const animationRef = useRef<number | null>(null);

  const { isPlaying, hasAsked, volume, togglePlaying } = useMusicStore();

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = new Audio('/music.mp3');
      audio.loop = true;
      audio.volume = volume;
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [volume]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Visualizer animation
  const updateVisualizer = useCallback(() => {
    if (analyserRef.current && isPlaying) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      const heights = [
        8 + (dataArray[1] / 255) * 20,
        8 + (dataArray[2] / 255) * 20,
        8 + (dataArray[3] / 255) * 20,
        8 + (dataArray[4] / 255) * 20,
        8 + (dataArray[5] / 255) * 20,
      ];
      setBarHeights(heights);
      animationRef.current = requestAnimationFrame(updateVisualizer);
    }
  }, [isPlaying]);

  // Play/pause control
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      // Create audio context and analyser on first play
      if (!audioContextRef.current) {
        const ctx = new AudioContext();
        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 32;

        audioContextRef.current = ctx;
        analyserRef.current = analyserNode;

        if (!sourceCreatedRef.current) {
          const source = ctx.createMediaElementSource(audio);
          source.connect(analyserNode);
          analyserNode.connect(ctx.destination);
          sourceCreatedRef.current = true;
        }
      }

      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      audio.play().catch(console.error);
      animationRef.current = requestAnimationFrame(updateVisualizer);
    } else {
      audio.pause();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setBarHeights([8, 8, 8, 8, 8]);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateVisualizer]);

  if (!hasAsked) return null;

  return (
    <motion.button
      onClick={togglePlaying}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1a1a2e] border border-purple-500/50 flex items-center justify-center gap-[3px] hover:border-purple-500 transition-colors group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={isPlaying ? 'Pause Music' : 'Play Music'}
    >
      {/* DJ Visualizer Bars */}
      <div className="flex items-end gap-[2px] h-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-[4px] rounded-full"
            style={{
              background: isPlaying
                ? 'linear-gradient(to top, #a855f7, #22d3ee)'
                : '#4a4a6a',
            }}
            animate={{
              height: isPlaying
                ? [barHeights[i], 16 + i * 4, barHeights[i], 24, barHeights[i]]
                : 8,
            }}
            transition={{
              duration: 0.6,
              repeat: isPlaying ? Infinity : 0,
              delay: i * 0.08,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Glow effect when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-500/20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Tooltip */}
      <span className="absolute bottom-full mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isPlaying ? 'Pause' : 'Play'} Music
      </span>
    </motion.button>
  );
}
