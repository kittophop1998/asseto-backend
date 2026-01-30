import { db } from './maria'
import * as bcrypt from 'bcrypt'

async function seed() {
  try {
    console.log('Starting database seeding...')

    // Clear existing data (in reverse order to handle foreign key constraints)
    console.log('Clearing existing data...')
    await db.deleteFrom('asset_items').execute()
    await db.deleteFrom('asset_requests').execute()
    await db.deleteFrom('assets').execute()
    await db.deleteFrom('users').execute()
    await db.deleteFrom('departments').execute()
    await db.deleteFrom('categories').execute()
    console.log('✓ Existing data cleared')

    // Seed Categories
    console.log('Seeding categories...')
    await db
      .insertInto('categories')
      .values([
        {
          name: 'อุปกรณ์ไอที',
          description: 'อุปกรณ์คอมพิวเตอร์และอุปกรณ์ประกอบ เช่น เมาส์ คีย์บอร์ด จอภาพ',
          updated_at: new Date(),
        },
        {
          name: 'ซอฟต์แวร์',
          description: 'โปรแกรมและแอปพลิเคชันต่างๆ ที่ใช้ในองค์กร',
          updated_at: new Date(),
        },
        {
          name: 'เครื่องใช้สำนักงาน',
          description: 'อุปกรณ์สำนักงานทั่วไป เช่น เครื่องพิมพ์ เครื่องสแกน',
          updated_at: new Date(),
        },
      ])
      .execute()
    
    const categories = await db
      .selectFrom('categories')
      .selectAll()
      .execute()
    
    console.log(`✓ Seeded ${categories.length} categories`)

    // Seed Departments
    console.log('Seeding departments...')
    await db
      .insertInto('departments')
      .values([
        {
          code: 'HQ-001',
          name: 'ฝ่ายบริหาร',
          type: 'BACKOFFICE',
          updated_at: new Date(),
        },
        {
          code: 'HQ-002',
          name: 'ฝ่ายบัญชีและการเงิน',
          type: 'BACKOFFICE',
          updated_at: new Date(),
        },
        {
          code: 'HQ-003',
          name: 'ฝ่ายทรัพยากรบุคคล',
          type: 'BACKOFFICE',
          updated_at: new Date(),
        },
        {
          code: 'HQ-004',
          name: 'ฝ่ายเทคโนโลยีสารสนเทศ',
          type: 'BACKOFFICE',
          updated_at: new Date(),
        },
        {
          code: 'HQ-005',
          name: 'ฝ่ายการตลาด',
          type: 'BACKOFFICE',
          updated_at: new Date(),
        },
        {
          code: 'BR-001',
          name: 'สาขากรุงเทพ',
          type: 'BRANCH',
          updated_at: new Date(),
        },
        {
          code: 'BR-002',
          name: 'สาขาเชียงใหม่',
          type: 'BRANCH',
          updated_at: new Date(),
        },
        {
          code: 'BR-003',
          name: 'สาขาภูเก็ต',
          type: 'BRANCH',
          updated_at: new Date(),
        },
        {
          code: 'BR-004',
          name: 'สาขาขอนแก่น',
          type: 'BRANCH',
          updated_at: new Date(),
        },
        {
          code: 'BR-005',
          name: 'สาขาหาดใหญ่',
          type: 'BRANCH',
          updated_at: new Date(),
        },
      ])
      .execute()
    
    const departments = await db
      .selectFrom('departments')
      .selectAll()
      .execute()
    
    console.log(`✓ Seeded ${departments.length} departments`)

    // Seed Users
    console.log('Seeding users...')
    const passwordHash = await bcrypt.hash('password123', 10)
    
    await db
      .insertInto('users')
      .values([
        {
          username: 'admin',
          password_hash: passwordHash,
          full_name: 'ผู้ดูแลระบบ',
          email: 'admin@example.com',
          department_id: departments[3].id, // IT Department
          is_approved: true,
          role: 'ADMIN',
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          username: 'manager1',
          password_hash: passwordHash,
          full_name: 'ผู้จัดการฝ่ายไอที',
          email: 'manager1@example.com',
          department_id: departments[3].id, // IT Department
          is_approved: true,
          role: 'MANAGER',
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          username: 'staff1',
          password_hash: passwordHash,
          full_name: 'พนักงานฝ่ายการตลาด',
          email: 'staff1@example.com',
          department_id: departments[4].id, // Marketing Department
          is_approved: true,
          role: 'STAFF',
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          username: 'staff2',
          password_hash: passwordHash,
          full_name: 'พนักงานสาขากรุงเทพ',
          email: 'staff2@example.com',
          department_id: departments[5].id, // Bangkok Branch
          is_approved: true,
          role: 'STAFF',
          updated_at: new Date(),
          deleted_at: null,
        },
      ])
      .execute()
    
    const users = await db
      .selectFrom('users')
      .selectAll()
      .execute()
    
    console.log(`✓ Seeded ${users.length} users`)

    // Seed Assets
    console.log('Seeding assets...')
    await db
      .insertInto('assets')
      .values([
        {
          code: 'AST-001',
          name: 'คอมพิวเตอร์โน้ตบุ๊ค Dell Latitude',
          category_id: categories[0].id, // IT Equipment
          department_id: departments[3].id, // IT Department
          description: 'โน้ตบุ๊คสำหรับงานทั่วไป Intel Core i5, RAM 8GB, SSD 256GB',
          minimum_qty: 5,
          status: 'NORMAL',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          code: 'AST-002',
          name: 'เมาส์ไร้สาย Logitech',
          category_id: categories[0].id, // IT Equipment
          department_id: departments[3].id, // IT Department
          description: 'เมาส์ไร้สายสำหรับใช้งานทั่วไป',
          minimum_qty: 10,
          status: 'NORMAL',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
        {
          code: 'AST-003',
          name: 'คีย์บอร์ดไร้สาย',
          category_id: categories[0].id, // IT Equipment
          department_id: departments[3].id, // IT Department
          description: 'คีย์บอร์ดไร้สาย มาตรฐาน 104 ปุ่ม',
          minimum_qty: 10,
          status: 'LOW_STOCK',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ])
      .execute()
    
    const assets = await db
      .selectFrom('assets')
      .selectAll()
      .execute()
    
    console.log(`✓ Seeded ${assets.length} assets`)

    // Seed Asset Items
    console.log('Seeding asset items...')
    await db
      .insertInto('asset_items')
      .values([
        {
          asset_id: assets[0].id, // Dell Laptop
          asset_code_ac: 'AST-001-AC-001',
          serial_number: 'DL2024001',
          status: 'AVAILABLE',
          purchase_date: new Date('2024-01-15'),
          warranty_end_date: new Date('2027-01-15'),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          asset_id: assets[0].id, // Dell Laptop
          asset_code_ac: 'AST-001-AC-002',
          serial_number: 'DL2024002',
          status: 'IN_USE',
          purchase_date: new Date('2024-01-15'),
          warranty_end_date: new Date('2027-01-15'),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          asset_id: assets[1].id, // Logitech Mouse
          asset_code_ac: 'AST-002-AC-001',
          serial_number: 'LM2024001',
          status: 'AVAILABLE',
          purchase_date: new Date('2024-02-01'),
          warranty_end_date: new Date('2025-02-01'),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          asset_id: assets[1].id, // Logitech Mouse
          asset_code_ac: 'AST-002-AC-002',
          serial_number: 'LM2024002',
          status: 'AVAILABLE',
          purchase_date: new Date('2024-02-01'),
          warranty_end_date: new Date('2025-02-01'),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .execute()
    
    const assetItems = await db
      .selectFrom('asset_items')
      .selectAll()
      .execute()
    
    console.log(`✓ Seeded ${assetItems.length} asset items`)

    console.log('Database seeding completed successfully! ✓')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}

export { seed }
