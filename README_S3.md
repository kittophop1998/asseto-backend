# 🎉 S3/MinIO Integration - Installation Complete!

## ✅ สิ่งที่ได้ทำเสร็จแล้วทั้งหมด

### 📦 1. ติดตั้ง Packages
- ✅ @aws-sdk/client-s3 - S3 Client
- ✅ @aws-sdk/lib-storage - Upload helper
- ✅ @aws-sdk/s3-request-presigner - Signed URLs
- ✅ multer - File upload middleware
- ✅ @types/multer - TypeScript types

### 📁 2. ไฟล์ที่สร้างขึ้น

| ไฟล์ | คำอธิบาย |
|------|----------|
| `src/infrastructure/api/utils/s3.ts` | ⭐ S3 utility functions หลัก |
| `src/infrastructure/api/utils/s3.test.ts` | 🧪 สคริปต์ทดสอบการเชื่อมต่อ |
| `src/infrastructure/api/utils/s3.examples.ts` | 📚 ตัวอย่างการใช้งาน 10 แบบ |
| `docker-compose.minio.yml` | 🐳 Docker Compose สำหรับ MinIO |
| `S3_USAGE.md` | 📖 คู่มือการใช้งานฉบับสมบูรณ์ |
| `MINIO_QUICKSTART.md` | 🚀 Quick Start Guide |
| `S3_SETUP_COMPLETE.md` | ✅ สรุปการติดตั้ง |

### ⚙️ 3. Configuration

#### Environment Variables (.env)
```env
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=assets
S3_FORCE_PATH_STYLE=true
```

#### Config Updates (src/infrastructure/config/index.ts)
```typescript
s3: {
  endpoint: process.env.S3_ENDPOINT || undefined,
  region: process.env.S3_REGION || 'us-east-1',
  accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  bucket: process.env.S3_BUCKET || 'assets',
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
}
```

### 🚀 4. NPM Scripts

```bash
npm run test:s3     # ทดสอบการเชื่อมต่อ S3/MinIO
```

---

## 🎯 วิธีใช้งาน (Quick Start)

### ขั้นตอนที่ 1: เริ่มต้น MinIO
```bash
docker-compose -f docker-compose.minio.yml up -d
```

### ขั้นตอนที่ 2: ทดสอบการเชื่อมต่อ
```bash
npm run test:s3
```

### ขั้นตอนที่ 3: เข้า MinIO Console
เปิดเบราว์เซอร์: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

---

## 💻 ตัวอย่างการใช้งาน

### Import Module
```typescript
import s3 from './infrastructure/api/utils/s3';
```

### อัพโหลดไฟล์
```typescript
const result = await s3.uploadFile({
  file: buffer,
  key: 'documents/file.pdf',
  contentType: 'application/pdf',
});
```

### ดาวน์โหลดไฟล์
```typescript
const file = await s3.downloadFile({
  key: 'documents/file.pdf',
});
```

### สร้าง Signed URL
```typescript
const signedUrl = await s3.getSignedDownloadUrl({
  key: 'documents/file.pdf',
  expiresIn: 3600, // 1 hour
});
```

### อัพโหลดจาก Multer
```typescript
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  const result = await s3.uploadFromMultipart(req.file, 'uploads');
  res.json(result);
});
```

---

## 📚 Available Functions

| Function | คำอธิบาย |
|----------|----------|
| `uploadFile()` | อัพโหลดไฟล์ |
| `downloadFile()` | ดาวน์โหลดไฟล์ |
| `deleteFile()` | ลบไฟล์ |
| `getSignedDownloadUrl()` | สร้าง signed URL สำหรับดาวน์โหลด |
| `getSignedUploadUrl()` | สร้าง signed URL สำหรับอัพโหลด |
| `fileExists()` | ตรวจสอบว่าไฟล์มีอยู่หรือไม่ |
| `listFiles()` | แสดงรายการไฟล์ |
| `copyFile()` | คัดลอกไฟล์ |
| `uploadFromMultipart()` | อัพโหลดจาก Express Multer |
| `downloadFileAsBuffer()` | ดาวน์โหลดเป็น Buffer |
| `generateS3Key()` | สร้าง key ที่มี timestamp |

