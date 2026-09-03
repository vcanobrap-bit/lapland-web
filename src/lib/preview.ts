/**
 * Enlace que abre el sitio en modo borrador. Lo usa el botón de preview del
 * admin. El secreto solo se expone a quien ya está logueado en el panel.
 */
export const previewUrl = (path = '/'): string => {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  const params = new URLSearchParams({
    path,
    secret: process.env.PREVIEW_SECRET ?? '',
  })

  return `${base}/next/preview?${params.toString()}`
}
