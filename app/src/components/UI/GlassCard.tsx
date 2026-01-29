import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glowColor?: string;
  hoverScale?: number;
}

export function GlassCard({
  children,
  className,
  delay = 0,
  glowColor,
  hoverScale = 1,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        hoverScale > 1
          ? {
              scale: hoverScale,
              boxShadow: glowColor
                ? `0 0 30px ${glowColor}40, 0 25px 50px -12px rgba(0, 0, 0, 0.5)`
                : undefined,
            }
          : undefined
      }
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-[rgba(15,23,42,0.6)]',
        'backdrop-blur-[16px] backdrop-saturate-[180%]',
        'border border-[rgba(255,255,255,0.08)]',
        'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]',
        className
      )}
      style={
        glowColor
          ? {
              boxShadow: `0 0 20px ${glowColor}20, 0 25px 50px -12px rgba(0, 0, 0, 0.5)`,
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
