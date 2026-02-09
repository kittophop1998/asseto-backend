import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('locations')
        .addColumn('is_active', 'integer')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('locations')
        .dropColumn('is_active')
        .execute();
}