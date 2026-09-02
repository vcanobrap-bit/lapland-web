import Link from 'next/link'

import { Container } from '@/components/ui/Container'

/**
 * Vive dentro de (frontend) para heredar el encabezado, el pie y la tipografía
 * del sitio. La 404 por defecto de Next se ve como otra página.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24" width="narrow">
      <p className="text-muted text-sm tracking-wide uppercase">Error 404</p>
      <h1 className="text-ink mt-3 text-3xl font-medium tracking-tight text-balance md:text-4xl">
        No encontramos esta página
      </h1>
      <p className="text-muted mt-4">
        Puede que el enlace esté mal escrito o que la página ya no exista.
      </p>
      <Link
        href="/"
        className="bg-ink mt-10 inline-flex w-fit items-center rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </Container>
  )
}
