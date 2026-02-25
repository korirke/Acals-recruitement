// src/components/ui/AvatarImage.tsx
'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface AvatarImageProps {
  src: string | null | undefined;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AvatarImage({ 
  src, 
  alt, 
  size = 'md',
  className = '' 
}: AvatarImageProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  if (!src || imageError) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-xl overflow-hidden bg-linear-to-br from-primary-100 to-orange-100 dark:from-primary-900/30 dark:to-orange-900/30 flex items-center justify-center`}>
        <User className={`${iconSizes[size]} text-primary-400`} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-xl overflow-hidden bg-linear-to-br from-primary-100 to-orange-100 dark:from-primary-900/30 dark:to-orange-900/30`}>
      <img
        src={normalizeImageUrl(src)}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}