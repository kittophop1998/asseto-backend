import { db } from './maria'

async function seed() {
  try {
    console.log('Starting database seeding...')

    // Seed Categories
    console.log('Seeding categories...')
    const categoryCountResult = await db
      .selectFrom('categories')
      .select(db.fn.count<number>('id').as('count'))
      .executeTakeFirst()
    const categoryCount = categoryCountResult ? Number(categoryCountResult.count) : 0

    if (categoryCount === 0) {
      await db
        .insertInto('categories')
        .values([
          {
            name: 'อุปกรณ์ไอที',
            prefix: 'IT',
            description: 'อุปกรณ์คอมพิวเตอร์และอุปกรณ์ประกอบ เช่น เมาส์ คีย์บอร์ด จอภาพ',
            updated_at: new Date(),
          },
          {
            name: 'ซอฟต์แวร์',
            prefix: 'SW',
            description: 'โปรแกรมและแอปพลิเคชันต่างๆ ที่ใช้ในองค์กร',
            updated_at: new Date(),
          },
          {
            name: 'เครื่องใช้สำนักงาน',
            prefix: 'OF',
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
    } else {
      console.log(`↷ Skipped categories (already ${categoryCount} records)`)
    }

    // Seed Departments
    console.log('Seeding departments...')
    const departmentCountResult = await db
      .selectFrom('departments')
      .select(db.fn.count<number>('id').as('count'))
      .executeTakeFirst()
    const departmentCount = departmentCountResult ? Number(departmentCountResult.count) : 0

    if (departmentCount === 0) {
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
    } else {
      console.log(`↷ Skipped departments (already ${departmentCount} records)`)
    }

    // Seed Locations
    console.log('Seeding locations...')
    const locationCountResult = await db
      .selectFrom('locations')
      .select(db.fn.count<number>('id').as('count'))
      .executeTakeFirst()
    const locationCount = locationCountResult ? Number(locationCountResult.count) : 0

    if (locationCount === 0) {
      await db
        .insertInto('locations')
        .values([
          {
            name: 'คลังสินค้าหลัก',
            description: 'คลังสินค้าหลักตั้งอยู่ที่สำนักงานใหญ่',
            updated_at: new Date(),
          },
          {
            name: 'คลังสินค้าสาขากรุงเทพ',
            description: 'คลังสินค้าของสาขากรุงเทพ',
            updated_at: new Date(),
          }
        ])
        .execute()
      console.log('✓ Seeded locations')
    } else {
      console.log(`↷ Skipped locations (already ${locationCount} records)`)
    }

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
