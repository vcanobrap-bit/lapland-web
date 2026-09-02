/**
 * Aviso de modo borrador. Es un Server Component: el botón de salida es un
 * enlace normal a la ruta que apaga el draft mode, sin JavaScript de por medio.
 */
export function PreviewBanner() {
  return (
    <div className="bg-ink flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-2 text-center text-xs text-white">
      <span>Estás viendo borradores sin publicar.</span>
      <a href="/next/exit-preview" className="underline underline-offset-4">
        Volver al sitio publicado
      </a>
    </div>
  )
}
