import { Migration } from '@mikro-orm/migrations';

export class Migration20251211132833 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" drop constraint if exists "invoice_number_unique";`);
    this.addSql(`drop index if exists "IDX_invoice_invoice_number_unique";`);

    this.addSql(`alter table if exists "invoice" rename column "invoice_number" to "number";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invoice_number_unique" ON "invoice" ("number") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_invoice_number_unique";`);

    this.addSql(`alter table if exists "invoice" rename column "number" to "invoice_number";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invoice_invoice_number_unique" ON "invoice" ("invoice_number") WHERE deleted_at IS NULL;`);
  }

}
