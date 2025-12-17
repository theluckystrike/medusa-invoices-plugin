import { Migration } from '@mikro-orm/migrations';

export class Migration20251216133501 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" drop column if exists "is_active";`);

    this.addSql(`alter table if exists "invoice" add column if not exists "status" text check ("status" in ('queued', 'generating', 'completed', 'failed')) not null, add column if not exists "completed_at" timestamptz null, add column if not exists "template_id" text check ("template_id" in ('clean', 'classic', 'compact')) not null, add column if not exists "template_version" text not null, add column if not exists "settings_snapshot" jsonb not null, add column if not exists "error_message" text null;`);

    this.addSql(`alter table if exists "invoice_settings" drop column if exists "image_url", drop column if exists "header_text", drop column if exists "additional_header_content", drop column if exists "additional_footer_content", drop column if exists "business", drop column if exists "auto_order_completed", drop column if exists "auto_payment_captured", drop column if exists "auto_fullfillment_created";`);

    this.addSql(`alter table if exists "invoice_settings" add column if not exists "header_logo_url" text null, add column if not exists "header_logo_text" text null, add column if not exists "header_content" jsonb null, add column if not exists "footer_content" jsonb null, add column if not exists "store_name" text null, add column if not exists "store_address" text null, add column if not exists "store_tax_id" text null, add column if not exists "bank_account_iban" text null, add column if not exists "bank_account_swift" text null, add column if not exists "auto_generate_on" text[] not null default '{}';`);
    this.addSql(`alter table if exists "invoice_settings" rename column "header_type" to "header_logo_type";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice" drop column if exists "status", drop column if exists "completed_at", drop column if exists "template_id", drop column if exists "template_version", drop column if exists "settings_snapshot", drop column if exists "error_message";`);

    this.addSql(`alter table if exists "invoice" add column if not exists "is_active" boolean not null default true;`);

    this.addSql(`alter table if exists "invoice_settings" drop column if exists "header_logo_url", drop column if exists "header_logo_text", drop column if exists "header_content", drop column if exists "footer_content", drop column if exists "store_name", drop column if exists "store_address", drop column if exists "store_tax_id", drop column if exists "bank_account_iban", drop column if exists "bank_account_swift", drop column if exists "auto_generate_on";`);

    this.addSql(`alter table if exists "invoice_settings" add column if not exists "image_url" text null, add column if not exists "header_text" text null, add column if not exists "additional_header_content" jsonb null, add column if not exists "additional_footer_content" jsonb null, add column if not exists "business" jsonb not null default '{"name":"","address":"","tax_id":"","iban":"","swift":""}', add column if not exists "auto_order_completed" boolean not null default false, add column if not exists "auto_payment_captured" boolean not null default false, add column if not exists "auto_fullfillment_created" boolean not null default false;`);
    this.addSql(`alter table if exists "invoice_settings" rename column "header_logo_type" to "header_type";`);
  }

}
