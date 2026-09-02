# lapland-web

Landing page autogestionable con **Payload CMS 3** sobre **Next.js 15**. El
cliente edita textos, imágenes, slides del hero, servicios y datos de contacto
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
npm run dev
```

- Sitio: http://localhost:3000
- Admin: http://localhost:3000/admin

La primera visita a `/admin` pide crear el usuario administrador. Después, en
**Contenido → Home** se arman las secciones y en **Configuración → Ajustes del
sitio** van el contacto, el footer y las redes. Ambos requieren **publicar**
para que aparezcan en el sitio.

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

1. **Base de datos.** Crear una Postgres gestionada (Neon o Supabase) y copiar
   la connection string con `?sslmode=require`.

2. **Blob store.** En el proyecto de Vercel, Storage → Create → Blob. Vercel
   inyecta `BLOB_READ_WRITE_TOKEN` automáticamente. Sin esto las imágenes que
   suba el cliente se pierden: en serverless el filesystem es efímero.

3. **Variables de entorno** en Vercel:

   | Variable                 | Valor                                    |
   | ------------------------ | ---------------------------------------- |
   | `DATABASE_URI`           | Connection string de Postgres            |
   | `PAYLOAD_SECRET`         | `openssl rand -base64 32`                |
   | `PREVIEW_SECRET`         | `openssl rand -base64 32`                |
   | `NEXT_PUBLIC_SERVER_URL` | El dominio final, sin barra al final     |
   | `BLOB_READ_WRITE_TOKEN`  | Lo inyecta Vercel al crear el Blob store |

4. **Build command:** `npm run ci` (corre las migraciones antes del build).

5. Después del primer deploy, entrar a `/admin` para crear el usuario
   administrador.

`NEXT_PUBLIC_SERVER_URL` tiene que ser el dominio real: Payload lo usa para los
enlaces de preview y lo agrega a la allowlist CSRF.
