import { Migration } from '@mikro-orm/migrations';

export class Migration20251210142554 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_invoice_settings_store_id_unique";`);
    this.addSql(`alter table if exists "invoice_settings" drop column if exists "store_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice_settings" add column if not exists "store_id" text not null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invoice_settings_store_id_unique" ON "invoice_settings" ("store_id") WHERE deleted_at IS NULL;`);
  }

}
