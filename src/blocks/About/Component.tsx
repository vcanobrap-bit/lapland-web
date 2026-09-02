import type { AboutBlock } from '@/payload-types'

import { RichText } from '@/components/RichText'
import { Section } from '@/components/ui/Section'
import { MediaImage } from '@/components/ui/MediaImage'
import { cn } from '@/lib/cn'
import { resolveMedia } from '@/lib/media'

type AboutProps = AboutBlock & { anchorId: string; tone: 'default' | 'subtle' }

/** Server Component: solo obtiene y muestra contenido, sin estado ni interacción. */
export function About({ anchorId, content, image, title, tone }: AboutProps) {
  const media = resolveMedia(image)

  return (
    <Section id={anchorId} tone={tone}>
      <div className={cn('grid gap-12', media && 'md:grid-cols-2 md:items-center md:gap-16')}>
        <div className={cn(!media && 'max-w-3xl')}>
          <h2 className="text-ink text-3xl font-medium tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          <RichText data={content} className="mt-6" />
        </div>

        {media ? (
          <MediaImage
            media={media}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full rounded-lg object-cover"
          />
        ) : null}
      </div>
    </Section>
  )
}
