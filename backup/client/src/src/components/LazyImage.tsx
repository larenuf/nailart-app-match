import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fadeDuration?: number;
  fallbackSrc?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export function LazyImage({
  src,
  alt,
  placeholder = '', 
  fadeDuration = 500,
  fallbackSrc = 'https://via.placeholder.com/300x200/f5f5f5/a0a0a0?text=Image+Not+Found',
  loadingComponent,
  errorComponent,
  className = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setError(false);
    setImageSrc(placeholder || src);
    
    // Create a new image element to preload
    const img = new Image();
    img.src = src;
    
    // Add event listeners to handle load and error events
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
        setIsLoaded(true);
      }
    };
    
    return () => {
      // Clean up the event listeners
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder, fallbackSrc]);
  
  useEffect(() => {
    // Use Intersection Observer for on-demand loading
    if (!imageRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoaded && !error) {
          const img = new Image();
          img.src = src;
          
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
            observer.disconnect();
          };
          
          img.onerror = () => {
            setError(true);
            if (fallbackSrc) {
              setImageSrc(fallbackSrc);
              setIsLoaded(true);
            }
            observer.disconnect();
          };
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
    
    observer.observe(imageRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [src, isLoaded, error, fallbackSrc]);
  
  // The style for fade-in effect
  const imageStyle = {
    opacity: isLoaded ? 1 : 0,
    transition: `opacity ${fadeDuration}ms ease-in-out`,
  };
  
  if (error && errorComponent) {
    return <>{errorComponent}</>;
  }
  
  return (
    <div className="relative" style={{ minHeight: '50px' }}>
      {!isLoaded && (
        loadingComponent || (
          <Skeleton className={`absolute inset-0 ${className}`} />
        )
      )}
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        style={imageStyle}
        loading="lazy"
        className={className}
        {...props}
      />
    </div>
  );
}