import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { cn } from '@/lib/cn'

type RichTextProps = {
  data: SerializedEditorState | null | undefined
  className?: string
}

/**
 * Renderiza el contenido de un campo richText.
 *
 * Los estilos van acá y no en cada bloque: cualquier sección con texto largo
 * hereda la misma tipografía, interlineado y tratamiento de enlaces y listas.
 */
export function RichText({ data, className }: RichTextProps) {
  if (!data) return null

  return (
    <LexicalRichText
      data={data}
      disableContainer
      className={cn(
        'text-muted space-y-4 leading-relaxed',
        '[&_h2]:text-ink [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight',
        '[&_h3]:text-ink [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-medium',
        '[&_strong]:text-ink [&_strong]:font-medium',
        '[&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4',
        '[&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5',
        className,
      )}
    />
  )
}
