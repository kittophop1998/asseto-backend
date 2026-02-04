# 📦 S3/MinIO Integration - สรุปการติดตั้งและการใช้งาน

## ✅ สิ่งที่ได้ทำเสร็จแล้ว

### 1. ติดตั้ง Dependencies
```bash
✓ @aws-sdk/client-s3
✓ @aws-sdk/lib-storage
✓ @aws-sdk/s3-request-presigner
✓ multer
✓ @types/multer
```

### 2. ไฟล์ที่สร้างขึ้น

#### 📄 `src/infrastructure/api/utils/s3.ts`
ไฟล์ utility functions สำหรับจัดการ S3/MinIO ประกอบด้วย:
- ✓ `uploadFile()` - อัพโหลดไฟล์
- ✓ `downloadFile()` - ดาวน์โหลดไฟล์
- ✓ `deleteFile()` - ลบไฟล์
- ✓ `getSignedDownloadUrl()` - สร้าง signed URL สำหรับดาวน์โหลด
- ✓ `getSignedUploadUrl()` - สร้าง signed URL สำหรับอัพโหลด
- ✓ `fileExists()` - ตรวจสอบไฟล์
- ✓ `listFiles()` - แสดงรายการไฟล์
- ✓ `copyFile()` - คัดลอกไฟล์
- ✓ `uploadFromMultipart()` - อัพโหลดจาก Express Multer
- ✓ `downloadFileAsBuffer()` - ดาวน์โหลดเป็น Buffer
- ✓ `generateS3Key()` - สร้าง key ที่มี timestamp

#### 📄 `src/infrastructure/api/utils/s3.examples.ts`
ไฟล์ตัวอย่างการใช้งาน 10 ตัวอย่าง

#### 📄 `docker-compose.minio.yml`
Docker Compose สำหรับรัน MinIO ในเครื่อง

#### 📄 `S3_USAGE.md`
เอกสารคู่มือการใช้งานฉบับสมบูรณ์

### 3. Environment Variables

เพิ่มใน `.env` และ `.env.example`:
```env
# S3/MinIO Configuration
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=assets
S3_FORCE_PATH_STYLE=true
```

### 4. Config Updates

อัพเดท `src/infrastructure/config/index.ts` เพื่อรองรับ S3 config

---

## 🚀 วิธีเริ่มต้นใช้งาน

### ขั้นตอนที่ 1: เริ่มต้น MinIO Server

```bash
# เริ่ม MinIO
docker-compose -f docker-compose.minio.yml up -d

# ตรวจสอบสถานะ
docker-compose -f docker-compose.minio.yml ps
```

### ขั้นตอนที่ 2: เข้าถึง MinIO Console

เปิดเบราว์เซอร์ไปที่: **http://localhost:9001**
- Username: `minioadmin`
- Password: `minioadmin`

### ขั้นตอนที่ 3: เริ่มใช้งานในโค้ด

```typescript
import s3 from './infrastructure/api/utils/s3';

// อัพโหลดไฟล์
const result = await s3.uploadFile({
  file: buffer,
  key: 'documents/file.pdf',
  contentType: 'application/pdf',
});

// ดาวน์โหลดไฟล์
const file = await s3.downloadFile({
  key: 'documents/file.pdf',
});

// สร้าง signed URL
const signedUrl = await s3.getSignedDownloadUrl({
  key: 'documents/file.pdf',
  expiresIn: 3600, // 1 hour
});
```

---

## 📚 ตัวอย่างการใช้งานใน Controller

### อัพโหลดรูปภาพสินทรัพย์

```typescript
import express from 'express';
import multer from 'multer';
import s3 from './utils/s3';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/assets/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // อัพโหลดไปยัง S3
    const result = await s3.uploadFromMultipart(req.file, 'assets/images');

    // บันทึก key ลงฐานข้อมูล
    // await assetRepository.update(req.params.id, { imageKey: result.key });

    res.json({
      success: true,
      imageKey: result.key,
      imageUrl: `${process.env.S3_ENDPOINT}/${result.bucket}/${result.key}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

### ดาวน์โหลดเอกสาร

```typescript
router.get('/assets/documents/:key(*)', async (req, res) => {
  try {
    const key = req.params.key;

    // ตรวจสอบว่าไฟล์มีอยู่
    const exists = await s3.fileExists({ key });
    if (!exists.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // สร้าง signed URL แทนการดาวน์โหลดโดยตรง (ประหยัด bandwidth)
    const signedUrl = await s3.getSignedDownloadUrl({
      key,
      expiresIn: 3600,
    });

    res.json({
      success: true,
      downloadUrl: signedUrl.url,
      expiresIn: signedUrl.expiresIn,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get document' });
  }
});
```

---

## 🔧 การใช้งานกับ AWS S3 (Production)

เมื่อต้องการใช้กับ AWS S3 จริง ให้แก้ไข `.env`:

```env
# ลบหรือ comment S3_ENDPOINT สำหรับ AWS S3
# S3_ENDPOINT=

# ใช้ region ของ AWS
S3_REGION=ap-southeast-1

# ใช้ credentials จาก AWS IAM
S3_ACCESS_KEY_ID=your_aws_access_key
S3_SECRET_ACCESS_KEY=your_aws_secret_key

# ใช้ bucket ของคุณ
S3_BUCKET=your-production-bucket

# ปิด force path style สำหรับ AWS S3
S3_FORCE_PATH_STYLE=false
```

---

## 🛠️ Commands ที่มีประโยชน์

```bash
# เริ่มต้น MinIO
docker-compose -f docker-compose.minio.yml up -d

# ดู logs
docker-compose -f docker-compose.minio.yml logs -f

# หยุด MinIO
docker-compose -f docker-compose.minio.yml down

# หยุดและลบ volumes
docker-compose -f docker-compose.minio.yml down -v

# ตรวจสอบ containers
docker-compose -f docker-compose.minio.yml ps
```

---

## 📖 เอกสารเพิ่มเติม

- `S3_USAGE.md` - คู่มือการใช้งานฉบับสมบูรณ์
- `src/infrastructure/api/utils/s3.examples.ts` - ตัวอย่างโค้ด

---

## 🎯 Next Steps

1. ✅ เริ่ม MinIO server: `docker-compose -f docker-compose.minio.yml up -d`
2. ✅ เข้า MinIO Console: http://localhost:9001
3. ✅ ทดสอบ upload/download ด้วย Postman หรือ cURL
4. ✅ เพิ่ม routes สำหรับจัดการไฟล์ใน `src/infrastructure/api/routers/`
5. ✅ เพิ่ม methods ใน controllers สำหรับ upload/download
6. ✅ เพิ่ม columns ในฐานข้อมูลสำหรับเก็บ S3 keys

---

## 💡 Tips & Best Practices

1. **เก็บเฉพาะ key** ในฐานข้อมูล ไม่ควรเก็บ full URL
2. **ใช้ signed URLs** สำหรับการดาวน์โหลดที่มีความปลอดภัย
3. **จัดระเบียบ folders** เช่น `assets/images/`, `assets/documents/`
4. **Validate file types** และ size ก่อนอัพโหลด
5. **ใช้ metadata** เพื่อเก็บข้อมูลเพิ่มเติม
6. **ทำ error handling** ให้ดี
7. **ตั้ง CORS** ถ้าต้องการให้ frontend เรียกใช้โดยตรง

---

สร้างโดย: GitHub Copilot
วันที่: 2026-02-04
