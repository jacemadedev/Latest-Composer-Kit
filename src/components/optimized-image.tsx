'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { ImageLoadingFallback } from './loading-boundary'

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallback?: React.ReactNode
}

export function OptimizedImage({ fallback, alt, ...props }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error && fallback) {
    return <>{fallback}</>
  }

  return (
    <>
      {isLoading && <ImageLoadingFallback />}
      <Image
        {...props}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setError(true)
        }}
        style={{
          display: isLoading ? 'none' : 'block',
        }}
      />
    </>
  )
}
