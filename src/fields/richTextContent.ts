import {
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'

type RichTextContentOptions = {
  name?: string
  label?: string
  required?: boolean
}

/**
 * Campo de contenido con un editor deliberadamente acotado: negrita, cursiva,
 * enlaces, listas y dos niveles de subtítulo.
 *
 * El set completo de Lexical le deja al cliente alineaciones, colores y tamaños
 * con los que se rompe la consistencia visual del sitio. Acá se le da lo que
 * necesita para redactar, y el diseño lo sigue definiendo el CSS.
 */
export const richTextContent = ({
  name = 'content',
  label = 'Contenido',
  required = false,
}: RichTextContentOptions = {}): Field => ({
  name,
  type: 'richText',
  label,
  required,
  editor: lexicalEditor({
    features: [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      LinkFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      // h1 lo aporta el hero: dentro del contenido solo hay subtítulos.
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
      InlineToolbarFeature(),
    ],
  }),
})
