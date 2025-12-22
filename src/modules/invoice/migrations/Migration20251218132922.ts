import { Migration } from '@mikro-orm/migrations';

export class Migration20251218132922 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "invoice_settings" drop constraint if exists "invoice_settings_header_logo_type_check";`);

    this.addSql(`alter table if exists "invoice_settings" add constraint "invoice_settings_header_logo_type_check" check("header_logo_type" in ('text', 'image', 'none'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "invoice_settings" drop constraint if exists "invoice_settings_header_logo_type_check";`);

    this.addSql(`alter table if exists "invoice_settings" add constraint "invoice_settings_header_logo_type_check" check("header_logo_type" in ('heading', 'image', 'none'));`);
  }

}
