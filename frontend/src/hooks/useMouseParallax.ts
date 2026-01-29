import { useState, useEffect } from 'react';

export function useMouseParallax(intensity: number = 2) {
  const [mousePosition, setMousePosition] = useState({ normalizedX: 0, normalizedY: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  let lastUpdate = 0;

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Optimized mouse move handler with throttling
    const handleMouseMove = (event: MouseEvent) => {
      const currentTime = Date.now();
      
      // Throttle to ~30fps for better performance
      if (currentTime - lastUpdate < 33) return;
      lastUpdate = currentTime;
      
      const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2 * intensity;
      const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2 * intensity;
      
      setMousePosition({ 
        normalizedX: isReducedMotion ? 0 : normalizedX, 
        normalizedY: isReducedMotion ? 0 : normalizedY 
      });
    };

    // Use passive event listener for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [intensity, isReducedMotion]);

  return { mousePosition, isReducedMotion };
}