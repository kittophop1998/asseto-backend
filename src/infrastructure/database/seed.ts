import { db } from './maria'

async function seed() {
  try {
    console.log('Starting database seeding...')

    // Seed Categories
    console.log('Seeding categories...')
    const categories = await db
      .insertInto('categories')
      .values([
        {
          name: 'อุปกรณ์คอมพิวเตอร์',
          description: 'อุปกรณ์คอมพิวเตอร์และอุปกรณ์ประกอบ เช่น เมาส์ คีย์บอร์ด จอภาพ',
          updated_at: new Date(),
        },
        {
          name: 'เครื่องใช้สำนักงาน',
          description: 'อุปกรณ์สำนักงานทั่วไป เช่น เครื่องพิมพ์ โทรศัพท์ เครื่องแฟกซ์',
          updated_at: new Date(),
        },
        {
          name: 'เฟอร์นิเจอร์',
          description: 'โต๊ะ เก้าอี้ ตู้เก็บเอกสาร และเฟอร์นิเจอร์สำนักงาน',
          updated_at: new Date(),
        },
        {
          name: 'อุปกรณ์เครือข่าย',
          description: 'อุปกรณ์เชื่อมต่อเครือข่าย เช่น Router Switch Access Point',
          updated_at: new Date(),
        },
        {
          name: 'เครื่องใช้ไฟฟ้า',
          description: 'เครื่องปรับอากาศ พัดลม ตู้เย็น และเครื่องใช้ไฟฟ้าอื่นๆ',
          updated_at: new Date(),
        },
      ])
      .returningAll()
      .execute()
    
    console.log(`✓ Seeded ${categories.length} categories`)

    // Seed Departments
    console.log('Seeding departments...')
    const departments = await db
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
      .returningAll()
      .execute()
    
    console.log(`✓ Seeded ${departments.length} departments`)

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
