import { Migration } from '@mikro-orm/migrations';

export class Migration20251216142133 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice_settings" add column if not exists "template_version" text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice_settings" drop column if exists "template_version";`);
  }

}
