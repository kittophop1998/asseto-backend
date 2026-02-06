import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('locations')
        .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
        .addColumn('name', 'varchar(255)', (col) => col.notNull())
        .addColumn('description', 'text', (col) => col.notNull())
        .addColumn('created_at', 'timestamp', (col) =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
        )
        .addColumn('updated_at', 'timestamp', (col) =>
            col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .dropTable('locations')
        .execute();
}