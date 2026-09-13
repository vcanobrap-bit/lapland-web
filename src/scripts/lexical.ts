/**
 * Constructores mínimos de estado Lexical para el seed.
 *
 * Payload guarda el richText como el árbol serializado del editor. Escribirlo a
 * mano en cada dato es ilegible, así que estas funciones arman los nodos que el
 * contenido de la landing necesita: párrafos, negritas y listas.
 */

const IS_BOLD = 1

type Node = Record<string, unknown>

/**
 * La forma que aceptan los campos richText en los tipos generados por Payload:
 * un objeto abierto con su raíz. Es más laxa que `SerializedEditorState`, que
 * el editor usa en tiempo de ejecución.
 */
export type RichTextValue = { [key: string]: unknown; root: Node }

const text = (value: string, format = 0): Node => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

export const bold = (value: string): Node => text(value, IS_BOLD)

const paragraph = (children: Node[]): Node => ({
  type: 'paragraph',
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const root = (children: Node[]): RichTextValue => ({
  root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
})

/** Un párrafo, aceptando tramos con formato. */
export const p = (...parts: Array<string | Node>): RichTextValue =>
  root([paragraph(parts.map((part) => (typeof part === 'string' ? text(part) : part)))])

/** Varios párrafos simples. */
export const paragraphs = (...values: string[]): RichTextValue =>
  root(values.map((value) => paragraph([text(value)])))

/** Un párrafo introductorio seguido de una lista con viñetas. */
export const intro = (lead: string, items: string[]): RichTextValue =>
  root([
    paragraph([text(lead)]),
    {
      type: 'list',
      listType: 'bullet',
      tag: 'ul',
      start: 1,
      children: items.map((item, index) => ({
        type: 'listitem',
        children: [text(item)],
        direction: 'ltr',
        format: '',
        indent: 0,
        value: index + 1,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  ])
