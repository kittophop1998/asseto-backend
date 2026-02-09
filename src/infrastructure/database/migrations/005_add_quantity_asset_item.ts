import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('asset_items')
        .addColumn('quantity', 'integer')
        .execute();

    await db.schema
        .alterTable('asset_requests')
        .addColumn('quantity', 'integer')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('asset_items')
        .dropColumn('quantity')
        .execute();

    await db.schema
        .alterTable('asset_requests')
        .dropColumn('quantity')
        .execute();
}