import React from 'react';
import { ShoppingBag } from 'lucide-react';

export interface ProductImageProps {
  images?: string[] | null;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'contain';
  width?: number;
  height?: number;
  priority?: boolean;
  index?: number;
  fallbackClassName?: string;
}

/**
 * A reusable product image component that handles the common cases
 * of displaying product images with fallbacks.
 */
export function ProductImage({
  images,
  alt,
  className = "w-full h-full",
  aspectRatio = "square",
  fallbackClassName = "w-full h-full flex items-center justify-center bg-muted",
  index = 0
}: ProductImageProps) {
  // Handle empty images array
  const hasValidImages = images && images.length > 0;
  const imageUrl = hasValidImages ? images[Math.min(index, images.length - 1)] : null;
  
  // Define aspect ratio styles
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    contain: ""
  };
  
  const containerClassName = `${aspectRatioClasses[aspectRatio]} ${className}`;
  
  if (!imageUrl) {
    return (
      <div className={fallbackClassName}>
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <img
      src={imageUrl}
      alt={alt}
      className={containerClassName}
      loading="lazy"
    />
  );
}
