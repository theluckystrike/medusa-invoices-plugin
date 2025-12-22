import { Migration } from "@mikro-orm/migrations";

export class Migration20251219100000 extends Migration {
  override async up(): Promise<void> {
    // makni stari / krivi check constraint
    this.addSql(`
      alter table "invoice_settings"
      drop constraint if exists "invoice_settings_header_type_check";
    `);
  }

  override async down(): Promise<void> {
    // vrati constraint (AKTUALNI enum koji želiš)
    this.addSql(`
      alter table "invoice_settings"
      add constraint "invoice_settings_header_type_check"
      check ("header_logo_type" in ('none', 'text', 'image'));
    `);
  }
}