---

## 🌐 MinIO Endpoints

- **API Endpoint:** http://localhost:9000
- **Console UI:** http://localhost:9001
- **Health Check:** http://localhost:9000/minio/health/live

---

## 🔄 การย้ายไปใช้ AWS S3 (Production)

แก้ไข `.env`:

```env
# ลบหรือ comment S3_ENDPOINT
# S3_ENDPOINT=

S3_REGION=ap-southeast-1
S3_ACCESS_KEY_ID=your_aws_access_key
S3_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=your-production-bucket
S3_FORCE_PATH_STYLE=false
```

ไม่ต้องแก้โค้ดอะไรเลย! เพียงแค่เปลี่ยน environment variables

---

## 🛠️ Commands Reference

```bash
# MinIO Management
docker-compose -f docker-compose.minio.yml up -d      # เริ่ม
docker-compose -f docker-compose.minio.yml down       # หยุด
docker-compose -f docker-compose.minio.yml ps         # สถานะ
docker-compose -f docker-compose.minio.yml logs -f    # ดู logs

# Testing
npm run test:s3                                       # ทดสอบการเชื่อมต่อ

# Development
npm run dev                                           # เริ่ม backend
```

---

## 📖 เอกสารเพิ่มเติม

1. **S3_USAGE.md** - คู่มือการใช้งานแบบละเอียด
2. **MINIO_QUICKSTART.md** - Quick Start สำหรับ MinIO
3. **src/infrastructure/api/utils/s3.examples.ts** - ตัวอย่างโค้ด

---

## ✨ Features

- ✅ รองรับทั้ง MinIO และ AWS S3
- ✅ TypeScript พร้อม type safety
- ✅ Signed URLs สำหรับความปลอดภัย
- ✅ Upload/Download/Delete/Copy
- ✅ List files พร้อม pagination
- ✅ File existence check
- ✅ Metadata support
- ✅ Multer integration
- ✅ Error handling
- ✅ Docker Compose สำหรับ local development

---

## 💡 Best Practices

1. ✅ เก็บเฉพาะ **key** ในฐานข้อมูล ไม่ใช่ full URL
2. ✅ ใช้ **signed URLs** สำหรับดาวน์โหลดที่ปลอดภัย
3. ✅ จัดระเบียบ **folder structure** เช่น `assets/images/`, `assets/documents/`
4. ✅ **Validate file types** และขนาดก่อนอัพโหลด
5. ✅ ใช้ **metadata** เพื่อเก็บข้อมูลเพิ่มเติม
6. ✅ ทำ **error handling** อย่างเหมาะสม
7. ✅ ตั้งค่า **CORS** ถ้าต้องการให้ frontend เรียกใช้โดยตรง

---

## 🎓 Next Steps

1. ✅ เริ่ม MinIO: `docker-compose -f docker-compose.minio.yml up -d`
2. ✅ ทดสอบ: `npm run test:s3`
3. ✅ เพิ่ม routes สำหรับจัดการไฟล์
4. ✅ เพิ่ม columns ในฐานข้อมูลสำหรับเก็บ S3 keys
5. ✅ สร้าง controllers สำหรับ upload/download
6. ✅ เพิ่ม validation และ error handling
7. ✅ ตั้งค่า CORS ถ้าจำเป็น

---

## 📞 Troubleshooting

### Connection Refused
```bash
# ตรวจสอบว่า MinIO กำลังทำงาน
docker-compose -f docker-compose.minio.yml ps
```

### Access Denied
```bash
# ตรวจสอบ credentials ใน .env
# MinIO default: minioadmin / minioadmin
```

### Port Already in Use
```bash
# ดูว่าใครใช้ port อยู่
lsof -i :9000
lsof -i :9001
```

---

## 🎊 การติดตั้งเสร็จสมบูรณ์!

ตอนนี้คุณพร้อมใช้งาน S3/MinIO แล้ว! 🚀

สร้างโดย: GitHub Copilot
วันที่: 2026-02-04
