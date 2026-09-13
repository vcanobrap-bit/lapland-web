import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

/**
 * Vive dentro de (frontend) para heredar el encabezado, el pie y la tipografía
 * del sitio. La 404 por defecto de Next se ve como otra página.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24" width="narrow">
      <p className="text-caption text-ink/70 uppercase">Error 404</p>
      <h1 className="font-editorial text-h1 mt-4 text-balance">No encontramos esta página</h1>
      <p className="text-body-lg text-ink/80 mt-6">
        Puede que el enlace esté mal escrito o que la página ya no exista.
      </p>
      <Button href="/" className="mt-10 w-fit">
        Volver al inicio
      </Button>
    </Container>
  )
}
