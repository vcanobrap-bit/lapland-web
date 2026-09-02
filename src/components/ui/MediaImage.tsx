import Image from 'next/image'

import type { Media } from '@/payload-types'

import { cn } from '@/lib/cn'

type MediaImageProps = {
  media: Media | number | null | undefined
  className?: string
  sizes?: string
  /** Solo para la imagen visible al cargar la página (LCP). */
  priority?: boolean
  fill?: boolean
}

/**
 * Renderiza un documento de Media. El `alt` sale del CMS —es obligatorio en la
 * colección—, así que ninguna imagen del sitio puede quedar sin describir.
 * Devuelve null si la relación no está resuelta o el campo está vacío.
 */
export function MediaImage({ media, className, sizes, priority, fill }: MediaImageProps) {
  if (!media || typeof media !== 'object' || !media.url) return null

  const { alt, url, width, height } = media

  if (fill) {
    return (
      <Image
        alt={alt}
        src={url}
        fill
        sizes={sizes ?? '100vw'}
        priority={priority}
        className={cn('object-cover', className)}
      />
    )
  }

  return (
    <Image
      alt={alt}
      src={url}
      width={width ?? 1200}
      height={height ?? 800}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
