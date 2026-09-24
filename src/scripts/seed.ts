import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { bold, p, paragraphs } from './lexical'
import { placeholder, shareImage } from './placeholders'

/**
 * Deja el sitio publicado y navegable en una base recién creada.
 *
 * Sin esto, un deploy nuevo arranca con el panel vacío y hay que cargar siete
 * secciones a mano antes de poder mostrar nada. El contenido de acá es el punto
 * de partida: se edita desde el panel, no en este archivo.
 *
 *   npm run seed
 *
 * Vuelve a publicar el contenido en cada corrida. El usuario administrador solo
 * se crea si todavía no existe ninguno.
 */

const ADMIN = {
  name: 'Editor',
  email: process.env.SEED_EMAIL ?? 'editor@lapland.cl',
  password: process.env.SEED_PASSWORD ?? 'Lapland123!',
}

/** Fotos y logos reales de la marca, versionados junto al seed. */
const ASSETS = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed-assets')
const asset = (file: string) => readFile(path.join(ASSETS, file))

const BRAND = {
  name: 'Lapland',
  tagline: 'Salud Mental Laboral · Bienestar y Resiliencia Organizacional',
}

const seed = async (): Promise<void> => {
  const payload = await getPayload({ config })

  // --- Usuario administrador -------------------------------------------------
  const { totalDocs: userCount } = await payload.count({ collection: 'users' })

  if (userCount === 0) {
    await payload.create({ collection: 'users', data: ADMIN })
    payload.logger.info(`Usuario administrador creado: ${ADMIN.email}`)
  } else {
    payload.logger.info('Ya existe un usuario: no se crea otro.')
  }

  // --- Medios ----------------------------------------------------------------
  /**
   * Sube un medio, o reutiliza el que ya exista con el mismo texto alternativo.
   *
   * Payload renombra los archivos al colisionar, así que sin esta búsqueda cada
   * corrida del seed dejaría una copia más y la biblioteca del cliente se
   * llenaría de placeholders casi idénticos.
   */
  const upload = async (
    name: string,
    alt: string,
    data: Buffer,
    mimeType: string,
    // Punto de enfoque en %: decide el encuadre de la imagen al recortarse.
    focal?: { focalX: number; focalY: number },
  ) => {
    const existing = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
      pagination: false,
    })

    const found = existing.docs[0]
    if (found) return found.id

    const doc = await payload.create({
      collection: 'media',
      data: { alt, ...focal },
      file: { name, data, mimetype: mimeType, size: data.byteLength },
    })
    return doc.id
  }

  const [aboutImage, share, logo, logoLight, heroBackground, heroForeground] = await Promise.all([
    placeholder(1),
    shareImage(BRAND.name, BRAND.tagline),
    asset('logo.png'),
    asset('logo-claro.png'),
    asset('hero-montanas.jpg'),
    asset('hero-montanas-recorte.webp'),
  ])

  const aboutImageId = await upload(
    'hero-2.jpg',
    'Sesión de acompañamiento a liderazgos',
    aboutImage,
    'image/jpeg',
  )
  const logoId = await upload('logo.png', 'Lapland', logo, 'image/png')
  const logoLightId = await upload('logo-claro.png', 'Lapland (blanco)', logoLight, 'image/png')
  // El enfoque bajo (70%) recorta cielo y no montaña: el texto va sobre las cumbres.
  const heroBackgroundId = await upload(
    'hero-montanas.jpg',
    'Cordillera en capas bajo un cielo de nubes claras',
    heroBackground,
    'image/jpeg',
    { focalX: 50, focalY: 70 },
  )
  const heroForegroundId = await upload(
    'hero-montanas-recorte.webp',
    'Cordillera en capas, recortada sin el cielo',
    heroForeground,
    'image/webp',
    { focalX: 50, focalY: 70 },
  )
  const shareId = await upload(
    'compartir.png',
    'Lapland · Salud mental laboral',
    share,
    'image/png',
  )
  payload.logger.info('Medios de referencia listos.')

  // --- Ajustes del sitio -----------------------------------------------------
  // Sin request de Next no hay cache que invalidar; el hook lo sabe por acá.
  const context = { disableRevalidate: true }

  await payload.updateGlobal({
    slug: 'site-settings',
    context,
    data: {
      brand: { name: BRAND.name, logo: logoId, logoLight: logoLightId, tagline: BRAND.tagline },
      nav: [
        { label: 'Quiénes somos', href: '#quienes-somos' },
        { label: 'Propósito', href: '#que-hacemos' },
        { label: 'Servicios', href: '#servicios' },
        { label: 'Recursos', href: '#recursos' },
        { label: 'Conversemos', href: '#contacto', highlight: true },
      ],
      contact: {
        email: 'hola@lapland.cl',
        phone: '+56 9 1234 5678',
        address: 'Santiago, Chile',
      },
      footer: { copyright: 'Lapland Consultoría' },
      socials: [
        { platform: 'instagram', url: 'https://instagram.com/lapland' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/lapland' },
      ],
      seo: {
        title: 'Lapland · Cuidar la salud mental laboral es estrategia',
        description:
          'Consultoría en sostenibilidad humano-organizacional: diagnóstico de riesgos psicosociales, planes de acción y formación para equipos y liderazgos.',
        image: shareId,
      },
      _status: 'published',
    },
  })

  // --- Home ------------------------------------------------------------------
  await payload.updateGlobal({
    slug: 'home',
    context,
    data: {
      layout: [
        {
          blockType: 'hero',
          anchor: 'inicio',
          // El salto de línea es el corte del titular.
          title: 'Cuidar la salud laboral\nes estrategia',
          highlight: 'estrategia',
          subtitle:
            'Leemos cómo tu organización sostiene hoy a sus personas y construimos con tus líderes el sistema para que el desempeño y el bienestar crezcan juntos.',
          cta: { label: 'Agenda una conversación', href: '#contacto' },
          secondaryCta: { label: 'Ver cómo trabajamos', href: '#servicios' },
          background: heroBackgroundId,
          foreground: heroForegroundId,
          aurora: true,
        },
        {
          // Justo después del hero: la evidencia que respalda la promesa.
          blockType: 'stats',
          anchor: 'datos',
          eyebrow: 'Salud mental y trabajo',
          title: 'Una erosión silenciosa de las personas que sostienen los resultados.',
          source: 'Fuente: OMS y OIT, 2022',
          items: [
            {
              lead: 'En el mundo',
              value: '1 de cada 8',
              highlight: '1',
              accent: 'boreas',
              label:
                'personas vive con un trastorno de salud mental y esto representa una de las principales causas de ausentismo laboral.',
              visual: 'people',
            },
            {
              lead: 'Más de',
              value: 'US$ 1 billón',
              highlight: '1 billón',
              accent: 'verde',
              label:
                'al año le cuestan a la economía mundial el estrés laboral y los riesgos psicosociales.',
              visual: 'yearCost',
              annualAmount: 1_000_000_000_000,
            },
          ],
        },
        {
          blockType: 'about',
          surface: 'primary',
          anchor: 'quienes-somos',
          title: 'Quiénes somos',
          image: aboutImageId,
          content: p(
            'Anhelamos y trabajamos para crear espacios laborales que cuiden a las personas, donde el ',
            bold('bienestar, la salud mental y la seguridad'),
            ' impulsen una sostenibilidad auténtica y una excelencia organizacional duradera.',
          ),
        },
        {
          blockType: 'whatWeDo',
          surface: 'primary',
          anchor: 'que-hacemos',
          title: 'Nuestro propósito',
          content: p(
            'En Lapland te ayudamos a anticiparte y convertir la prevención en una ventaja competitiva: menos licencias, mejor clima y normativa al día.',
          ),
        },
        {
          blockType: 'services',
          surface: 'primary',
          anchor: 'servicios',
          title: 'Consultoría y herramientas para la salud mental laboral',
          items: [
            {
              title: 'Diagnóstico y evaluación',
              description: p(
                'Riesgos psicosociales, alineados a Ley Karin y estándares internacionales.',
              ),
            },
            {
              title: 'Plan de acción a 6 meses',
              description: p('Para reducir licencias, mejorar clima y cumplir normativas.'),
            },
            {
              title: 'Formación y capacitación',
              description: p(
                'Programas 100% online y talleres vivenciales sobre autocuidado, liderazgo empático, resolución de conflicto, trabajo en equipo y gestión del estrés.',
              ),
            },
            {
              title: 'Mentoring',
              description: p('Acompañamiento con enfoque integral y personalizado.'),
            },
            {
              title: 'Primeros auxilios psicológicos',
              description: p('Respuesta preparada ante situaciones críticas.'),
            },
            {
              title: 'Webinar',
              description: p('Instancias abiertas de formación para toda la organización.'),
            },
          ],
        },
        {
          blockType: 'list',
          surface: 'primary',
          anchor: 'recursos',
          title: 'Recursos 24/7',
          intro: p(
            'Material digital exclusivo para reforzar hábitos saludables en toda la organización.',
          ),
          items: [
            { label: 'Manuales' },
            { label: 'Protocolos' },
            { label: 'E-book' },
            { label: 'Podcast' },
            { label: 'Videos' },
            { label: 'Botiquín emocional' },
          ],
        },
        {
          blockType: 'contact',
          surface: 'primary',
          anchor: 'contacto',
          title: 'Hablemos',
          showForm: true,
          text: paragraphs(
            'Contanos qué está pasando en tu organización y vemos cómo podemos ayudar.',
          ),
        },
      ],
      _status: 'published',
    },
  })

  payload.logger.info('Contenido publicado. El sitio ya es navegable.')
}

await seed()
process.exit(0)
