import { Migration } from '@mikro-orm/migrations';

export class Migration20251216141658 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice_settings" rename column "style" to "template_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice_settings" rename column "template_id" to "style";`);
  }

}
