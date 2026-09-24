import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // La fuente pasa de cada cifra a la sección: si la sección no tiene, hereda la
  // primera fuente cargada en sus cifras antes de que esa columna desaparezca.
  await db.execute(sql`
   UPDATE "home_blocks_stats" AS s SET "source" = i."source"
   FROM (SELECT DISTINCT ON ("_parent_id") "_parent_id", "source" FROM "home_blocks_stats_items"
         WHERE "source" IS NOT NULL ORDER BY "_parent_id", "_order") AS i
   WHERE i."_parent_id" = s."id" AND s."source" IS NULL;
   UPDATE "_home_v_blocks_stats" AS s SET "source" = i."source"
   FROM (SELECT DISTINCT ON ("_parent_id") "_parent_id", "source" FROM "_home_v_blocks_stats_items"
         WHERE "source" IS NOT NULL ORDER BY "_parent_id", "_order") AS i
   WHERE i."_parent_id" = s."id" AND s."source" IS NULL;`)

  await db.execute(sql`
   ALTER TABLE "home_blocks_stats_items" DROP COLUMN "source";
  ALTER TABLE "home_blocks_stats" DROP COLUMN "intro";
  ALTER TABLE "home_blocks_stats" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_stats_items" DROP COLUMN "source";
  ALTER TABLE "_home_v_blocks_stats" DROP COLUMN "intro";
  ALTER TABLE "_home_v_blocks_stats" DROP COLUMN "surface";
  DROP TYPE "public"."enum_home_blocks_stats_surface";
  DROP TYPE "public"."enum__home_v_blocks_stats_surface";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_stats_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_stats_surface" AS ENUM('primary', 'anchor');
  ALTER TABLE "home_blocks_stats_items" ADD COLUMN "source" varchar;
  ALTER TABLE "home_blocks_stats" ADD COLUMN "intro" jsonb;
  ALTER TABLE "home_blocks_stats" ADD COLUMN "surface" "enum_home_blocks_stats_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_stats_items" ADD COLUMN "source" varchar;
  ALTER TABLE "_home_v_blocks_stats" ADD COLUMN "intro" jsonb;
  ALTER TABLE "_home_v_blocks_stats" ADD COLUMN "surface" "enum__home_v_blocks_stats_surface" DEFAULT 'primary';`)
}
