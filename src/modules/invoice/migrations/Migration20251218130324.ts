import { Migration } from '@mikro-orm/migrations';

export class Migration20251218130324 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" add column if not exists "order_display_id" integer not null;`);

    this.addSql(`alter table if exists "invoice_settings" alter column "template_id" type text using ("template_id"::text);`);
    this.addSql(`alter table if exists "invoice_settings" alter column "template_id" set default 'clean';`);
    this.addSql(`alter table if exists "invoice_settings" alter column "header_content" type text using ("header_content"::text);`);
    this.addSql(`alter table if exists "invoice_settings" alter column "footer_content" type text using ("footer_content"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice" drop column if exists "order_display_id";`);

    this.addSql(`alter table if exists "invoice_settings" alter column "template_id" drop default;`);
    this.addSql(`alter table if exists "invoice_settings" alter column "template_id" type text using ("template_id"::text);`);
    this.addSql(`alter table if exists "invoice_settings" alter column "header_content" type jsonb using ("header_content"::jsonb);`);
    this.addSql(`alter table if exists "invoice_settings" alter column "footer_content" type jsonb using ("footer_content"::jsonb);`);
  }

}
