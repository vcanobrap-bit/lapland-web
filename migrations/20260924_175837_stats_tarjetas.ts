import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_stats_items_accent" AS ENUM('boreas', 'verde', 'teal');
  CREATE TYPE "public"."enum_home_blocks_stats_items_visual" AS ENUM('none', 'people', 'yearCost');
  CREATE TYPE "public"."enum__home_v_blocks_stats_items_accent" AS ENUM('boreas', 'verde', 'teal');
  CREATE TYPE "public"."enum__home_v_blocks_stats_items_visual" AS ENUM('none', 'people', 'yearCost');
  ALTER TABLE "home_blocks_stats_items" ADD COLUMN "lead" varchar;
  ALTER TABLE "home_blocks_stats_items" ADD COLUMN "highlight" varchar;
  ALTER TABLE "home_blocks_stats_items" ADD COLUMN "accent" "enum_home_blocks_stats_items_accent" DEFAULT 'boreas';
  ALTER TABLE "home_blocks_stats_items" ADD COLUMN "visual" "enum_home_blocks_stats_items_visual" DEFAULT 'none';
  ALTER TABLE "home_blocks_stats_items" ADD COLUMN "annual_amount" numeric DEFAULT 1000000000000;
  ALTER TABLE "home_blocks_stats" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "home_blocks_stats" ADD COLUMN "source" varchar;
  ALTER TABLE "_home_v_blocks_stats_items" ADD COLUMN "lead" varchar;
  ALTER TABLE "_home_v_blocks_stats_items" ADD COLUMN "highlight" varchar;
  ALTER TABLE "_home_v_blocks_stats_items" ADD COLUMN "accent" "enum__home_v_blocks_stats_items_accent" DEFAULT 'boreas';
  ALTER TABLE "_home_v_blocks_stats_items" ADD COLUMN "visual" "enum__home_v_blocks_stats_items_visual" DEFAULT 'none';
  ALTER TABLE "_home_v_blocks_stats_items" ADD COLUMN "annual_amount" numeric DEFAULT 1000000000000;
  ALTER TABLE "_home_v_blocks_stats" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_home_v_blocks_stats" ADD COLUMN "source" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_stats_items" DROP COLUMN "lead";
  ALTER TABLE "home_blocks_stats_items" DROP COLUMN "highlight";
  ALTER TABLE "home_blocks_stats_items" DROP COLUMN "accent";
  ALTER TABLE "home_blocks_stats_items" DROP COLUMN "visual";
  ALTER TABLE "home_blocks_stats_items" DROP COLUMN "annual_amount";
  ALTER TABLE "home_blocks_stats" DROP COLUMN "eyebrow";
  ALTER TABLE "home_blocks_stats" DROP COLUMN "source";
  ALTER TABLE "_home_v_blocks_stats_items" DROP COLUMN "lead";
  ALTER TABLE "_home_v_blocks_stats_items" DROP COLUMN "highlight";
  ALTER TABLE "_home_v_blocks_stats_items" DROP COLUMN "accent";
  ALTER TABLE "_home_v_blocks_stats_items" DROP COLUMN "visual";
  ALTER TABLE "_home_v_blocks_stats_items" DROP COLUMN "annual_amount";
  ALTER TABLE "_home_v_blocks_stats" DROP COLUMN "eyebrow";
  ALTER TABLE "_home_v_blocks_stats" DROP COLUMN "source";
  DROP TYPE "public"."enum_home_blocks_stats_items_accent";
  DROP TYPE "public"."enum_home_blocks_stats_items_visual";
  DROP TYPE "public"."enum__home_v_blocks_stats_items_accent";
  DROP TYPE "public"."enum__home_v_blocks_stats_items_visual";`)
}
