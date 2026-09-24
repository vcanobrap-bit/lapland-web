# lapland-web

Landing page autogestionable con **Payload CMS 3** sobre **Next.js 15**. El
cliente edita textos, imágenes, la foto del hero, servicios y datos de contacto
desde `/admin`, y publica sin tocar código.

La arquitectura y el porqué de cada decisión están en
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Payload CMS 3 · PostgreSQL ·
TailwindCSS v4 · ESLint · Prettier

## Setup local

Requiere Node 20.9+ y una base Postgres.

```bash
npm install
cp .env.example .env
```

Completar `.env`:

```bash
# Generar los dos secretos
openssl rand -base64 32   # PAYLOAD_SECRET
openssl rand -base64 32   # PREVIEW_SECRET
```

`DATABASE_URI` apunta a tu Postgres local. `BLOB_READ_WRITE_TOKEN` puede quedar
vacío: sin token, los medios se guardan en disco.

```bash
npm run migrate   # crea el schema
npm run seed      # publica el contenido inicial
npm run dev
```

- Sitio: http://localhost:3000
- Admin: http://localhost:3000/admin

`npm run seed` deja el sitio publicado y navegable, y crea el usuario
administrador `editor@lapland.cl` / `Lapland123!` (se puede cambiar con las
variables `SEED_EMAIL` y `SEED_PASSWORD`). **Cambiá esa contraseña antes de
exponer el sitio.**

Sin el seed, la primera visita a `/admin` pide crear el usuario administrador y
hay que cargar las siete secciones a mano. Después, en
**Contenido → Home** se arman las secciones y en **Configuración → Ajustes del
sitio** van el contacto, el footer y las redes. Ambos requieren **publicar**
para que aparezcan en el sitio.

Los mensajes del formulario de contacto llegan a **Contenido → Mensajes**.

## Scripts

| Comando                           | Qué hace                                        |
| --------------------------------- | ----------------------------------------------- |
| `npm run dev`                     | Servidor de desarrollo                          |
| `npm run build`                   | Build de producción                             |
| `npm run ci`                      | Migraciones + build. Es el comando de deploy    |
| `npm run typecheck`               | `tsc --noEmit`                                  |
| `npm run lint`                    | ESLint                                          |
| `npm run format`                  | Prettier                                        |
| `npm run generate:types`          | Regenera `src/payload-types.ts` desde el schema |
| `npm run generate:importmap`      | Regenera el import map del admin                |
| `npm run migrate:create <nombre>` | Crea una migración con los cambios de schema    |
| `npm run migrate`                 | Aplica las migraciones pendientes               |

Después de cambiar campos del CMS: `generate:types` y `migrate:create`.

## Deploy en Vercel

1. **Base de datos.** Crear una Postgres gestionada. En Supabase: Connect →
   **Transaction pooler**, tipo URI, el "Shared pooler"
   (`aws-0-<región>.pooler.supabase.com:6543`). La conexión directa de Supabase
   es solo IPv6 y Vercel no conecta por IPv6.

   Al string se le quitan los corchetes de la contraseña y se le agrega
   `?uselibpqcompat=true&sslmode=require`. El driver trata `sslmode=require` a
   secas como verificación completa del certificado, y el de Supabase lo firma
   su propia CA: sin ese parámetro falla con _self-signed certificate in
   certificate chain_.

2. **Blob store.** En Vercel, Storage → Create → Blob (acceso público). Se puede
   crear antes que el proyecto; su `BLOB_READ_WRITE_TOKEN` está en la pestaña
   `.env.local` del store. Sin esto las imágenes que suba el cliente se pierden:
   en serverless el filesystem es efímero.

3. **Preparar la base desde tu máquina**, con `DATABASE_URI` y
   `BLOB_READ_WRITE_TOKEN` de producción en tu `.env`:

   ```bash
   npm run migrate
   npm run seed
   ```

   El token tiene que estar **antes** del seed: sin él, las imágenes quedan en
   tu disco y producción no las ve, y un segundo seed no lo arregla porque
   reutiliza los medios que ya existen. El seed crea el usuario administrador
   (`SEED_EMAIL` / `SEED_PASSWORD`, o `editor@lapland.cl` / `Lapland123!` por
   defecto): entrá a `/admin` y **cambiá la contraseña**.

   Para probar el sitio contra esa base, `npm run build && npm run start`.
   **Nunca `npm run dev`** con la base de producción: en desarrollo Payload
   sincroniza el schema por su cuenta y deja la base marcada como "modo dev";
   después las migraciones del build de Vercel se frenan en una pregunta
   interactiva y el deploy falla. Si hubo builds locales contra otra base,
   borrar `.next/cache/fetch-cache` antes, o la home sale con datos viejos.

4. **Proyecto en Vercel.** Importar el repo, conectar el Blob store y cargar
   las variables de entorno:

   | Variable                 | Valor                                  |
   | ------------------------ | -------------------------------------- |
   | `DATABASE_URI`           | Connection string de Postgres          |
   | `PAYLOAD_SECRET`         | `openssl rand -base64 32`              |
   | `PREVIEW_SECRET`         | `openssl rand -base64 32`              |
   | `NEXT_PUBLIC_SERVER_URL` | El dominio final, sin barra al final   |
   | `BLOB_READ_WRITE_TOKEN`  | Lo inyecta Vercel al conectar el store |

   El build command ya viene en `vercel.json` (`npm run ci`: migraciones y
   después build). `DATABASE_URI` tiene que estar disponible **durante el
   build**, no solo en runtime: la home se prerenderiza consultando Payload.

   Con la base ya sembrada, el primer deploy sale completo. Si el seed se corre
   después de desplegar, hace falta un redeploy: el seed escribe sin pasar por
   Next y no puede invalidar el cache. A partir de ahí, publicar desde el panel
   actualiza el sitio solo.

`NEXT_PUBLIC_SERVER_URL` tiene que ser el dominio real: Payload lo usa para los
enlaces de preview y lo agrega a la allowlist CSRF.

## Pendientes conocidos

El formulario de contacto guarda los mensajes en la base pero **no notifica por
email ni tiene rate limiting**. Antes de abrirlo a tráfico real conviene sumar
un adaptador de email y un límite de envíos por IP.
