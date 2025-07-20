'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Particles } from '@/components/ui/particles'

export default function GlobalParticles() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState('#ffffff');
  useEffect(() => {
    setColor(resolvedTheme === 'dark' ? '#ffffff' : '#e60a64');
  }, [resolvedTheme]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Particles className="w-full h-full" quantity={100} ease={80} refresh color={color} />
    </div>
  );
}
