import React, { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from './Button';

interface TimerProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  onPause?: () => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ onStart, onStop, onPause, className }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isRunning, isPaused, seconds]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      onStart?.();
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    onPause?.();
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    onStop?.(Math.floor(seconds / 60));
    setSeconds(0);
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
          {formatTime(seconds)}
        </div>
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Começar Treino
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handlePause} className="flex items-center gap-2">
                <Pause className="h-4 w-4" />
                {isPaused ? 'Continuar' : 'Pausar'}
              </Button>
              <Button variant="destructive" onClick={handleStop} className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Finalizar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};