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
