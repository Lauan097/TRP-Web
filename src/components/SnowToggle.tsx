'use client';

import { useEffect } from 'react';

interface SnowToggleProps {
  onToggle: (active: boolean) => void;
  isActive: boolean;
}

export default function SnowToggle({ onToggle, isActive }: SnowToggleProps) {
  useEffect(() => {
    const saved = localStorage.getItem('snow-effect');
    if (saved !== null) {
      const active = saved === 'true';
      onToggle(active);
    }
  }, [onToggle]);

  const handleToggle = () => {
    const newState = !isActive;
    localStorage.setItem('snow-effect', newState.toString());
    onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors cursor-pointer"
      title={isActive ? 'Desligar neve' : 'Ligar neve'}
    >
      ❄
    </button>
  );
}