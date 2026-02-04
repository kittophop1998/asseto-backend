# S3 / MinIO Integration Guide

## การตั้งค่า

### 1. ใช้งาน MinIO สำหรับทดสอบในเครื่อง

#### เริ่มต้น MinIO Server
```bash
docker-compose -f docker-compose.minio.yml up -d
```

#### เข้าถึง MinIO Console
- URL: http://localhost:9001
- Username: `minioadmin`
- Password: `minioadmin`

#### หยุด MinIO Server
```bash
docker-compose -f docker-compose.minio.yml down
```

### 2. ตั้งค่า Environment Variables

สำหรับ MinIO (local):
```env
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=assets
S3_FORCE_PATH_STYLE=true
```

สำหรับ AWS S3 (production):
```env
S3_ENDPOINT=
S3_REGION=ap-southeast-1
S3_ACCESS_KEY_ID=your_aws_access_key
S3_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=your-bucket-name
S3_FORCE_PATH_STYLE=false
```

## การใช้งาน S3 Utils

### 1. Import Module

```typescript
import s3 from './infrastructure/api/utils/s3';
// หรือ
import {
  uploadFile,
  downloadFile,
  deleteFile,
  getSignedDownloadUrl,
  listFiles,
} from './infrastructure/api/utils/s3';
```

### 2. อัพโหลดไฟล์

#### จาก Buffer
```typescript
const fileBuffer = Buffer.from('Hello World');
const result = await s3.uploadFile({
  file: fileBuffer,
  key: 'documents/hello.txt',
  contentType: 'text/plain',
  metadata: {
    uploadedBy: 'user123',
    department: 'IT',
  },
});

console.log(result);
// {
//   success: true,
//   key: 'documents/hello.txt',
//   bucket: 'assets',
//   location: 'http://localhost:9000/assets/documents/hello.txt',
//   etag: '"..."'
// }
```

#### จาก Multer (Express)
```typescript
import express from 'express';
import multer from 'multer';
import s3 from './infrastructure/api/utils/s3';

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await s3.uploadFromMultipart(req.file, 'uploads');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

### 3. ดาวน์โหลดไฟล์

```typescript
const result = await s3.downloadFile({
  key: 'documents/hello.txt',
});

// แปลง Stream เป็น Buffer
const buffer = await s3.downloadFileAsBuffer({
  key: 'documents/hello.txt',
});
```

### 4. ลบไฟล์

```typescript
const result = await s3.deleteFile({
  key: 'documents/hello.txt',
});

console.log(result);
// { success: true, message: 'File documents/hello.txt deleted successfully' }
```

### 5. สร้าง Signed URL (สำหรับดาวน์โหลดชั่วคราว)

```typescript
// URL หมดอายุใน 1 ชั่วโมง (3600 วินาที)
const result = await s3.getSignedDownloadUrl({
  key: 'documents/hello.txt',
  expiresIn: 3600,
});

console.log(result.url);
// https://...?X-Amz-Signature=...
```

### 6. สร้าง Signed URL สำหรับอัพโหลด

```typescript
const result = await s3.getSignedUploadUrl({
  key: 'documents/upload.txt',
  expiresIn: 300, // 5 นาที
});

// Client สามารถใช้ URL นี้อัพโหลดไฟล์โดยตรง
console.log(result.url);
```

### 7. แสดงรายการไฟล์

```typescript
const result = await s3.listFiles({
  prefix: 'documents/',
  maxKeys: 100,
});

console.log(result.files);
// [
//   { key: 'documents/file1.txt', size: 1024, lastModified: Date, etag: '...' },
//   { key: 'documents/file2.pdf', size: 2048, lastModified: Date, etag: '...' }
// ]
```

### 8. ตรวจสอบว่าไฟล์มีอยู่หรือไม่

```typescript
const result = await s3.fileExists({
  key: 'documents/hello.txt',
});

