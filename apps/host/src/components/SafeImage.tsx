import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function SafeImage({ src, alt, fallback, className, loading = 'lazy' }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageSource = hasError && fallback ? fallback : src;

  if (hasError && !fallback) {
    return (
      <div className={`${className ?? ''} flex items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400`} role="img" aria-label={alt}>
        ?
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
}
