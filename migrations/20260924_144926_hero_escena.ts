import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero" ADD COLUMN "highlight" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "secondary_cta_href" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "background_id" integer;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "foreground_id" integer;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "aurora" boolean DEFAULT true;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "highlight" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "secondary_cta_href" varchar;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "background_id" integer;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "foreground_id" integer;
  ALTER TABLE "_home_v_blocks_hero" ADD COLUMN "aurora" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "brand_logo_light_id" integer;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_brand_logo_light_id" integer;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero" ADD CONSTRAINT "home_blocks_hero_foreground_id_media_id_fk" FOREIGN KEY ("foreground_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero" ADD CONSTRAINT "_home_v_blocks_hero_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero" ADD CONSTRAINT "_home_v_blocks_hero_foreground_id_media_id_fk" FOREIGN KEY ("foreground_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_brand_logo_light_id_media_id_fk" FOREIGN KEY ("brand_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_brand_logo_light_id_media_id_fk" FOREIGN KEY ("version_brand_logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_blocks_hero_background_idx" ON "home_blocks_hero" USING btree ("background_id");
  CREATE INDEX "home_blocks_hero_foreground_idx" ON "home_blocks_hero" USING btree ("foreground_id");
  CREATE INDEX "_home_v_blocks_hero_background_idx" ON "_home_v_blocks_hero" USING btree ("background_id");
  CREATE INDEX "_home_v_blocks_hero_foreground_idx" ON "_home_v_blocks_hero" USING btree ("foreground_id");
  CREATE INDEX "site_settings_brand_brand_logo_light_idx" ON "site_settings" USING btree ("brand_logo_light_id");
  CREATE INDEX "_site_settings_v_version_brand_version_brand_logo_light_idx" ON "_site_settings_v" USING btree ("version_brand_logo_light_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero" DROP CONSTRAINT "home_blocks_hero_background_id_media_id_fk";
  
  ALTER TABLE "home_blocks_hero" DROP CONSTRAINT "home_blocks_hero_foreground_id_media_id_fk";
  
  ALTER TABLE "_home_v_blocks_hero" DROP CONSTRAINT "_home_v_blocks_hero_background_id_media_id_fk";
  
  ALTER TABLE "_home_v_blocks_hero" DROP CONSTRAINT "_home_v_blocks_hero_foreground_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_brand_logo_light_id_media_id_fk";
  
  ALTER TABLE "_site_settings_v" DROP CONSTRAINT "_site_settings_v_version_brand_logo_light_id_media_id_fk";
  
  DROP INDEX "home_blocks_hero_background_idx";
  DROP INDEX "home_blocks_hero_foreground_idx";
  DROP INDEX "_home_v_blocks_hero_background_idx";
  DROP INDEX "_home_v_blocks_hero_foreground_idx";
  DROP INDEX "site_settings_brand_brand_logo_light_idx";
  DROP INDEX "_site_settings_v_version_brand_version_brand_logo_light_idx";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "highlight";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "background_id";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "foreground_id";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "aurora";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "highlight";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "secondary_cta_href";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "background_id";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "foreground_id";
  ALTER TABLE "_home_v_blocks_hero" DROP COLUMN "aurora";
  ALTER TABLE "site_settings" DROP COLUMN "brand_logo_light_id";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_brand_logo_light_id";`)
}
