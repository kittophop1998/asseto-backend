/**
 * สคริปต์ทดสอบการเชื่อมต่อ S3/MinIO
 * รัน: npx ts-node src/infrastructure/api/utils/s3.test.ts
 */

import s3 from './s3';

async function testS3Connection() {
  console.log('🔍 กำลังทดสอบการเชื่อมต่อ S3/MinIO...\n');

  try {
    // 1. ทดสอบสร้าง key
    console.log('1. ทดสอบสร้าง S3 key');
    const key = s3.generateS3Key('test', 'hello.txt');
    console.log(`   ✓ Key: ${key}\n`);

    // 2. ทดสอบอัพโหลดไฟล์
    console.log('2. ทดสอบอัพโหลดไฟล์');
    const uploadResult = await s3.uploadFile({
      file: Buffer.from('Hello S3/MinIO!', 'utf-8'),
      key: key,
      contentType: 'text/plain',
      metadata: {
        test: 'true',
        timestamp: new Date().toISOString(),
      },
    });
    console.log(`   ✓ อัพโหลดสำเร็จ: ${uploadResult.key}\n`);

    // 3. ทดสอบตรวจสอบไฟล์
    console.log('3. ทดสอบตรวจสอบไฟล์');
    const existsResult = await s3.fileExists({ key });
    if (existsResult.exists) {
      console.log(`   ✓ ไฟล์มีอยู่: ${existsResult.size} bytes`);
      console.log(`   ✓ แก้ไขล่าสุด: ${existsResult.lastModified}`);
      console.log(`   ✓ Content-Type: ${existsResult.contentType}\n`);
    } else {
      console.log(`   ✗ ไฟล์ไม่พบ\n`);
    }

    // 4. ทดสอบดาวน์โหลดไฟล์
    console.log('4. ทดสอบดาวน์โหลดไฟล์');
    const buffer = await s3.downloadFileAsBuffer({ key });
    const content = buffer.toString('utf-8');
    console.log(`   ✓ ดาวน์โหลดสำเร็จ: "${content}"\n`);

    // 5. ทดสอบสร้าง Signed URL
    console.log('5. ทดสอบสร้าง Signed URL');
    const signedUrlResult = await s3.getSignedDownloadUrl({
      key,
      expiresIn: 3600,
    });
    console.log(`   ✓ Signed URL สร้างสำเร็จ`);
    console.log(`   ✓ หมดอายุใน: ${signedUrlResult.expiresIn} วินาที`);
    console.log(`   ✓ URL: ${signedUrlResult.url.substring(0, 80)}...\n`);

    // 6. ทดสอบแสดงรายการไฟล์
    console.log('6. ทดสอบแสดงรายการไฟล์');
    const listResult = await s3.listFiles({
      prefix: 'test/',
      maxKeys: 10,
    });
    console.log(`   ✓ พบไฟล์: ${listResult.count} ไฟล์`);
    listResult.files.forEach((file) => {
      console.log(`     - ${file.key} (${file.size} bytes)`);
    });
    console.log('');

    // 7. ทดสอบคัดลอกไฟล์
    console.log('7. ทดสอบคัดลอกไฟล์');
    const copyKey = s3.generateS3Key('test', 'hello-copy.txt');
    const copyResult = await s3.copyFile({
      sourceKey: key,
      destinationKey: copyKey,
    });
    console.log(`   ✓ คัดลอกสำเร็จ: ${copyResult.destinationKey}\n`);

    // 8. ทดสอบลบไฟล์
    console.log('8. ทดสอบลบไฟล์');
    const deleteResult1 = await s3.deleteFile({ key });
    console.log(`   ✓ ${deleteResult1.message}`);
    const deleteResult2 = await s3.deleteFile({ key: copyKey });
    console.log(`   ✓ ${deleteResult2.message}\n`);

    // สรุปผล
    console.log('✅ การทดสอบเสร็จสมบูรณ์!');
    console.log('🎉 S3/MinIO เชื่อมต่อและทำงานได้ปกติ\n');

  } catch (error: any) {
    console.error('\n❌ การทดสอบล้มเหลว:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 คำแนะนำ:');
      console.error('   - ตรวจสอบว่า MinIO กำลังทำงานอยู่หรือไม่');
      console.error('   - รัน: docker-compose -f docker-compose.minio.yml up -d');
      console.error('   - ตรวจสอบ S3_ENDPOINT ใน .env');
    } else if (error.message.includes('Access Denied') || error.message.includes('credentials')) {
      console.error('\n💡 คำแนะนำ:');
      console.error('   - ตรวจสอบ S3_ACCESS_KEY_ID และ S3_SECRET_ACCESS_KEY ใน .env');
      console.error('   - สำหรับ MinIO default คือ: minioadmin / minioadmin');
    } else if (error.message.includes('NoSuchBucket')) {
      console.error('\n💡 คำแนะนำ:');
      console.error('   - ตรวจสอบว่า bucket มีอยู่หรือไม่');
      console.error('   - รัน MinIO Console: http://localhost:9001');
      console.error('   - หรือสร้าง bucket ด้วย: docker-compose -f docker-compose.minio.yml up -d');
    }
    
    console.error('');
    process.exit(1);
  }
}

// รันการทดสอบ
testS3Connection();
