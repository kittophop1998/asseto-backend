import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idx_assets_status')
    .on('assets')
    .column('status')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_assets_status')
    .on('assets')
    .execute()
}
