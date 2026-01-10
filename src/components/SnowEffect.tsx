'use client';

import { useEffect, useState } from 'react';

interface SnowEffectProps {
  isActive: boolean;
}

export default function SnowEffect({ isActive }: SnowEffectProps) {
  const [flakes, setFlakes] = useState<Array<{ id: number; left: number; delay: number; duration: number; top: number }>>([]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setFlakes(prev => {
        const newFlake = {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          delay: 0,
          duration: 5 + Math.random() * 10,
          top: Math.random() * -50,
        };
        return [...prev.slice(-49), newFlake];
      });
    }, 200);

    return () => {
      clearInterval(interval);
      setFlakes([]);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="snow-container">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snow-flake"
          style={{
            left: `${flake.left}%`,
            top: `${flake.top}px`,
            animationDuration: `${flake.duration}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}