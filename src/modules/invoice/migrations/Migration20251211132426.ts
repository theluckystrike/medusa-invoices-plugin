import { Migration } from '@mikro-orm/migrations';

export class Migration20251211132426 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" alter column "invoice_number" type text using ("invoice_number"::text);`);
    this.addSql(`alter table if exists "invoice" alter column "invoice_number" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice" alter column "invoice_number" type text using ("invoice_number"::text);`);
    this.addSql(`alter table if exists "invoice" alter column "invoice_number" drop not null;`);
  }

}
