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

    const { data: publicUrlData } = this.client.storage.from(targetBucket).getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  async deleteFile(fileUrl: string, bucket = 'solutions'): Promise<boolean> {
    const fileName = path.basename(fileUrl);
    const { error } = await this.client.storage.from(bucket).remove([fileName]);
    return !error;
  }
}
