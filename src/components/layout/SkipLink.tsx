/**
 * Salta la navegación y lleva el foco al contenido.
 *
 * Invisible hasta que recibe foco. Sin esto, quien navega con teclado o lector
 * de pantalla tiene que recorrer todo el menú antes de llegar al contenido.
 */
export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="bg-anchor text-on-anchor font-ui text-body-sm rounded-button sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-5 focus:py-3"
    >
      Saltar al contenido
    </a>
  )
}
