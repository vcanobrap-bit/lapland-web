/**
 * Separa la parte destacada de un texto, sin distinguir mayúsculas. La usan el
 * titular del hero y las cifras: el editor escribe el texto completo y, aparte,
 * qué parte resaltar. Devuelve null si esa parte no aparece.
 */
export const splitHighlight = (text: string, highlight: string) => {
  const start = text.toLocaleLowerCase('es').indexOf(highlight.toLocaleLowerCase('es'))
  if (start === -1) return null
  const end = start + highlight.length
  return { before: text.slice(0, start), match: text.slice(start, end), after: text.slice(end) }
}
