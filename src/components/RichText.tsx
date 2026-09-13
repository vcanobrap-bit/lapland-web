import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/cn'

type RichTextProps = {
  data: SerializedEditorState | null | undefined
  className?: string
  /** Sobre la superficie de anclaje el texto invierte su color. */
  onAnchor?: boolean
}

/**
 * Renderiza el contenido de un campo richText con la tipografía del design
 * system: Inter para el cuerpo, DM Sans para los subtítulos que el cliente
 * escriba dentro del contenido.
 *
 * Los estilos van acá y no en cada bloque: cualquier sección con texto largo
 * hereda el mismo interlineado y tratamiento de enlaces y listas.
 */
export function RichText({ data, className, onAnchor = false }: RichTextProps) {
  if (!data) return null

  return (
    <LexicalRichText
      data={data}
      // Sin contenedor, el converter descarta el div envolvente y con él la
      // className: los estilos de abajo quedarían sin ningún elemento al que
      // aplicarse. Se paga un div para que la tipografía del contenido exista.
      className={cn(
        'text-body space-y-4',
        onAnchor ? 'text-on-anchor/80' : 'text-ink/80',
        '[&_h2]:font-ui [&_h2]:text-h3 [&_h2]:mt-12 [&_h2]:mb-1',
        '[&_h3]:font-ui [&_h3]:text-h4 [&_h3]:mt-8 [&_h3]:mb-1',
        onAnchor
          ? '[&_h2]:text-on-anchor [&_h3]:text-on-anchor'
          : '[&_h2]:text-ink [&_h3]:text-ink',
        onAnchor ? '[&_strong]:text-on-anchor' : '[&_strong]:text-ink',
        '[&_strong]:font-medium',
        '[&_a]:underline [&_a]:underline-offset-4',
        onAnchor ? '[&_a]:text-on-anchor' : '[&_a]:text-ink',
        '[&_li]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5',
        className,
      )}
    />
  )
}
