import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create categories table
  await db.schema
    .createTable('categories')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  // Create departments table
  await db.schema
    .createTable('departments')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('code', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('type', 'varchar(50)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  // Create assets table
  await db.schema
    .createTable('assets')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('code', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('category_id', 'integer', (col) => col.notNull())
    .addColumn('unit', 'varchar(50)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('total_quantity', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('available_quantity', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('minimum_qty', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('ACTIVE'))
    .addColumn('department_id', 'integer', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addForeignKeyConstraint(
      'assets_category_id_fk',
      ['category_id'],
      'categories',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .addForeignKeyConstraint(
      'assets_department_id_fk',
      ['department_id'],
      'departments',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .execute()

  // Create asset_items table
  await db.schema
    .createTable('asset_items')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('asset_id', 'integer', (col) => col.notNull())
    .addColumn('serial_number', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('AVAILABLE'))
    .addColumn('purchase_date', 'date', (col) => col.notNull())
    .addColumn('warranty_end_date', 'date', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addForeignKeyConstraint(
      'asset_items_asset_id_fk',
      ['asset_id'],
      'assets',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .execute()

  // Create asset_requests table
  await db.schema
    .createTable('asset_requests')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('code', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('asset_id', 'integer', (col) => col.notNull())
    .addColumn('requester_id', 'integer', (col) => col.notNull())
    .addColumn('department_id', 'integer', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('PENDING'))
    .addColumn('request_date', 'date', (col) => col.notNull())
    .addColumn('approver_id', 'integer')
    .addColumn('approval_date', 'date')
    .addColumn('fulfillment_date', 'date')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addForeignKeyConstraint(
      'asset_requests_asset_id_fk',
      ['asset_id'],
      'assets',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .addForeignKeyConstraint(
      'asset_requests_department_id_fk',
      ['department_id'],
      'departments',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .execute()

  // Create asset_returns table
  await db.schema
    .createTable('asset_returns')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('asset_request_code', 'varchar(50)', (col) => col.notNull())
    .addColumn('return_date', 'date', (col) => col.notNull())
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('PENDING'))
    .addColumn('notes', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  // Create indexes for better query performance
  await db.schema
    .createIndex('idx_assets_category_id')
    .on('assets')
    .column('category_id')
    .execute()

  await db.schema
    .createIndex('idx_assets_department_id')
    .on('assets')
    .column('department_id')
    .execute()

  await db.schema
    .createIndex('idx_asset_items_asset_id')
    .on('asset_items')
    .column('asset_id')
    .execute()

  await db.schema
    .createIndex('idx_asset_requests_asset_id')
    .on('asset_requests')
    .column('asset_id')
    .execute()

  await db.schema
    .createIndex('idx_asset_requests_department_id')
    .on('asset_requests')
    .column('department_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order due to foreign key constraints
  await db.schema.dropTable('asset_returns').execute()
  await db.schema.dropTable('asset_requests').execute()
  await db.schema.dropTable('asset_items').execute()
  await db.schema.dropTable('assets').execute()
  await db.schema.dropTable('departments').execute()
  await db.schema.dropTable('categories').execute()
}
