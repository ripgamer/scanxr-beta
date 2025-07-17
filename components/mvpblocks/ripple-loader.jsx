'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const hasMountedOnce = useRef(false);

  useEffect(() => {
    if (!hasMountedOnce.current) {
      hasMountedOnce.current = true;
      return; // ✅ Skip first render
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Adjust as needed

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center space-x-1">
        {[...Array(7)].map((_, index) => (
          <motion.div
            key={index}
            className="h-8 w-2 rounded-full bg-primary"
            animate={{
              scaleY: [0.5, 1.5, 0.5],
              scaleX: [1, 0.8, 1],
              translateY: ['0%', '-15%', '0%'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
