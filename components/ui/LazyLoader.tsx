'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyLoader({
  children,
  fallback,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
}: LazyLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback || <div className="min-h-[400px]" />}
    </div>
  );
}
