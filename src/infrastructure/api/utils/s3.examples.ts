// ตัวอย่างการใช้งาน S3 Utils ใน Controller
// วิธีใช้: import และเรียกใช้ตามตัวอย่างด้านล่าง

import { Request, Response } from 'express';
import s3 from './s3';

/**
 * ตัวอย่างที่ 1: อัพโหลดไฟล์จาก multipart/form-data
 * ใช้กับ Express + Multer
 */
export async function uploadFileExample(req: Request, res: Response) {
  try {
    // สมมติว่าใช้ multer middleware: upload.single('file')
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // อัพโหลดไปยัง S3/MinIO
    const result = await s3.uploadFromMultipart(req.file, 'uploads');

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        key: result.key,
        bucket: result.bucket,
        location: result.location,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}

/**
 * ตัวอย่างที่ 2: อัพโหลดไฟล์จาก Buffer
 */
export async function uploadBufferExample(req: Request, res: Response) {
  try {
    const { content, filename } = req.body;

    // แปลง content เป็น Buffer
    const buffer = Buffer.from(content, 'utf-8');

    // สร้าง key โดยใช้ helper function
    const key = s3.generateS3Key('documents', filename);

    // อัพโหลด
    const result = await s3.uploadFile({
      file: buffer,
      key: key,
      contentType: 'text/plain',
      metadata: {
        uploadedBy: 'user123',
        uploadedAt: new Date().toISOString(),
      },
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}

/**
 * ตัวอย่างที่ 3: ดาวน์โหลดไฟล์และส่งกลับเป็น response
 */
export async function downloadFileExample(req: Request, res: Response) {
  try {
    const { key } = req.params;

    // ดาวน์โหลดไฟล์
    const result = await s3.downloadFile({ key });

    // ตั้งค่า headers
    res.set('Content-Type', result.contentType || 'application/octet-stream');
    res.set('Content-Length', result.contentLength?.toString() || '0');
    res.set('Content-Disposition', `attachment; filename="${key.split('/').pop()}"`);

    // ส่งไฟล์กลับไป
    if (result.body) {
      result.body.pipe(res);
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(404).json({ error: 'File not found' });
  }
}

/**
 * ตัวอย่างที่ 4: สร้าง Signed URL สำหรับดาวน์โหลด
 */
export async function getSignedUrlExample(req: Request, res: Response) {
  try {
    const { key } = req.params;
    const expiresIn = parseInt(req.query.expiresIn as string) || 3600; // default 1 hour

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    const exists = await s3.fileExists({ key });
    if (!exists.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    // สร้าง signed URL
    const result = await s3.getSignedDownloadUrl({
      key,
      expiresIn,
    });

    res.json({
      success: true,
      url: result.url,
      expiresIn: result.expiresIn,
      expiresAt: new Date(Date.now() + result.expiresIn * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Generate URL error:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
}

/**
 * ตัวอย่างที่ 5: ลบไฟล์
 */
export async function deleteFileExample(req: Request, res: Response) {
  try {
    const { key } = req.params;

    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
    const exists = await s3.fileExists({ key });
    if (!exists.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    // ลบไฟล์
    const result = await s3.deleteFile({ key });

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
}

/**
 * ตัวอย่างที่ 6: แสดงรายการไฟล์
 */
export async function listFilesExample(req: Request, res: Response) {
  try {
    const { prefix, maxKeys } = req.query;

    const result = await s3.listFiles({
      prefix: prefix as string,
      maxKeys: maxKeys ? parseInt(maxKeys as string) : 100,
    });

    res.json({
      success: true,
      files: result.files,
      count: result.count,
      isTruncated: result.isTruncated,
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
}

/**
 * ตัวอย่างที่ 7: คัดลอกไฟล์
 */
export async function copyFileExample(req: Request, res: Response) {
  try {
    const { sourceKey, destinationKey } = req.body;

    // ตรวจสอบว่าไฟล์ต้นทางมีอยู่หรือไม่
    const exists = await s3.fileExists({ key: sourceKey });
    if (!exists.exists) {
      return res.status(404).json({ error: 'Source file not found' });
    }

    // คัดลอกไฟล์
    const result = await s3.copyFile({
      sourceKey,
      destinationKey,
    });

    res.json({
      success: true,
      message: 'File copied successfully',
      data: result,
    });
  } catch (error) {
    console.error('Copy error:', error);
    res.status(500).json({ error: 'Copy failed' });
  }
}

/**
 * ตัวอย่างที่ 8: ดาวน์โหลดไฟล์เป็น Buffer (สำหรับประมวลผลต่อ)
 */
export async function downloadAndProcessExample(req: Request, res: Response) {
  try {
    const { key } = req.params;

    // ดาวน์โหลดเป็น Buffer
    const buffer = await s3.downloadFileAsBuffer({ key });

    // ประมวลผล buffer ตามต้องการ
    // เช่น แปลงเป็น base64, ปรับขนาดภาพ, อ่านข้อมูล, etc.
    const base64 = buffer.toString('base64');

    res.json({
      success: true,
      data: {
        size: buffer.length,
        base64: base64.substring(0, 100) + '...', // ส่งแค่ส่วนหัวเพื่อ demo
      },
    });
  } catch (error) {
    console.error('Download and process error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
}

/**
 * ตัวอย่างที่ 9: สร้าง Signed URL สำหรับอัพโหลด (Client-side upload)
 */
export async function getUploadUrlExample(req: Request, res: Response) {
  try {
    const { filename, folder } = req.body;

    // สร้าง key
    const key = s3.generateS3Key(folder || 'uploads', filename);

    // สร้าง signed URL สำหรับอัพโหลด
    const result = await s3.getSignedUploadUrl({
      key,
      expiresIn: 300, // 5 minutes
    });

    res.json({
      success: true,
      uploadUrl: result.url,
      key: key,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.error('Generate upload URL error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}

/**
 * ตัวอย่างที่ 10: ตรวจสอบข้อมูลไฟล์
 */
export async function getFileInfoExample(req: Request, res: Response) {
  try {
    const { key } = req.params;

    const result = await s3.fileExists({ key });

    if (!result.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      success: true,
      exists: true,
      size: result.size,
      lastModified: result.lastModified,
      contentType: result.contentType,
      sizeInMB: result.size ? (result.size / 1024 / 1024).toFixed(2) : 0,
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
}
