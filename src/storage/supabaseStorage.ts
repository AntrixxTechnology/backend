import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { StorageProvider } from './types.js';

export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, serviceRoleKey: string) {
    this.client = createClient(supabaseUrl, serviceRoleKey);
  }

  async uploadFile(file: Express.Multer.File, bucket = 'general'): Promise<string> {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;

    let targetBucket = bucket || 'general';
    let { error } = await this.client.storage
      .from(targetBucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error && targetBucket !== 'general') {
      console.warn(`[Storage] Upload to "${targetBucket}" failed (${error.message}). Falling back to "general" bucket...`);
      targetBucket = 'general';
      const retry = await this.client.storage
        .from(targetBucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });
      error = retry.error;
    }

    if (error) {
      throw new Error(`Supabase storage upload error: ${error.message}`);
    }

    // Return proxy URL hiding Supabase storage origin
    return `/api/media/${targetBucket}/${fileName}`;
  }

  private getMimeType(fileName: string, fallbackType?: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.pdf': 'application/pdf',
    };
    if (mimeMap[ext]) return mimeMap[ext];
    if (fallbackType && fallbackType !== 'application/octet-stream') return fallbackType;
    return 'image/jpeg';
  }

  async downloadFile(bucket: string, fileName: string): Promise<{ data: Buffer; contentType: string } | null> {
    try {
      const cleanFileName = decodeURIComponent(fileName);
      const { data, error } = await this.client.storage.from(bucket).download(cleanFileName);
      if (error || !data) return null;
      const buffer = Buffer.from(await data.arrayBuffer());
      return {
        data: buffer,
        contentType: this.getMimeType(cleanFileName, data.type),
      };
    } catch {
      return null;
    }
  }

  async deleteFile(fileUrl: string, bucket = 'solutions'): Promise<boolean> {
    const fileName = path.basename(fileUrl);
    const { error } = await this.client.storage.from(bucket).remove([fileName]);
    return !error;
  }
}
