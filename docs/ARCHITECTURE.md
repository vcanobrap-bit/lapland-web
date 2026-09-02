# Arquitectura

Landing page autogestionable con Payload CMS 3 sobre Next.js 15. El objetivo del
proyecto es validar el flujo de trabajo —que el cliente pueda cambiar todo el
contenido sin tocar código— y dejar una base reutilizable para proyectos
siguientes.

## Decisiones de fondo

| Decisión                                    | Por qué                                                                                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Payload corre dentro de la app Next         | Payload 3 se monta en el App Router. Un solo deploy, una sola base de código, sin CORS ni servidor aparte.                                                   |
| Bloques en vez de secciones fijas           | Las secciones fijas no se reutilizan: el próximo proyecto quiere otras. Con bloques, el cliente ordena la página y sumar una sección es agregar una carpeta. |
| Los datos del sitio viven en `SiteSettings` | El email o el teléfono se editan en un solo lugar y valen en el footer y en la sección de contacto.                                                          |
| Server Components por defecto               | Solo cruza al cliente lo que necesita estado. Hoy eso es el slider del hero y nada más.                                                                      |
| Los tipos del CMS no se escriben a mano     | `payload generate:types` los deriva del schema, así no pueden desincronizarse.                                                                               |
| Next 15.4.11 fijado                         | `@payloadcms/next` 3.88 no admite Next 15.5.                                                                                                                 |

## Estructura

```
src/
├── app/
│   ├── (frontend)/          El sitio público
│   ├── (payload)/           Admin y API. Generado por Payload, no se edita
│   └── next/                Entrada y salida del modo borrador
├── blocks/                  Una carpeta por sección: config del CMS + componente
│   ├── <Bloque>/config.ts   Campos que ve el cliente en el admin
│   ├── <Bloque>/Component.tsx
│   ├── index.ts             Registro de bloques disponibles
│   └── RenderBlocks.tsx     blockType → componente
├── collections/             Users (login del admin), Media (imágenes)
├── globals/                 Home (bloques), SiteSettings (datos del sitio)
│   └── hooks/               Hooks de Payload: revalidación al publicar
├── components/
│   ├── layout/              Footer, banner de borrador
│   ├── ui/                  Container, Section, MediaImage
│   └── RichText.tsx         Render y estilos del contenido richText
├── fields/                  Campos reutilizables entre bloques
├── hooks/                   Hooks de React (solo Client Components)
├── access/                  Reglas de permisos compartidas
├── lib/
│   ├── payload.ts           Único punto que instancia Payload
│   ├── queries/             Única capa que consulta Payload
│   ├── cache.ts             Etiquetas del Data Cache
│   └── media.ts, cn.ts, preview.ts
└── payload.config.ts
```

## Flujo de datos

```
(frontend)/page.tsx          Server Component
      ↓ getHome({ draft }) + getSiteSettings({ draft })
lib/queries/                 única capa que conoce Payload
      ↓ payload.findGlobal({ depth: 2 })
lib/payload.ts               Local API: consulta directa, sin salto HTTP
      ↓ tipos generados
<RenderBlocks blocks settings />
      ↓ registro blockType → componente
<Hero /> <About /> <Services /> …    componentes puros, solo props
```

Reglas que sostienen esto:

- Ningún componente consulta Payload. Reciben props.
- Los datos compartidos (`SiteSettings`) los pasa `RenderBlocks` a todos los
  bloques, para que uno nuevo que los necesite ya los tenga tipados.
- `depth: 2` resuelve las imágenes a documentos de Media en la misma consulta.

## Server Components y Client Components

Server Component por defecto. Client Component solo donde hay estado, efectos o
interacción real.

| Componente                                 | Tipo                                              |
| ------------------------------------------ | ------------------------------------------------- |
| `page.tsx`, `layout.tsx`                   | Server: obtienen datos                            |
| About, WhatWeDo, Services, Contact, Footer | Server: solo muestran contenido                   |
| `Hero/Component.tsx`                       | Server: título, subtítulo y botón no necesitan JS |
| `Hero/HeroSlider.tsx`                      | **Client**: slide activo, autoplay, navegación    |
| `hooks/useCarousel.ts`                     | Client: lógica del slider                         |

