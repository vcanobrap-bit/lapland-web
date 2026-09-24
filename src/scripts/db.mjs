/**
 * Postgres local para desarrollar, sin instalar nada aparte.
 *
 *   npm run db
 *
 * Levanta un Postgres real (paquete embedded-postgres) con los datos en `.db/`,
 * carpeta que no se versiona. La primera vez crea la base; después la reutiliza.
 * Queda corriendo en esta terminal: Ctrl+C lo detiene.
 *
 * Se conecta con la línea local de `.env.example`:
 *   DATABASE_URI=postgres://lapland:lapland@127.0.0.1:5432/lapland_web
 *
 * Es solo para tu máquina: la clave es fija y conocida. Producción usa Supabase.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import EmbeddedPostgres from 'embedded-postgres'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const databaseDir = path.join(root, '.db')
const port = Number(process.env.DB_PORT ?? 5432)

const pg = new EmbeddedPostgres({
  databaseDir,
  user: 'lapland',
  password: 'lapland',
  port,
  persistent: true,
})

const isNew = !existsSync(path.join(databaseDir, 'PG_VERSION'))
if (isNew) await pg.initialise()
await pg.start()
if (isNew) await pg.createDatabase('lapland_web')

console.log(`\nPostgres local listo en 127.0.0.1:${port} (base lapland_web).`)
if (isNew) console.log('Base nueva: corré `npm run migrate` y `npm run seed` en otra terminal.')
console.log('Ctrl+C para detenerlo.\n')

const stop = async () => {
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
// Mantiene vivo el proceso hasta que se detenga.
setInterval(() => {}, 1 << 30)
