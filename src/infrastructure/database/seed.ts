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
          {
            name: 'เบิกใช้แล้วหมดไป',
            prefix: 'OUT',
            description: 'วัสดุสิ้นเปลืองที่ใช้แล้วหมดไป เช่น กระดาษ ปากกา หมึกพิมพ์',
            updated_at: new Date(),
          }
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
            "name": "Main store (โกดัง 40)",
            "description": "Main store (โกดัง 40)",
            "updated_at": new Date()
          },
          {
            "name": "ONLINE (STO)",
            "description": "ONLINE (STO)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (JJ1)",
            "description": "100 Baht Shop (JJ1)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (JJ2)",
            "description": "100 Baht Shop (JJ2)",
            "updated_at": new Date()
          },
          {
            "name": "Checkin Lowprice (CL)",
            "description": "Checkin Lowprice (CL)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (PTN)",
            "description": "100 Baht Shop (PTN)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (KB)",
            "description": "100 Baht Shop (KB)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (CBR)",
            "description": "100 Baht Shop (CBR)",
            "updated_at": new Date()
          },
          {
            "name": "ศรีฟ้า",
            "description": "ศรีฟ้า",
            "updated_at": new Date()
          },
          {
            "name": "100BAHTSHOP (SAMUI)",
            "description": "100BAHTSHOP (SAMUI)",
            "updated_at": new Date()
          },
          {
            "name": "DRUG CENTER SAMUI",
            "description": "DRUG CENTER SAMUI",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (MPN)",
            "description": "100 Baht Shop (MPN)",
            "updated_at": new Date()
          },
          {
            "name": "_DEMO หน้าร้าน",
            "description": "_DEMO หน้าร้าน",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (JJ3)",
            "description": "100 Baht Shop (JJ3)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (JJ5)",
            "description": "100 Baht Shop (JJ5)",
            "updated_at": new Date()
          },
          {
            "name": "_DEMO คลังใหญ่",
            "description": "_DEMO คลังใหญ่",
            "updated_at": new Date()
          },
          {
            "name": "Chemist Pharmacy (CMP)",
            "description": "Chemist Pharmacy (CMP)",
            "updated_at": new Date()
          },
          {
            "name": "สำนักงานใหญ่",
            "description": "สำนักงานใหญ่",
            "updated_at": new Date()
          },
          {
            "name": "ราคาแนะนำขาย Sticker price",
            "description": "ราคาแนะนำขาย Sticker price",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (JJ8)",
            "description": "100 Baht Shop (JJ8)",
            "updated_at": new Date()
          },
          {
            "name": "ห้องผลิตสินค้า OTOP",
            "description": "ห้องผลิตสินค้า OTOP",
            "updated_at": new Date()
          },
          {
            "name": "โกดังคืนสินค้า",
            "description": "โกดังคืนสินค้า",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (JF1)",
            "description": "100 Baht Shop (JF1)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (ITS)",
            "description": "100 Baht Shop (ITS)",
            "updated_at": new Date()
          },
          {
            "name": "Chemist Pharmacy (SBY)",
            "description": "Chemist Pharmacy (SBY)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (MPN2)",
            "description": "100 Baht Shop (MPN2)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (SPL)",
            "description": "100 Baht Shop (SPL)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (JJP)",
            "description": "100 Baht Shop (JJP)",
            "updated_at": new Date()
          },
          {
            "name": "100 Baht Shop (SSK)",
            "description": "100 Baht Shop (SSK)",
            "updated_at": new Date()
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
