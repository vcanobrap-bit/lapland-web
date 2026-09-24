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
| Server Components por defecto               | Solo cruza al cliente lo que necesita estado o el navegador: la aurora del hero, el menú móvil, el formulario.                                               |
| Los tipos del CMS no se escriben a mano     | `payload generate:types` los deriva del schema, así no pueden desincronizarse.                                                                               |
| Next 15.4.11 fijado                         | `@payloadcms/next` 3.88 no admite Next 15.5.                                                                                                                 |

## Estructura

```
src/
├── app/
│   ├── (frontend)/          El sitio público
│   │   ├── tokens.css       Design system anterior (copia literal)
│   │   ├── brand.css        Manual de identidad v1.0: paleta, movimiento
│   │   └── hero.css         Encabezado, menú móvil y hero
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
│   ├── layout/              Encabezado, menú móvil, footer, banner de borrador
│   ├── ui/                  Container, Section, MediaImage
│   └── RichText.tsx         Render y estilos del contenido richText
├── fields/                  Campos reutilizables entre bloques
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

| Componente                                 | Tipo                                          |
| ------------------------------------------ | --------------------------------------------- |
| `page.tsx`, `layout.tsx`                   | Server: obtienen datos                        |
| About, WhatWeDo, Services, Contact, Footer | Server: solo muestran contenido               |
| `Hero/Component.tsx`                       | Server: titular, textos, botones e imágenes   |
| `Hero/AuroraCanvas.tsx`                    | **Client**: aurora en WebGL                   |
| `Hero/HeroParallax.tsx`                    | **Client**: la escena sigue apenas al puntero |
| `layout/Header.tsx`                        | Server: logos y menú desde el CMS             |
| `layout/HeaderFrame.tsx`                   | **Client**: marca `data-scrolled` al bajar    |
| `layout/MobileMenu.tsx`                    | **Client**: abierto/cerrado, foco, Escape     |

Ni el hero ni el encabezado ni la sección de contacto son Client Components
enteros. Cada uno es un Server Component que monta adentro solo las piezas que
necesitan el navegador. Las imágenes del hero y los logos llegan a esas piezas
como children ya renderizados en el servidor.

### Encabezado y hero

Son las primeras piezas rediseñadas con el Manual de Identidad Visual v1.0. Sus
tokens viven en `brand.css`, aparte de `tokens.css`, que sigue siendo copia
literal del design system anterior y lo usa el resto del sitio. Sus estilos
viven en `hero.css` porque dependen de capas, estados y coreografías de
movimiento que en clases utilitarias quedarían ilegibles.

- **La escena del hero son tres capas**: imagen de fondo, aurora (WebGL) y un
  primer plano opcional con el cielo transparente. Con primer plano, la aurora
  pasa por detrás de las montañas. Ambas imágenes usan el punto de enfoque del
  fondo, así que siempre calzan.
- **El encabezado flota sobre el hero** solo si la página abre con uno. Se
  detecta en CSS con `body:has([data-hero-overlay])`: el layout no necesita
  saber qué bloque va primero y, si el cliente quita el hero, el encabezado
  vuelve a ser sólido. Es `sticky` con margen negativo; alto y margen cambian
  juntos al bajar, así que el contenido no salta.
- **El menú móvil se monta en `<body>` con un portal.** Dentro del encabezado
  quedaría atrapado: su `backdrop-filter` lo vuelve contenedor de los hijos con
  `position: fixed`.
- **Movimiento**: todo respeta `prefers-reduced-motion`. La aurora se dibuja solo
  mientras el hero está en pantalla y sin WebGL el hero se ve con la foto sola.
- **Fraunces** se carga con su eje óptico para el corte 9pt del manual.
  `font-optical-sizing: none` en `globals.css` evita que ese eje cambie cómo se
  ven los titulares de las demás secciones.

### Formulario de contacto

La sección de contacto sigue siendo Server Component; solo el formulario cruza
al cliente, y solo si el cliente lo activó desde el CMS.

- `ContactForm.tsx` usa `useActionState`, así que **funciona sin JavaScript**:
  sin hidratar, el navegador envía el formulario igual y Next ejecuta la acción.
- `actions.ts` es la Server Action. Valida en el servidor y no solo en el
  navegador: la validación del cliente es comodidad, no seguridad.
- El estado inicial y sus tipos viven en `formState.ts`, aparte. Un módulo con
  `'use server'` solo puede exportar funciones async; exportar el estado inicial
  desde `actions.ts` hace fallar la acción en tiempo de ejecución.
- Los mensajes se guardan en la colección `Submissions`, que tiene `create`
  cerrado para todos —incluido el admin—. La Server Action es la única vía de
  escritura y usa `overrideAccess`. Así el endpoint público `/api/submissions`
  responde 403 a cualquier intento de creación.
- Contra bots hay un campo trampa oculto: si viene completo, se responde como si
  todo hubiera funcionado y no se guarda nada.

Lo que **no** trae: rate limiting ni notificación por email. Para producción
conviene sumar límite de envíos por IP y un adaptador de email que avise al
cliente de cada mensaje nuevo.

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

## Contenido inicial

`npm run seed` (`src/scripts/seed.ts`) deja una base recién creada con el sitio
publicado: usuario administrador, medios de referencia, ajustes del sitio y las
siete secciones de la home. Existe porque un deploy nuevo arrancaría con el
panel vacío y siete secciones que cargar a mano.

Genera con sharp los placeholders de las secciones y la tarjeta para compartir
de 1200×630. Los logos y la foto del hero (con su recorte sin cielo) son
archivos reales de la marca y viven en `src/scripts/seed-assets/`.

Corre fuera de una request de Next, por lo que `revalidateTag` no está
disponible: el seed lo declara con `context.disableRevalidate` y el hook además
tolera la ausencia de contexto, para que ningún script que escriba por la Local
API pueda romperse por esto.

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
