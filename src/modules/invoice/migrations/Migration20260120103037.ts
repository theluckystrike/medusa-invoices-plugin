import { Migration } from '@mikro-orm/migrations';

export class Migration20260120103037 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" add column if not exists "order_id" text not null;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_invoice_order_id" ON "invoice" ("order_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_invoice_order_id";`);
    this.addSql(`alter table if exists "invoice" drop column if exists "order_id";`);
  }

}
