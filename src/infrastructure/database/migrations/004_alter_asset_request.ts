import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('asset_requests')
        .addColumn('location', 'integer')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('asset_requests')
        .dropColumn('location')
        .execute();
}