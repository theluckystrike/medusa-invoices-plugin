import { Migration } from '@mikro-orm/migrations';

export class Migration20251204145735 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "invoice_template" ("id" text not null, "order_id" text not null, "style" text check ("style" in ('clean', 'classic', 'compact')) not null, "header_type" text check ("header_type" in ('heading', 'image', 'none')) not null, "image_url" text null, "header_text" text null, "additional_header_content" jsonb null, "additional_footer_content" jsonb null, "business" jsonb not null default '{"name":"","address":"","tax_id":"","iban":"","swift":""}', "auto_order_completed" boolean not null default false, "auto_payment_captured" boolean not null default false, "auto_fullfillment_created" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "invoice_template_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_invoice_template_deleted_at" ON "invoice_template" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "invoice_template" cascade;`);
  }

}
