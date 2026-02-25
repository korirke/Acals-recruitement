// src/components/ui/OptimizedImage.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  priority?: boolean;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallback = '/placeholder.png',
  priority = false,
  fill = false,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(normalizeImageUrl(src) || fallback);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.warn(`Failed to load image: ${imgSrc}, using fallback`);
    setImgSrc(fallback);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          style={{ objectFit }}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          className={isLoading ? 'animate-pulse bg-gray-200' : ''}
        />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 500}
      height={height || 500}
      onError={handleError}
      onLoad={handleLoad}
      priority={priority}
      className={`${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}
      style={{ objectFit }}
    />
  );
}
