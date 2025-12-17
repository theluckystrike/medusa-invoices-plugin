import { Migration } from '@mikro-orm/migrations';

export class Migration20251216135035 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop index if exists "IDX_invoice_number_unique";`);
    this.addSql(`alter table if exists "invoice" drop column if exists "number";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice" add column if not exists "number" text not null;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invoice_number_unique" ON "invoice" ("number") WHERE deleted_at IS NULL;`);
  }

}
