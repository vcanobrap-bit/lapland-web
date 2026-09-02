import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_submissions_status" AS ENUM('new', 'read', 'replied');
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_submissions_status" DEFAULT 'new' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "submissions_id" integer;
  ALTER TABLE "home_blocks_contact" ADD COLUMN "show_form" boolean DEFAULT true;
  ALTER TABLE "_home_v_blocks_contact" ADD COLUMN "show_form" boolean DEFAULT true;
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "submissions_id";
  ALTER TABLE "home_blocks_contact" DROP COLUMN "show_form";
  ALTER TABLE "_home_v_blocks_contact" DROP COLUMN "show_form";
  DROP TYPE "public"."enum_submissions_status";`)
}
