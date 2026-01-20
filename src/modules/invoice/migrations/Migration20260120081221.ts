import { Migration } from '@mikro-orm/migrations';

export class Migration20260120081221 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice" add column if not exists "created_by_event" text check ("created_by_event" in ('order.completed', 'order.fulfillment_created', 'payment.captured', 'manual')) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice" drop column if exists "created_by_event";`);
  }

}
