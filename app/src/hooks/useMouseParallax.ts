import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMouseParallax(maxTilt: number = 5) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isReducedMotion) return;

    const now = performance.now();
    // Throttle to ~60fps
    if (now - lastUpdateRef.current < 16) return;
    lastUpdateRef.current = now;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const normalizedX = (clientX / innerWidth - 0.5) * 2;
      const normalizedY = (clientY / innerHeight - 0.5) * 2;

      setMousePosition({
        x: clientX,
        y: clientY,
        normalizedX: normalizedX * maxTilt,
        normalizedY: -normalizedY * maxTilt,
      });
    });
  }, [isReducedMotion, maxTilt]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  return {
    mousePosition,
    isReducedMotion,
  };
}
