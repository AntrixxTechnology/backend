import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StorageProvider } from './types.js';

export class LocalDiskStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, bucket = 'general'): Promise<string> {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const targetBucketDir = path.join(this.uploadDir, bucket);

    if (!fs.existsSync(targetBucketDir)) {
      fs.mkdirSync(targetBucketDir, { recursive: true });
    }

    const filePath = path.join(targetBucketDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    return `/uploads/${bucket}/${fileName}`;
  }

  async downloadFile(bucket: string, fileName: string): Promise<{ data: Buffer; contentType: string } | null> {
    const filePath = path.join(this.uploadDir, bucket, fileName);
    if (!fs.existsSync(filePath)) return null;
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    };
    return {
      data: buffer,
      contentType: mimeMap[ext] || 'application/octet-stream',
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl.startsWith('/uploads/')) return false;
    const relativePath = fileUrl.replace('/uploads/', '');
    const fullPath = path.join(this.uploadDir, relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  }
}
