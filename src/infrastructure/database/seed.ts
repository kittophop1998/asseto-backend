import { db } from './maria'

async function seed() {
  try {
    console.log('Starting database seeding...')

    // Seed Categories
    console.log('Seeding categories...')
    const categoriesData = [
      {
        name: 'อุปกรณ์ไอที',
        prefix: 'IT',
        description: 'อุปกรณ์คอมพิวเตอร์และอุปกรณ์ประกอบ เช่น เมาส์ คีย์บอร์ด จอภาพ',
      },
      {
        name: 'ซอฟต์แวร์',
        prefix: 'SW',
        description: 'โปรแกรมและแอปพลิเคชันต่างๆ ที่ใช้ในองค์กร',
      },
      {
        name: 'เครื่องใช้สำนักงาน',
        prefix: 'OF',
        description: 'อุปกรณ์สำนักงานทั่วไป เช่น เครื่องพิมพ์ เครื่องสแกน',
      },
      {
        name: 'เบิกใช้แล้วหมดไป',
        prefix: 'OUT',
        description: 'วัสดุสิ้นเปลืองที่ใช้แล้วหมดไป เช่น กระดาษ ปากกา หมึกพิมพ์',
      }
    ]

    let categoriesInserted = 0
    for (const category of categoriesData) {
      const existing = await db
        .selectFrom('categories')
        .select('id')
        .where('prefix', '=', category.prefix)
        .executeTakeFirst()

      if (!existing) {
        await db
          .insertInto('categories')
          .values({
            ...category,
            updated_at: new Date(),
          })
          .execute()
        categoriesInserted++
      }
    }
    console.log(`✓ Categories: ${categoriesInserted} inserted, ${categoriesData.length - categoriesInserted} already existed`)

    // Seed Departments
    console.log('Seeding departments...')
    const departmentsData: Array<{ code: string; name: string; type: 'BACKOFFICE' | 'BRANCH' }> = [
      {
        code: 'HQ-001',
        name: 'ฝ่ายบริหาร',
        type: 'BACKOFFICE',
      },
      {
        code: 'HQ-002',
        name: 'ฝ่ายบัญชีและการเงิน',
        type: 'BACKOFFICE',
      },
      {
        code: 'HQ-003',
        name: 'ฝ่ายทรัพยากรบุคคล',
        type: 'BACKOFFICE',
      },
      {
        code: 'HQ-004',
        name: 'ฝ่ายเทคโนโลยีสารสนเทศ',
        type: 'BACKOFFICE',
      },
      {
        code: 'HQ-005',
        name: 'ฝ่ายการตลาด',
        type: 'BACKOFFICE',
      },
      {
        code: 'BR-001',
        name: 'สาขากรุงเทพ',
        type: 'BRANCH',
      },
      {
        code: 'BR-002',
        name: 'สาขาเชียงใหม่',
        type: 'BRANCH',
      },
      {
        code: 'BR-003',
        name: 'สาขาภูเก็ต',
        type: 'BRANCH',
      },
      {
        code: 'BR-004',
        name: 'สาขาขอนแก่น',
        type: 'BRANCH',
      },
      {
        code: 'BR-005',
        name: 'สาขาหาดใหญ่',
        type: 'BRANCH',
      },
    ]

    let departmentsInserted = 0
    for (const department of departmentsData) {
      const existing = await db
        .selectFrom('departments')
        .select('id')
        .where('code', '=', department.code)
        .executeTakeFirst()

      if (!existing) {
        await db
          .insertInto('departments')
          .values({
            ...department,
            updated_at: new Date(),
          })
          .execute()
        departmentsInserted++
      }
    }
    console.log(`✓ Departments: ${departmentsInserted} inserted, ${departmentsData.length - departmentsInserted} already existed`)

    // Seed Locations
    console.log('Seeding locations...')
    const locationsData = [
      { name: "Main store (โกดัง 40)", description: "Main store (โกดัง 40)", is_active: 1 },
      { name: "ONLINE (STO)", description: "ONLINE (STO)", is_active: 0 },
      { name: "100 Baht Shop (JJ1)", description: "100 Baht Shop (JJ1)", is_active: 1 },
      { name: "100 Baht Shop (JJ5)", description: "100 Baht Shop (JJ5)", is_active: 1 },
      { name: "Checkin Lowprice (CL)", description: "Checkin Lowprice (CL)", is_active: 1 },
      { name: "100 Baht Shop (PTN)", description: "100 Baht Shop (PTN)", is_active: 1 },
      { name: "100 Baht Shop (KB)", description: "100 Baht Shop (KB)", is_active: 1 },
      { name: "100 Baht Shop (CBR)", description: "100 Baht Shop (CBR)", is_active: 1 },
      { name: "ศรีฟ้า", description: "ศรีฟ้า", is_active: 0 },
      { name: "100BAHTSHOP (SAMUI)", description: "100BAHTSHOP (SAMUI)", is_active: 1 },
      { name: "DRUG CENTER SAMUI", description: "DRUG CENTER SAMUI", is_active: 1 },
      { name: "100 Baht Shop (MPN)", description: "100 Baht Shop (MPN)", is_active: 1 },
      { name: "_DEMO หน้าร้าน", description: "_DEMO หน้าร้าน", is_active: 0 },
      { name: "100 Baht Shop (JJ3)", description: "100 Baht Shop (JJ3)", is_active: 1 },
      { name: "_DEMO คลังใหญ่", description: "_DEMO คลังใหญ่", is_active: 0 },
      { name: "Chemist Pharmacy (CMP)", description: "Chemist Pharmacy (CMP)", is_active: 1 },
      { name: "สำนักงานใหญ่", description: "สำนักงานใหญ่", is_active: 1 },
      { name: "ราคาแนะนำขาย Sticker price", description: "ราคาแนะนำขาย Sticker price", is_active: 1 },
      { name: "100 Baht Shop (JJ8)", description: "100 Baht Shop (JJ8)", is_active: 1 },
      { name: "ห้องผลิตสินค้า OTOP", description: "ห้องผลิตสินค้า OTOP", is_active: 1 },
      { name: "โกดังคืนสินค้า", description: "โกดังคืนสินค้า", is_active: 1 },
      { name: "100 Baht Shop (JF1)", description: "100 Baht Shop (JF1)", is_active: 0 },
      { name: "100 Baht Shop (ITS)", description: "100 Baht Shop (ITS)", is_active: 1 },
      { name: "Chemist Pharmacy (SBY)", description: "Chemist Pharmacy (SBY)", is_active: 1 },
      { name: "100 Baht Shop (MPN2)", description: "100 Baht Shop (MPN2)", is_active: 1 },
      { name: "100 Baht Shop (SPL)", description: "100 Baht Shop (SPL)", is_active: 1 },
      { name: "100 Baht Shop (JJP)", description: "100 Baht Shop (JJP)", is_active: 1 },
      { name: "100 Baht Shop (SSK)", description: "100 Baht Shop (SSK)", is_active: 1 },
    ]

    let locationsInserted = 0
    for (const location of locationsData) {
      const existing = await db
        .selectFrom('locations')
        .select('id')
        .where('name', '=', location.name)
        .executeTakeFirst()

      if (!existing) {
        await db
          .insertInto('locations')
          .values({
            ...location,
            updated_at: new Date(),
          })
          .execute()
        locationsInserted++
      }
    }
    console.log(`✓ Locations: ${locationsInserted} inserted, ${locationsData.length - locationsInserted} already existed`)

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