if (result.exists) {
  console.log('File exists:', result.size, 'bytes');
} else {
  console.log('File not found');
}
```

### 9. คัดลอกไฟล์

```typescript
const result = await s3.copyFile({
  sourceKey: 'documents/original.txt',
  destinationKey: 'documents/copy.txt',
});
```

### 10. Helper Functions

```typescript
// สร้าง key ที่มี timestamp
const key = s3.generateS3Key('images', 'profile.jpg');
console.log(key);
// images/1738656000000-profile.jpg
```

## ตัวอย่างการใช้งานใน Controller

```typescript
import { Request, Response } from 'express';
import s3 from '../utils/s3';

export class AssetController {
  // อัพโหลดรูปภาพสินทรัพย์
  async uploadAssetImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await s3.uploadFromMultipart(req.file, 'assets/images');
      
      // บันทึก key ลงฐานข้อมูล
      // await assetRepository.updateImageKey(assetId, result.key);

      res.json({
        success: true,
        data: {
          key: result.key,
          url: `${process.env.S3_ENDPOINT}/${result.bucket}/${result.key}`,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  }

  // ดาวน์โหลดไฟล์
  async downloadAssetDocument(req: Request, res: Response) {
    try {
      const { key } = req.params;

      const result = await s3.downloadFile({ key });

      res.set('Content-Type', result.contentType || 'application/octet-stream');
      res.set('Content-Length', result.contentLength?.toString() || '0');

      // ส่งไฟล์กลับไป
      if (result.body) {
        result.body.pipe(res);
      }
    } catch (error) {
      console.error('Download error:', error);
      res.status(404).json({ error: 'File not found' });
    }
  }

  // สร้าง signed URL สำหรับดาวน์โหลด
  async getDownloadUrl(req: Request, res: Response) {
    try {
      const { key } = req.params;

      const result = await s3.getSignedDownloadUrl({
        key,
        expiresIn: 3600, // 1 ชั่วโมง
      });

      res.json({
        success: true,
        url: result.url,
        expiresIn: result.expiresIn,
      });
    } catch (error) {
      console.error('Generate URL error:', error);
      res.status(500).json({ error: 'Failed to generate download URL' });
    }
  }
}
```

## การจัดการ Bucket Policies

### ทำให้ไฟล์สามารถเข้าถึงได้สาธารณะ (Public Read)

```bash
# ใช้ MinIO Client (mc)
mc anonymous set download myminio/assets/public/
```

### กำหนด CORS Policy

```typescript
// ใน MinIO Console หรือใช้ AWS SDK
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

## Best Practices

1. **ใช้ Signed URLs** สำหรับการดาวน์โหลดไฟล์ที่ต้องการความปลอดภัย
2. **จัดระเบียบโครงสร้าง folder** เช่น `assets/images/`, `assets/documents/`
3. **เก็บ key ในฐานข้อมูล** แทนที่จะเก็บ URL เต็ม
4. **ใช้ metadata** เพื่อเก็บข้อมูลเพิ่มเติมเกี่ยวกับไฟล์
5. **จำกัดขนาดไฟล์** ที่อัพโหลดได้
6. **Validate file types** ก่อนอัพโหลด
7. **ใช้ environment variables** สำหรับ configuration

## Troubleshooting

### ปัญหา: Connection Refused
- ตรวจสอบว่า MinIO กำลังทำงานอยู่: `docker-compose -f docker-compose.minio.yml ps`
- ตรวจสอบ `S3_ENDPOINT` ใน `.env`

### ปัญหา: Access Denied
- ตรวจสอบ `S3_ACCESS_KEY_ID` และ `S3_SECRET_ACCESS_KEY`
- ตรวจสอบ bucket policy และ IAM permissions

### ปัญหา: Path Style Access
- สำหรับ MinIO ต้องตั้ง `S3_FORCE_PATH_STYLE=true`
- สำหรับ AWS S3 ใช้ `S3_FORCE_PATH_STYLE=false`

## เอกสารเพิ่มเติม

- [MinIO Documentation](https://min.io/docs/minio/kubernetes/upstream/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
