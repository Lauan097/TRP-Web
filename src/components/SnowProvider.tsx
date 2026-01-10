'use client';

import { useState } from 'react';
import SnowEffect from './SnowEffect';
import SnowToggle from './SnowToggle';

interface SnowProviderProps {
  children: React.ReactNode;
}

export default function SnowProvider({ children }: SnowProviderProps) {
  const [snowActive, setSnowActive] = useState(true);

  return (
    <>
      {children}
      <SnowEffect isActive={snowActive} />
      <SnowToggle onToggle={setSnowActive} isActive={snowActive} />
    </>
  );
}