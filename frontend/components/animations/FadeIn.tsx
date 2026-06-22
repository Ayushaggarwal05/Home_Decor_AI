'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className
}: FadeInProps) {
  const getDirections = () => {
    switch (direction) {
      case 'up': return { y: 15 };
      case 'down': return { y: -15 };
      case 'left': return { x: 15 };
      case 'right': return { x: -15 };
      default: return {};
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...getDirections()
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier easing for premium smooth transitions
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