El hero no es Client Component entero. Es un Server Component que monta adentro
un slider cliente al que le pasa solo los campos que usa, no el documento de
Media completo. Resultado: la home entera suma 1.8 kB de JavaScript.

El slider está construido sobre `scroll-snap`, así que funciona sin JavaScript
—scroll nativo y swipe en móvil— y la hidratación solo agrega autoplay, flechas
e indicadores. El autoplay respeta `prefers-reduced-motion`.

Cuando haga falta un formulario de contacto, el patrón es el mismo: la sección
sigue siendo Server Component y el formulario, con sus estados de carga, éxito y
error, es un Client Component con Server Action.

## Cache y publicación

Es la pieza que hace que el CMS sea autogestionable de verdad.

```
Cliente publica en /admin
      ↓ hook afterChange del global
revalidateTag('global_home')
      ↓
Next descarta el cache → la siguiente visita ve el cambio
```

- Las queries de contenido publicado van en `unstable_cache` con una etiqueta
  por global. La etiqueta se arma en `lib/cache.ts` para que la que escribe el
  hook y la que lee la query no puedan divergir en silencio.
- Solo se revalida al publicar o despublicar. Guardar un borrador no cambia lo
  que ve el visitante.
- Los borradores no se cachean nunca: el preview muestra el estado actual.
- La home sigue siendo estática. Next la prerenderiza y solo la sirve dinámica
  cuando hay cookie de borrador.

### Preview de borradores

El botón "Preview" del admin abre `/next/preview`, que exige **dos** cosas: el
secreto del enlace y una sesión válida de Payload. Con el secreto solo, un
enlace filtrado dejaría los borradores del cliente a la vista de cualquiera.
También valida que la ruta de destino sea interna, para que el endpoint no sirva
como redirector abierto.

## Tipado

`payload generate:types` genera `src/payload-types.ts` desde el schema. Cada
bloque declara `interfaceName`, así que Payload emite una interfaz con nombre
propio (`HeroBlock`, `AboutBlock`…) y los componentes tipan sus props contra
ella.

`RenderBlocks` usa un mapped type sobre los `blockType` del CMS: registrar un
bloque sin escribir su componente rompe el build con
`Property 'x' is missing`. El CMS y el render no pueden quedar desincronizados.

Nadie escribe a mano un tipo del modelo. Se agrega un campo, se corre
`generate:types`, y TypeScript marca dónde falta usarlo.

## Cómo agregar una sección nueva

1. `src/blocks/MiSeccion/config.ts` con los campos, incluyendo `interfaceName`.
2. `src/blocks/MiSeccion/Component.tsx`, Server Component salvo que necesite estado.
3. Registrar la config en `src/blocks/index.ts`.
4. Registrar el componente en `BLOCK_COMPONENTS` de `RenderBlocks.tsx`.
5. `npm run generate:types` y `npm run migrate:create`.

Si se salta el paso 4, el build falla. Es a propósito.

## Base de datos

Postgres. En desarrollo `push: true` sincroniza el schema solo. En producción
manda `migrations/`: sincronizar automáticamente contra una base con datos es
cómo se pierden datos.

Después de cambiar cualquier campo: `npm run migrate:create <nombre>`. El build
de producción corre `payload migrate` antes de `next build`.

Los archivos de `migrations/` son generados y quedan fuera de lint y typecheck,
igual que `payload-types.ts`. El gate real es `payload migrate` en el build, que
falla ruidosamente si una migración está rota.

## Medios

Colección `Media` con `alt` obligatorio: ninguna imagen del sitio puede quedar
sin describir. Tres tamaños (thumbnail 400, card 768, hero 1920).

En local los archivos van al disco. En producción el plugin de Vercel Blob se
activa solo si existe `BLOB_READ_WRITE_TOKEN`. Hace falta: en serverless el
filesystem es efímero y las imágenes que sube el cliente desaparecerían.

Payload antepone `serverURL` a las rutas de medios locales y `next/image` las
trata como remotas. `toImageSrc` las devuelve relativas cuando son del mismo
origen; las de Vercel Blob viven en otro host y las cubre `images.remotePatterns`.
