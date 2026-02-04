import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Disable foreign key checks to allow dropping tables
  await sql`SET FOREIGN_KEY_CHECKS = 0`.execute(db)

  // Drop existing tables to recreate with correct schema
  await db.schema.dropTable('asset_returns').ifExists().execute()
  await db.schema.dropTable('asset_users').ifExists().execute()
  await db.schema.dropTable('asset_requests').ifExists().execute()
  await db.schema.dropTable('asset_items').ifExists().execute()
  await db.schema.dropTable('assets').ifExists().execute()
  await db.schema.dropTable('users').ifExists().execute()
  await db.schema.dropTable('departments').ifExists().execute()
  await db.schema.dropTable('categories').ifExists().execute()

  // Re-enable foreign key checks
  await sql`SET FOREIGN_KEY_CHECKS = 1`.execute(db)

  // Create categories table
  await db.schema
    .createTable('categories')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('prefix', 'varchar(50)', (col) => col.notNull())
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
    .addColumn('type', 'varchar(50)', (col) => col.notNull()) // BACKOFFICE or BRANCH
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  // Create users table
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('username', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('password_hash', 'varchar(255)', (col) => col.notNull())
    .addColumn('full_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('department_id', 'integer', (col) => col.notNull())
    .addColumn('is_approved', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('role', 'varchar(50)', (col) => col.notNull().defaultTo('STAFF')) // ADMIN, STAFF, MANAGER
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('deleted_at', 'timestamp')
    .addForeignKeyConstraint(
      'fk_users_department_id',
      ['department_id'],
      'departments',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .execute()

  // Create assets table
  await db.schema
    .createTable('assets')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('code', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('category_id', 'integer', (col) => col.notNull())
    .addColumn('department_id', 'integer', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('minimum_qty', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('NORMAL')) // NORMAL or LOW_STOCK
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('deleted_at', 'timestamp')
    .addForeignKeyConstraint(
      'fk_assets_category_id',
      ['category_id'],
      'categories',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .addForeignKeyConstraint(
      'fk_assets_department_id',
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
    .addColumn('asset_code_ac', 'varchar(100)', (col) => col.notNull())
    .addColumn('asset_code', 'varchar(100)', (col) => col.notNull())
    .addColumn('serial_number', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('AVAILABLE')) // AVAILABLE, IN_USE, UNDER_MAINTENANCE, RETIRED
    .addColumn('purchase_date', 'date', (col) => col.notNull())
    .addColumn('warranty_end_date', 'date', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addForeignKeyConstraint(
      'fk_asset_items_asset_id',
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
    .addColumn('serial_number', 'varchar(255)', (col) => col.notNull())
    .addColumn('department_id', 'integer', (col) => col.notNull())
    .addColumn('image_url', 'varchar(500)')
    .addColumn('type', 'varchar(50)', (col) => col.notNull()) // REQUEST or RETURN
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('PENDING')) // PENDING, APPROVED, REJECTED, CANCELLED
    .addColumn('requester_id', 'integer', (col) => col.notNull())
    .addColumn('request_date', 'date', (col) => col.notNull())
    .addColumn('approver_id', 'integer')
    .addColumn('approval_date', 'date')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addForeignKeyConstraint(
      'fk_asset_requests_department_id',
      ['department_id'],
      'departments',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .addForeignKeyConstraint(
      'fk_asset_requests_requester_id',
      ['requester_id'],
      'users',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .addForeignKeyConstraint(
      'fk_asset_requests_approver_id',
      ['approver_id'],
      'users',
      ['id'],
      (cb) => cb.onDelete('restrict')
    )
    .execute()

  // Create asset_users table
  await db.schema
    .createTable('asset_users')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('department_id', 'integer', (col) => col.notNull())
    .addColumn('serial_number', 'varchar(255)', (col) => col.notNull())
    .addColumn('status', 'varchar(50)', (col) => col.notNull())
    .addColumn('assigned_date', 'date', (col) => col.notNull())
    .addColumn('returned_date', 'date')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).notNull()
    )
    .addForeignKeyConstraint(
      'fk_asset_users_user_id',
      ['user_id'],
      'users',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .addForeignKeyConstraint(
      'fk_asset_users_department_id',
      ['department_id'],
      'departments',
      ['id'],
      (cb) => cb.onDelete('restrict')
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
    .createIndex('idx_assets_status')
    .on('assets')
    .column('status')
    .execute()

  await db.schema
    .createIndex('idx_asset_items_asset_id')
    .on('asset_items')
    .column('asset_id')
    .execute()

  await db.schema
    .createIndex('idx_asset_items_status')
    .on('asset_items')
    .column('status')
    .execute()

  await db.schema
    .createIndex('idx_asset_requests_department_id')
    .on('asset_requests')
    .column('department_id')
    .execute()

  await db.schema
    .createIndex('idx_asset_requests_requester_id')
    .on('asset_requests')
    .column('requester_id')
    .execute()

  await db.schema
    .createIndex('idx_asset_requests_status')
    .on('asset_requests')
    .column('status')
    .execute()

  await db.schema
    .createIndex('idx_asset_requests_type')
    .on('asset_requests')
    .column('type')
    .execute()

  await db.schema
    .createIndex('idx_asset_users_user_id')
    .on('asset_users')
    .column('user_id')
    .execute()

  await db.schema
    .createIndex('idx_asset_users_serial_number')
    .on('asset_users')
    .column('serial_number')
    .execute()

  await db.schema
    .createIndex('idx_users_department_id')
    .on('users')
    .column('department_id')
    .execute()
}

  export async function down(db: Kysely<any>): Promise<void> {
  // Disable foreign key checks to allow dropping tables
  await sql`SET FOREIGN_KEY_CHECKS = 0`.execute(db)

  await db.schema.dropTable('asset_users').ifExists().execute()
  await db.schema.dropTable('asset_requests').ifExists().execute()
  await db.schema.dropTable('asset_items').ifExists().execute()
  await db.schema.dropTable('assets').ifExists().execute()
  await db.schema.dropTable('users').ifExists().execute()
  await db.schema.dropTable('departments').ifExists().execute()
  await db.schema.dropTable('categories').ifExists().execute()

  // Re-enable foreign key checks
  await sql`SET FOREIGN_KEY_CHECKS = 1`.execute(db)
}
