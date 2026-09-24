import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Editado a mano: antes de borrar los slides, la primera imagen de cada hero
  // pasa a ser su imagen de fondo, para no perder una foto ya cargada. Se hace
  // también en las versiones, así los borradores y el historial la conservan.
  await db.execute(sql`
   UPDATE "home_blocks_hero" AS h
    SET "background_id" = s."image_id"
    FROM (
      SELECT DISTINCT ON ("_parent_id") "_parent_id", "image_id"
      FROM "home_blocks_hero_slides"
      WHERE "image_id" IS NOT NULL
      ORDER BY "_parent_id", "_order"
    ) AS s
    WHERE s."_parent_id" = h."id" AND h."background_id" IS NULL;
  UPDATE "_home_v_blocks_hero" AS h
    SET "background_id" = s."image_id"
    FROM (
      SELECT DISTINCT ON ("_parent_id") "_parent_id", "image_id"
      FROM "_home_v_blocks_hero_slides"
      WHERE "image_id" IS NOT NULL
      ORDER BY "_parent_id", "_order"
    ) AS s
    WHERE s."_parent_id" = h."id" AND h."background_id" IS NULL;
  DROP TABLE "home_blocks_hero_slides" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slides" CASCADE;
  ALTER TABLE "home_blocks_hero" DROP COLUMN "surface";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "surface";
  DROP TYPE "public"."enum_home_blocks_hero_surface";
  DROP TYPE "public"."enum__home_v_blocks_hero_surface";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_hero_surface" AS ENUM('primary', 'anchor');
  CREATE TYPE "public"."enum__home_v_blocks_hero_surface" AS ENUM('primary', 'anchor');
  CREATE TABLE "home_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "_home_v_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "home_blocks_hero" ADD COLUMN "surface" "enum_home_blocks_hero_surface" DEFAULT 'primary';
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "surface" "enum__home_v_blocks_hero_surface" DEFAULT 'primary';
  ALTER TABLE "home_blocks_hero_slides" ADD CONSTRAINT "home_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slides" ADD CONSTRAINT "home_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slides" ADD CONSTRAINT "_home_v_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slides" ADD CONSTRAINT "_home_v_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_hero_slides_order_idx" ON "home_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_slides_parent_id_idx" ON "home_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_slides_image_idx" ON "home_blocks_hero_slides" USING btree ("image_id");
  CREATE INDEX "_home_v_blocks_hero_slides_order_idx" ON "_home_v_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_slides_parent_id_idx" ON "_home_v_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_slides_image_idx" ON "_home_v_blocks_hero_slides" USING btree ("image_id");`)
}
