import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_hero_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_about_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_stats_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_what_we_do_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_services_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_list_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum_home_blocks_contact_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_hero_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_about_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_stats_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_what_we_do_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_services_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_list_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_contact_surface" AS ENUM('primary', 'anchor');
  ALTER TABLE "home_blocks_hero" ADD COLUMN "surface" "enum_home_blocks_hero_surface" DEFAULT 'primary';
  ALTER TABLE "home_blocks_about" ADD COLUMN "surface" "enum_home_blocks_about_surface" DEFAULT 'primary';
  ALTER TABLE "home_blocks_stats" ADD COLUMN "surface" "enum_home_blocks_stats_surface" DEFAULT 'primary';
  ALTER TABLE "home_blocks_what_we_do" ADD COLUMN "surface" "enum_home_blocks_what_we_do_surface" DEFAULT 'primary';
  ALTER TABLE "home_blocks_services" ADD COLUMN "surface" "enum_home_blocks_services_surface" DEFAULT 'primary';
  ALTER TABLE "home_blocks_list" ADD COLUMN "surface" "enum_home_blocks_list_surface" DEFAULT 'primary';
  ALTER TABLE "home_blocks_contact" ADD COLUMN "surface" "enum_home_blocks_contact_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "surface" "enum__home_v_blocks_hero_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_about" ADD COLUMN "surface" "enum__home_v_blocks_about_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_stats" ADD COLUMN "surface" "enum__home_v_blocks_stats_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_what_we_do" ADD COLUMN "surface" "enum__home_v_blocks_what_we_do_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_services" ADD COLUMN "surface" "enum__home_v_blocks_services_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_list" ADD COLUMN "surface" "enum__home_v_blocks_list_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_contact" ADD COLUMN "surface" "enum__home_v_blocks_contact_surface" DEFAULT 'primary';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero" DROP COLUMN "surface";
  ALTER TABLE "home_blocks_about" DROP COLUMN "surface";
  ALTER TABLE "home_blocks_stats" DROP COLUMN "surface";
  ALTER TABLE "home_blocks_what_we_do" DROP COLUMN "surface";
  ALTER TABLE "home_blocks_services" DROP COLUMN "surface";
  ALTER TABLE "home_blocks_list" DROP COLUMN "surface";
  ALTER TABLE "home_blocks_contact" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_about" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_stats" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_what_we_do" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_services" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_list" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_contact" DROP COLUMN "surface";
  DROP TYPE "public"."enum_home_blocks_hero_surface";
  DROP TYPE "public"."enum_home_blocks_about_surface";
  DROP TYPE "public"."enum_home_blocks_stats_surface";
  DROP TYPE "public"."enum_home_blocks_what_we_do_surface";
  DROP TYPE "public"."enum_home_blocks_services_surface";
  DROP TYPE "public"."enum_home_blocks_list_surface";
  DROP TYPE "public"."enum_home_blocks_contact_surface";
  DROP TYPE "public"."enum__home_v_blocks_hero_surface";
  DROP TYPE "public"."enum__home_v_blocks_about_surface";
  DROP TYPE "public"."enum__home_v_blocks_stats_surface";
  DROP TYPE "public"."enum__home_v_blocks_what_we_do_surface";
  DROP TYPE "public"."enum__home_v_blocks_services_surface";
  DROP TYPE "public"."enum__home_v_blocks_list_surface";
  DROP TYPE "public"."enum__home_v_blocks_contact_surface";`)
}
