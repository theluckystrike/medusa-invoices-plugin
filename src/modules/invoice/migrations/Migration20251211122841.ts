import { Migration } from '@mikro-orm/migrations';

export class Migration20251211122841 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" drop constraint if exists "invoice_invoice_number_unique";`);
    this.addSql(`alter table if exists "invoice" drop column if exists "order_id";`);

    this.addSql(`alter table if exists "invoice" add column if not exists "invoice_number" text null, add column if not exists "pdf_url" text null;`);
    this.addSql(`alter table if exists "invoice" rename column "isActive" to "is_active";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invoice_invoice_number_unique" ON "invoice" ("invoice_number") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_invoice_invoice_number_unique";`);
    this.addSql(`alter table if exists "invoice" drop column if exists "invoice_number", drop column if exists "pdf_url";`);

    this.addSql(`alter table if exists "invoice" add column if not exists "order_id" text not null;`);
    this.addSql(`alter table if exists "invoice" rename column "is_active" to "isActive";`);
  }

}
