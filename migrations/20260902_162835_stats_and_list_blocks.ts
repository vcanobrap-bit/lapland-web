import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"source" varchar
  );
  
  CREATE TABLE "home_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" jsonb,
  	"anchor" varchar DEFAULT 'datos',
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "home_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" jsonb,
  	"anchor" varchar DEFAULT 'recursos',
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"source" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" jsonb,
  	"anchor" varchar DEFAULT 'datos',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" jsonb,
  	"anchor" varchar DEFAULT 'recursos',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "home_blocks_stats_items" ADD CONSTRAINT "home_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats" ADD CONSTRAINT "home_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_list_items" ADD CONSTRAINT "home_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_list" ADD CONSTRAINT "home_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stats_items" ADD CONSTRAINT "_home_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_stats" ADD CONSTRAINT "_home_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_list_items" ADD CONSTRAINT "_home_v_blocks_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_list" ADD CONSTRAINT "_home_v_blocks_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_stats_items_order_idx" ON "home_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "home_blocks_stats_items_parent_id_idx" ON "home_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stats_order_idx" ON "home_blocks_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_stats_parent_id_idx" ON "home_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_stats_path_idx" ON "home_blocks_stats" USING btree ("_path");
  CREATE INDEX "home_blocks_list_items_order_idx" ON "home_blocks_list_items" USING btree ("_order");
  CREATE INDEX "home_blocks_list_items_parent_id_idx" ON "home_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_list_order_idx" ON "home_blocks_list" USING btree ("_order");
  CREATE INDEX "home_blocks_list_parent_id_idx" ON "home_blocks_list" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_list_path_idx" ON "home_blocks_list" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_stats_items_order_idx" ON "_home_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_stats_items_parent_id_idx" ON "_home_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_stats_order_idx" ON "_home_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_stats_parent_id_idx" ON "_home_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_stats_path_idx" ON "_home_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_list_items_order_idx" ON "_home_v_blocks_list_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_list_items_parent_id_idx" ON "_home_v_blocks_list_items" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_list_order_idx" ON "_home_v_blocks_list" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_list_parent_id_idx" ON "_home_v_blocks_list" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_list_path_idx" ON "_home_v_blocks_list" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_blocks_stats_items" CASCADE;
  DROP TABLE "home_blocks_stats" CASCADE;
  DROP TABLE "home_blocks_list_items" CASCADE;
  DROP TABLE "home_blocks_list" CASCADE;
  DROP TABLE "_home_v_blocks_stats_items" CASCADE;
  DROP TABLE "_home_v_blocks_stats" CASCADE;
  DROP TABLE "_home_v_blocks_list_items" CASCADE;
  DROP TABLE "_home_v_blocks_list" CASCADE;`)
}
